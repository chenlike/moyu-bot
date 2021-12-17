export interface RecvMessage {
  type: ReceiveMsgType;
  data: any;
}
export interface ReqMessage {
  type: RequestMsgType;
  data: any;
}

/**
 * 请求消息类型
 */
export enum RequestMsgType {
  /**
   * 发送文本消息
   */
  MT_SEND_TEXTMSG = 11036,

  /**
   * 发送群@消息
   */
  MT_SEND_CHATROOM_ATMSG = 11037,

  /**
   * 发送名片消息
   */
  MT_SEND_CARDMSG = 11038,

  /**
   * 发送链接消息
   */
  MT_SEND_LINKMSG = 11039,

  /**
   * 发送图片消息
   */
  MT_SEND_IMGMSG = 11040,

  /**
   * 发送文件消息
   */
  MT_SEND_FILEMSG = 11041,

  /**
   * 发送视频消息
   */
  MT_SEND_VIDEOMSG = 11042,

  /**
   * 发送GIF消息
   */
  MT_SEND_GIFMSG = 11043,

  /**
   * 获取好友列表消息
   */
  MT_DATA_FRIENDS_MSG = 11030,

  /**
   * 获取群聊列表消息
   */
  MT_DATA_CHATROOMS_MSG = 11031,

  /**
   * 获取群成员消息
   */
  MT_DATA_CHATROOM_MEMBERS_MSG = 11032,

  /**
   * 获取公众号消息
   */
  MT_DATA_PUBLICS_MSG = 11033,
}
/**
 * 接收消息类型
 */
export enum ReceiveMsgType {
  /**
   * 接收文本消息
   */
  MT_RECV_TEXT_MSG = 11046,

  /**
   * 接收图片消息
   */
  MT_RECV_PICTURE_MSG = 11047,

  /**
   * 接收视频消息
   */
  MT_RECV_VOICE_MSG = 11048,

  /**
   * 接收申请好友消息
   */
  MT_RECV_FRIEND_MSG = 11049,

  /**
   * 接收名片消息
   */
  MT_RECV_CARD_MSG = 11050,

  /**
   * 接收视频消息
   */
  MT_RECV_VIDEO_MSG = 11051,

  /**
   * 接收表情消息
   */
  MT_RECV_EMOJI_MSG = 11052,

  /**
   * 接收位置消息
   */
  MT_RECV_LOCATION_MSG = 11053,

  /**
   * 接收链接消息
   */
  MT_RECV_LINK_MSG = 11054,

  /**
   * 接收文件消息
   */
  MT_RECV_FILE_MSG = 11055,

  /**
   * 接收小程序消息
   */
  MT_RECV_MINIAPP_MSG = 11056,

  /**
   * 接收好友转账消息
   */
  MT_RECV_WCPAY_MSG = 11057,

  /**
   * 接收系统消息
   */
  MT_RECV_SYSTEM_MSG = 11058,

  /**
   * 接收撤回消息
   */
  MT_RECV_REVOKE_MSG = 11059,

  /**
   * 接收其他未知消息
   */
  MT_RECV_OTHER_MSG = 11060,

  /**
   * 接收应用类型未知消息
   */
  MT_RECV_OTHER_APP_MSG = 11061,

  /**
   * 获取群聊列表消息
   */
  MT_DATA_CHATROOMS_MSG = 11031,

  /**
   * 获取群成员消息
   */
  MT_DATA_CHATROOM_MEMBERS_MSG = 11032,


  /**
   * 定时事件
   */
  ScheduleEvent = -1000
}

/**
 * 回复消息的类型
 */
export const reply_msg = [
  ReceiveMsgType.MT_RECV_TEXT_MSG,
  ReceiveMsgType.MT_RECV_PICTURE_MSG,
  ReceiveMsgType.MT_RECV_VOICE_MSG,
  ReceiveMsgType.MT_RECV_CARD_MSG,
  ReceiveMsgType.MT_RECV_VIDEO_MSG,
  ReceiveMsgType.MT_RECV_EMOJI_MSG,
  ReceiveMsgType.MT_RECV_LOCATION_MSG,
  ReceiveMsgType.MT_RECV_FILE_MSG,
  ReceiveMsgType.MT_RECV_MINIAPP_MSG,
];
