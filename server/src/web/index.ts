
import express from "express"
import { getConfig } from "@/common/config"
import logger from "@/common/logger";
import session from "express-session"
import bodyParser from "body-parser"

import authRoutes from "./controllers/auth"
import roomRoutes from "./controllers/room"
import pluginRoutes from "./controllers/plugin"


const app = express()


function initRoutes(){
    app.use(bodyParser.json())
    app.use(session({
        secret: 'moyu-bot',
        resave: false, 
        saveUninitialized: true  
    }))



    authRoutes(app)
    roomRoutes(app)
    pluginRoutes(app)
    
}


export function initWeb(){
    const config = getConfig()

    let port = 6000;
    let hostname = "0.0.0.0"

    if(config.server){
        port = config.server.port ?? 6000;
        hostname = config.server.host ?? "0.0.0.0"
    }
    // 初始化路由
    initRoutes()

    app.listen(port,hostname, () => {
        logger.info(`web listening at http://${hostname}:${port}`)
    })
}
