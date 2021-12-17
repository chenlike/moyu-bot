
import * as wechatType from "./types"

import EventEmitter from "events"
import TypedEmitter from "typed-emitter"


export interface WechatRecvMessageEvents {
  /**
   * 文本消息
   * @param msg 
   */
  onTextMessage(msg:wechatType.TextMessage):void
  /**
   * 图片消息
   * @param msg 
   */
  onPictureMessage(msg:wechatType.PictureMessage):void
  /**
   * 表情消息
   */
  onEmojiMessage(msg:wechatType.EmojiMessage):void

  /**
   * 获得群组信息反馈
   * @param msg 
   */
  onGetChatroomList(msg:wechatType.GetChatroomResult):void
  /**
   * 获得群成员消息
   * @param msg 
   */
  onGetChatroomMemberInfo(msg:wechatType.GetChatroomMembersResult):void
}


export const wechatRecvEmitter = new EventEmitter() as TypedEmitter<WechatRecvMessageEvents>

