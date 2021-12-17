import { getChatrooms,getChatroomMembers } from "@/wechat";

import { Chatroom } from "./schema/chatroom.schema";

/**
 * 同步群聊
 */
export async function syncChatrooms() {
  let rooms = await getChatrooms();


  for(let room of rooms.data){
    let members = await getChatroomMembers(room.wxid);
    let member_list = members.data.member_list.map(m=>{
        return {
            wxid:m.wxid,
            nickname:m.nickname,
            remark:m.remark,
            avatar:m.avatar,
        }
    })

    await Chatroom.findOneAndUpdate(
        {
          wxid: room.wxid,
        },
        {
            $set: {
                name: room.nickname,
                avatar: room.avatar,
                manager_wxid: room.manager_wxid,
                member_list: member_list,
            }
        },
        {
          upsert: true,
        }
    );

  }
}

/**
 * 获得群聊信息
 * @returns 
 */
export async function getAllChatrooms(){
    let res = await Chatroom.find({})
    return res;
}
/**
 * 通过wxid查找群聊
 * @param wxid 
 * @returns 
 */
export async function getChatroomByWxid(wxid:string){
    let res = await Chatroom.findOne({wxid:wxid})
    return res;
}

