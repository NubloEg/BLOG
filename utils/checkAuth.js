import jwt from 'jsonwebtoken'


export default (req,res,next)=>{
const token =(req.headers.authorization||'').replace(/Bearer\s?/,'');///берем токен из запроса и убираем у него словао Bearer

if(token){
    ///Если токен есть то:
    try {
        const decoded=jwt.verify(token,'secret123')///расшифровываем токен

        req.userId=decoded._id///записываем в запрос userId
        next()///разрешаем дальнейшее выполнение функции в index.js
    }catch (err){
        return res.status(403).json({
            message:'Нет доступа'
        })
    }
}else{
    return res.status(403).json({
        message:'Нет доступа'
    })
}
}