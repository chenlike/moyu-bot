
import EventEmitter from "events"
import TypedEmitter from "typed-emitter"


export interface SchedulerRecvMessageEvents {
    /**
     * 触发 同步房间插件 & 配置
     */
    syncRoomPlugins():void
    /**
     * 触发更新插件
     * @param pluginId 
     */
    updatePlugin(pluginId:string):void
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

