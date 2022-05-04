
import express from "express"
import { getConfig } from "@/common/config"
import logger from "@/common/logger";
import session from "express-session"
import bodyParser from "body-parser"

import authRoutes from "./controllers/auth"
import roomRoutes from "./controllers/room"
import openRoutes from "./controllers/open"
import pluginRoutes from "./controllers/plugin"

const app = express()


function initRoutes() {





    app.use(express.static("wwwroot"))
    app.use('/assets', express.static(__dirname + '/wwwroot/assets'));
    //发送index.html页面到域名,使得输入服务器地址后就是这个页面
    app.get('/', (req, res) => {
        res.sendFile(__dirname + "/wwwroot/" + "index.html")        //设置/ 下访问文件位置
    });
    app.use(bodyParser.json())
    app.use(session({
        secret: 'moyu-bot',
        resave: false,
        saveUninitialized: true
    }))



    authRoutes(app)
    roomRoutes(app)
    openRoutes(app)
    pluginRoutes(app)

}


export function initWeb() {
    const config = getConfig()

    let port = 6000;
    let hostname = "0.0.0.0"

    if (config.server) {
        port = config.server.port ?? 6000;
        hostname = config.server.host ?? "0.0.0.0"
    }
    // 初始化路由
    initRoutes()

    app.listen(port, hostname, () => {
        logger.info(`web listening at http://${hostname}:${port}`)
    })
}
