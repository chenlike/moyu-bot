import { Express } from "express"
import { getConfig } from "@/common/config"
import { guid } from "@/common/utils"
import { auth } from "@/web/middleware"

export default function(app:Express){
    const config = getConfig()
    let password = config.server?.password
    if(!password){
        password = guid()
        console.log("由于没有配置密码，默认使用随机密码:" + password)
    }
    
    app.post('/api/auth/login', (req, res)=>{
        // 判断用户提交的登录信息是否正确
        if(req.body.password != password) {
            return res.send(<Result>{success:false,msg:"密码错误"})
        }
        const session = req.session as any
        session.isLogin = true
        res.send(<Result>{success:true,msg:"登录成功"})
    })

    app.get("/api/auth",auth,(req,res)=>{
        res.send(<Result>{success:true,msg:"OK"})
    })


}