import * as wechatType from "./types";
import { sendRequest } from "./connection";
import { wechatRecvEmitter } from "./emitter";
import EventEmitter from "events"
/**
 * 发送文本消息
 * @param to_wxid
 * @param content
 */
export function sendText(to_wxid: string, content: string) {
  sendRequest({
    type: wechatType.RequestMsgType.MT_SEND_TEXTMSG,
    data: {
      to_wxid,
      content,
    },
  });
}

/**
 * 发送群 @ 消息
 * @param to_wxid
 * @param content
 * @param at_list @ 人列表
 */
export function sendMentionText(
  to_wxid: string,
  content: string,
  at_list: string[]
) {
  sendRequest({
    type: wechatType.RequestMsgType.MT_SEND_CHATROOM_ATMSG,
    data: {
      to_wxid,
      content,
      at_list,
    },
  });
}

/**
 * 发送图片消息
 * @param to_wxid
 * @param file
 */
export function sendPicture(to_wxid: string, file: string) {
  sendRequest({
    type: wechatType.RequestMsgType.MT_SEND_IMGMSG,
    data: {
      to_wxid,
      file,
    },
  });
}

/**
 * 发送文件
 * @param to_wxid
 * @param file
 */
export function sendFile(to_wxid: string, file: string) {
  sendRequest({
    type: wechatType.RequestMsgType.MT_SEND_FILEMSG,
    data: {
      to_wxid,
      file,
    },
  });
}




// 获得群聊列表 emitter
const getRoomsEmitter = new EventEmitter();

wechatRecvEmitter.on("onGetChatroomList", (msg) => {
    getRoomsEmitter.emit("success",msg)
});

/**
 * 获得群聊列表
 * @returns 
 */
export function getChatrooms(): Promise<wechatType.GetChatroomResult> {
  return new Promise<wechatType.GetChatroomResult>((resolve, reject) => {
    getRoomsEmitter.once("success",(msg)=>{
        resolve(msg)
    })
    sendRequest({
        type: wechatType.RequestMsgType.MT_DATA_CHATROOMS_MSG,
        data:{}
    })
  });
}


// 获得群聊成员 emitter
const getRoomMembersEmitter = new EventEmitter();
wechatRecvEmitter.on("onGetChatroomMemberInfo", (msg) => {
    getRoomMembersEmitter.emit(msg.data.group_wxid,msg)
});

/**
 * 获得群聊成员
 * @param room_wxid 
 * @returns 
 */
export function getChatroomMembers(room_wxid:string): Promise<wechatType.GetChatroomMembersResult>{
    return new Promise<wechatType.GetChatroomMembersResult>((resolve, reject) => {
        getRoomMembersEmitter.once(room_wxid,(msg)=>{
            resolve(msg)
        })
        sendRequest({
            type: wechatType.RequestMsgType.MT_DATA_CHATROOM_MEMBERS_MSG,
            data:{
                room_wxid:room_wxid
            }
        })
      });
}