import { Express } from "express"
import { auth } from "@/web/middleware"
import * as service from "@/service/chatroom"
export default function(app:Express){
    app.post('/api/room/sync',auth, async (req, res)=>{

        await service.syncChatrooms()

        res.send(<Result>{success:true,msg:"同步成功"})
    })

    app.get("/api/room",auth,async (req,res)=>{
        let rooms = await service.getAllChatrooms()
        
        res.send(<Result>{success:true,msg:"获取成功",data:rooms})
    })




}