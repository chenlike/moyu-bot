
import yaml from "js-yaml"
import fs from "fs"
import path from "path"


interface Config {
    /**
     * 服务器
     */
    server?: {
        /**
         * server host
         */
        host?: string,
        /**
         * server port
         */
        port?: number,
        /**
         * 登录 密码
         */
        password?:string
    },
    /**
     * websocket链接
     */
    websocket?:string
    /**
     * 当前微信号
     */
    wxid?:string
    /**
     * mongodb 数据库
     */
    database?:string

}
const instance = {
    config: <Config | null>null
}


export function initConfig() {
    let ymlPath = path.resolve(__dirname, "./config.yml")
    let local_ymlPath = path.resolve(__dirname, "./config.local.yml")

    if (fs.existsSync(local_ymlPath)) {
        ymlPath = local_ymlPath
    }
    const doc = yaml.load(fs.readFileSync(ymlPath, 'utf8'));
    instance.config = doc as Config
}

export function getConfig() {
    if (instance.config === null) {
        initConfig()
    }
    return instance.config!
}
export default getConfig