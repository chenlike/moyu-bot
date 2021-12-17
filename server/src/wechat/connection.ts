import Websocket from "ws";
import { getConfig } from "@/common/config";
import logger from "@/common/logger";
import * as wechatType from "./types";
import { wechatRecvEmitter } from "./emitter";
import * as chatroom from "@/service/chatroom";

const state = {
  ws: <Websocket | null>null,
  // 加载完毕
  initOver:false
};

async function onConnected() {
  // 同步群组信息
  await chatroom.syncChatrooms();
  state.initOver = true
  logger.info("初始化 wechat 结束")
}


// 未初始化完成允许通过的type 
const unInitedAllowTypes = [wechatType.ReceiveMsgType.MT_DATA_CHATROOMS_MSG, wechatType.ReceiveMsgType.MT_DATA_CHATROOM_MEMBERS_MSG]

export function initConnection() {
  const config = getConfig();

  const wsUrl = config.websocket;

  if (wsUrl == undefined) {
    throw new Error("wsUrl 未配置");
  }
  state.ws = new Websocket(wsUrl);

  state.ws.on("open", async () => {
    logger.info("wechat connection open");
    await onConnected();
  });

  state.ws.on("message", (data) => {
    const str = data.toString("utf-8");
    let msg: wechatType.RecvMessage = JSON.parse(str);


    // 未初始化完成前不接受 一般消息
    if(state.initOver == false &&  unInitedAllowTypes.indexOf(msg.type) == -1){
      return;
    }

 

    switch (msg.type) {
      case wechatType.ReceiveMsgType.MT_RECV_TEXT_MSG:
        wechatRecvEmitter.emit("onTextMessage", msg as wechatType.TextMessage);
        break;
      case wechatType.ReceiveMsgType.MT_RECV_PICTURE_MSG:
        wechatRecvEmitter.emit(
          "onPictureMessage",
          msg as wechatType.PictureMessage
        );
        break;
      case wechatType.ReceiveMsgType.MT_RECV_EMOJI_MSG:
        wechatRecvEmitter.emit(
          "onEmojiMessage",
          msg as wechatType.EmojiMessage
        );
        break;
      case wechatType.ReceiveMsgType.MT_DATA_CHATROOMS_MSG:
        wechatRecvEmitter.emit(
          "onGetChatroomList",
          msg as wechatType.GetChatroomResult
        );
        break;
      case wechatType.ReceiveMsgType.MT_DATA_CHATROOM_MEMBERS_MSG:
        wechatRecvEmitter.emit(
          "onGetChatroomMemberInfo",
          msg as wechatType.GetChatroomMembersResult
        );
        break;
    }

  });
  state.ws.on("close", () => {
    logger.info("wechat connection close");
    state.initOver = false;
  });
}

/**
 * 发送请求
 * @param req
 * @returns
 */
export function sendRequest(req: wechatType.ReqMessage) {
  if (state.ws == null) {
    return;
  }
  state.ws.send(JSON.stringify(req));
}
