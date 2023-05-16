import {validationResult} from "express-validator";

export default (req,res,next)=>{
    const errors=validationResult(req)//валидация запроса
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())//если ошибка то возвращает 400 статус и массив ошибок
    }

    next()
}