import mongoose from "mongoose";

/**
 * 插件授权
 */
export interface IPermission {
    /**
     * 房间id
     */
    room_wxid:string
    /**
     * 插件id
     */
    plugin_id:string
    /**
     * 是否启用
     */
    enable:boolean
    /**
     * 插件 配置
     */
    config:string
}

export const Permission = mongoose.model<IPermission>(
  "Permission",
  new mongoose.Schema({
    room_wxid: String,
    plugin_id: String,
    enable:Boolean,
    config:String
  })
);
