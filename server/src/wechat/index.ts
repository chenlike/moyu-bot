export * from "./types"
export * from "./request"
import { initConnection } from "./connection"

export { wechatRecvEmitter } from "./emitter"

export function initWechat(){
    // 初始化链接
    initConnection()
}