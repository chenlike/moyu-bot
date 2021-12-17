import { IPermission, Permission } from "./schema/permission.schema";
import { schedulerRecvEmitter } from "@/scheduler/emitter";
import { getAllPlugins } from "./plugin"
/**
 * 设置配置
 * @param p
 * @returns
 */
export async function setPermission(p: IPermission) {
  await Permission.findOneAndUpdate(
    {
      room_wxid: p.room_wxid,
      plugin_id: p.plugin_id,
    },
    {
      $set: {
        enable: p.enable,
        config: p.config,
      },
    },
    {
      upsert: true,
    }
  );

  schedulerRecvEmitter.emit("syncRoomPlugins");

  return <Result>{
    success: true,
    msg: "设置成功",
  };
}

/**
 * 获得授权信息
 * @param enable 
 * @returns 
 */
export async function getPermissions(enable?: boolean) {
  let permissions: IPermission[] = [];

  if (enable === true) {
    permissions = await Permission.find({
      enable: enable,
    });
  } else {
    permissions = await Permission.find({});
  }


  return permissions;
}



export interface RoomPluginInfo{
  pluginId:string;
  pluginName:string;
  enable:boolean,
  config:string
}
/**
 * 获得群聊插件信息
 * @param room_wxid 
 * @returns 
 */
export async function getRoomsPluginsInfo(room_wxid:string):Promise<Result<RoomPluginInfo[]>>{
    let roomPermissions = await Permission.find({room_wxid:room_wxid})

    let plugins = await getAllPlugins(true)

    let roomPlugins:RoomPluginInfo[] = []


    for(let p of plugins){

      let permission = roomPermissions.find(r=>r.plugin_id == p.id)

      roomPlugins.push({
        pluginId:p.id,
        pluginName:p.name,
        enable:permission?permission.enable:false,
        config:permission?permission.config:""
      })

    }

    return {success:true,data:roomPlugins}
}