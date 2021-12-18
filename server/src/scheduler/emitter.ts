
import { IPermission } from "@/service/schema/permission.schema"
import EventEmitter from "events"
import TypedEmitter from "typed-emitter"


export interface SchedulerRecvMessageEvents {
    /**
     * 触发 同步房间插件 & 配置
     */
    syncRoomPlugins():void
    /**
     * 触发更新插件 代码
     * @param pluginId 
     */
    updatePluginCode(pluginId:string):void
    /**
     * 更新插件配置信息
     * @param p 
     */
    updatePluginPermission(p:IPermission):void

    /**
     * 同步插件
     */
    syncPlugins():void

    /**
     * 执行定时任务
     * @param pluginId 
     * @param room_wxid
     * @param key 
     */
    executeSchedule(pluginId:string,room_wxid:string,key:string):void

    
}


export const schedulerRecvEmitter = new EventEmitter() as TypedEmitter<SchedulerRecvMessageEvents>

