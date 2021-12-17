import mongoose from "mongoose";

export interface Member{
  // 微信号
  wxid:string,
  // 昵称
  nickname:string,
  // 备注名
  remark:string,
  //头像
  avatar:string,
}

export interface IChatroom  {
  // 群聊 wxid
  wxid: string;
  // 名称
  name: string;
  // 头像
  avatar?: string;
  // 群主id
  manager_wxid?: string;
  // 成员
  member_list: Member[];
}

export const Chatroom = mongoose.model<IChatroom>(
  "Chatroom",
  new mongoose.Schema({
    wxid: {
      type: String,
      unique: true,
    },
    name: String,
    avatar: String,
    manager_wxid: String,
    member_list: Array,
  })
);




