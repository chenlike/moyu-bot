import schedule from "node-schedule"

import { schedulerRecvEmitter } from "./emitter"




/**
 * 注册定时任务 
 * @param pluginId 
 * @param key 
 * @param room_wxid 
 * @param rule 
 */
export function registerSchedule(pluginId: string, key: string,room_wxid:string, rule: string) {

    const jobName = `${pluginId}:${key}:${room_wxid}`

    if(schedule.scheduledJobs[jobName] != undefined){
        schedule.cancelJob(jobName)
    }

    schedule.scheduleJob(jobName, rule, function () {
        schedulerRecvEmitter.emit("executeSchedule",pluginId,room_wxid,key)
    });


}

