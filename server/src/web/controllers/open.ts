import { Express } from "express";
import { openAuth } from "@/web/middleware"
import { sendText,sendMentionText } from "@/wechat/request"

export default function (app: Express) {
  interface SendTextBody{
    content:string
    wxid:string
  }
  // 发送文本消息
  app.post("/api/open/sendText",openAuth,async (req,res)=>{
    console.log('req header:',req.headers)
    console.log('req body:',req.body)
    const body = req.body as SendTextBody
    if(body.content == "" || body.wxid == ""){
      return res
        .status(400)
        .send(<Result>{ success: false, msg: "wxid或者content不能为空" });
    }
    
    sendText(body.wxid,body.content)
    res.send(<Result>{ success: true, msg: "发送成功"});
  })




}


