import { RequestHandler } from "express"





export const auth:RequestHandler = (req,res,next)=>{
    const session = req.session as any
    if(session.isLogin === true){
        next()
    }else{
        res.status(401).send(<Result>{success:false,msg:"未登录"})
    }
}