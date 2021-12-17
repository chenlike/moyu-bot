import * as wechatType from "./wechat";
export interface TextMessage {
  type: wechatType.ReceiveMsgType.MT_RECV_TEXT_MSG;
  data: {
    /**
     * @人的列表
     */
    at_user_list: string[];
    /**
     * 发送人
     */
    from_wxid: string;
    /**
     * 消息
     */
    msg: string;
    /**
     * 群聊 wxid
     */
    room_wxid: string;
    /**
     * 接收者的wxid
     */
    to_wxid: string;
  };
}

export interface PictureMessage {
  type: wechatType.ReceiveMsgType.MT_RECV_PICTURE_MSG;
  data: {
    // 发送人
    from_wxid: string;
    // 图片 dat路径
    image: string;
    // 缩略图 dat路径
    image_thumb: string;
    raw_msg: string;
    // 群聊
    room_wxid: string;
    // 接受者
    to_wxid: string;
  };
}
/**
 * 表情消息
 */
export interface EmojiMessage {
  type: wechatType.ReceiveMsgType.MT_RECV_EMOJI_MSG;
  data: {
    from_wxid: string;
    raw_msg: string;
    room_wxid: string;
    to_wxid: string;
  };
}
/**
 * 文件消息
 */
export interface FileMessage {
  type: wechatType.ReceiveMsgType.MT_RECV_FILE_MSG;
  data: {
    from_wxid: string;
    raw_msg: string;
    room_wxid: string;
    to_wxid: string;
  };
}

export interface ChatroomInfo {
  //wxid
  wxid: string;
  //微信昵称
  nickname: string;
  //头像的url地址
  avatar: string;
  //群主的wxid
  manager_wxid: string;
  //该群成员总数
  total_member: number;
  //自己是否为群主:0不是，1是
  is_manager: number;
  //成员
  member_list: string[];
}
/**
 * 获得群聊 反馈
 */
export interface GetChatroomResult {
  type: wechatType.ReceiveMsgType.MT_DATA_CHATROOMS_MSG;
  data: ChatroomInfo[];
}

export interface ChatroomMemberInfo {
    wxid: string; //wxid
    account?: string; //微信号(有可能为空)
    nickname: string; //微信昵称
    remark: string; //好友备注
    avatar: string; //头像的url地址
    sex: number; //性别:0或者1,默认是0,1代表女性
    country?: string; //祖国(可能为空)
    province?: string; //省份(可能为空)
    city?: string; //城市(可能为空)
}
/**
 * 获得群聊成员
 */
export interface GetChatroomMembersResult {
    type: wechatType.ReceiveMsgType.MT_DATA_CHATROOM_MEMBERS_MSG;
    data: {
        group_wxid : string,
        total : number,
        member_list:ChatroomMemberInfo[]
    }
}


