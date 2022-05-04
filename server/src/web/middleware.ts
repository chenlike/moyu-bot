import { RequestHandler } from "express"
import { getConfig } from "@/common/config"
import dayjs from "dayjs"
import crypto from "crypto"

function md5(data: string) {
    let hash = crypto.createHash('md5');
    return hash.update(data).digest("hex")
}


export const auth: RequestHandler = (req, res, next) => {
    const session = req.session as any
    if (session.isLogin === true) {
        next()
    } else {
        res.status(401).send(<Result>{ success: false, msg: "未登录" })
    }
}


export const openAuth: RequestHandler = (req, res, next) => {
    const config = getConfig()

    const token = req.header("token")
    if (token == undefined) {
        res.status(401).send(<Result>{ success: false, msg: "未登录 undefined" })
        return
    }
    const timestamp = req.header("timestamp")
    if (token == undefined) {
        res.status(401).send(<Result>{ success: false, msg: "timestamp 错误" })
        return
    }

    const date = parseInt(timestamp!)
    const now = Date.now()
    // 超过2分钟过期
    if ((now - date) > 2 * 60 * 1000) {
        res.status(401).send(<Result>{ success: false, msg: "timestamp 过期" })
        return
    }






    let correct = md5(config.server!.password + timestamp!)
    if (token.toUpperCase() == correct.toUpperCase()) {
        next()
    } else {
        res.status(401).send(<Result>{ success: false, msg: "验签失败" })
        return
    }

}