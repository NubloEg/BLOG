import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

import {registerValidation, loginValidation, postValidation} from './validations.js'




import checkAuth from "./utils/checkAuth.js";
import {getMe, login, register} from "./controller/UserController.js";
import {create, getAll, getOne, remove, update} from "./controller/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";


///Подключение к базе данных
mongoose.connect(
'mongodb+srv://boroda4kak:eeggoorr1@cluster0.mwh4zpi.mongodb.net/blog?retryWrites=true&w=majority'
).then(()=>console.log('DB ok'))
.catch(()=>console.log('DB error'))


const app=express()
app.use(express.json())//Функция чтобы express понимал json

const storage=multer.diskStorage({
    destination:(_,__,cb)=>{
        cb(null,'uploads')
    },
    filename:(_,file,cb)=>{
        cb(null,file.originalname)
    },

})

const upload=multer({storage})
app.use('/uploads',express.static('uploads'))

app.post('/auth/login',loginValidation,handleValidationErrors,login)///Авторизация
app.post('/auth/register',registerValidation,handleValidationErrors,register)////Регистрация
app.get('/auth/me',checkAuth,getMe)

app.post('/upload', checkAuth,upload.single('image'),(req,res)=>{
    res.json({
        url:`/uploads/${req.file.originalname}`
    })
})

app.post('/posts',checkAuth,postValidation,handleValidationErrors,create)
app.get('/posts',getAll)
app.get('/posts/:id',getOne)
app.delete('/posts/:id',checkAuth,remove)
app.patch('/posts/:id',checkAuth,postValidation,handleValidationErrors,update)

////ЗАПУСК СЕРВЕРА

app.listen(4444,(err)=>{
    if(err){
        return console.log(err)//если сервер не запустился то возвращаем ошибку
    }

    console.log('сервер запущен')
})
