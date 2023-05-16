import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register=async (req,res)=>{
    try {

        ///шифрование пароля с помощью библиотеки bcrypt
        const password=req.body.password;
        const salt=await bcrypt.genSalt(10)
        const hash=await bcrypt.hash(password,salt)


        ///создания модуля Юзера со всеми параметрами
        const doc=new UserModel({
            email:req.body.email,
            fullName:req.body.fullName,
            avatarUrl:req.body.avatarUrl,
            passwordHash:hash
        });


        const user = await doc.save();//сохранение пользователя в базу данных

        const token=jwt.sign({
                _id:user._id
            },
            'secret123',
            {
                expiresIn:'30d'///сколько токен будет действителен(30дней)
            }
        )

        const {passwordHash,...userData}=user._doc


        res.json({
            ...userData,
            token
        })
    } catch (err) {
        res.status(500).json({
            message:'Регестрация не удалась'
        })
    }
}

export const login=async(req,res)=> {
    try {
        const user=await UserModel.findOne({email: req.body.email})//находим полльзователя в базе по email

        if (!user){///Если пользователь не найдет то ошибка
            return res.status(404).json({
                message:'Пользователь не найден'
            })
        }

        const isValidPass=await bcrypt.compare(req.body.password,user._doc.passwordHash)///Сравнение введенного пароля и пароля из базы

        if(!isValidPass){
            return res.status(400).json({
                message:'Неверный логин или пароль'
            })
        }
        const token=jwt.sign({
                _id:user._id
            },
            'secret123',
            {
                expiresIn:'30d'///сколько токен будет действителен(30дней)
            }
        )

        const {passwordHash,...userData}=user._doc


        res.json({
            ...userData,
            token
        })

    }catch (err){
        res.status(500).json({
            message:'Автаризация не удалась'
        })
    }
}

export const getMe=async (req,res)=>{
    try{
        const user= await UserModel.findById(req.userId)///Находим пользователя по id полученному из checkAuth

        if(!user){
            return res.status(403).json({
                message:'Пользователь не найден'
            })
        }
        const {passwordHash,...userData}=user._doc
        res.json(userData)////забираем инфу о пользователе без Hash пароля и передаем
    }catch(err){
        res.status(500).json({
            message:"Нет доступа"
        })
    }
}