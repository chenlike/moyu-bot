import { Express } from "express";
import { auth } from "@/web/middleware";
import * as service from "@/service/plugin";
import * as permissionService from "@/service/permission";
export default function (app: Express) {
  // 创建插件
  app.post("/api/plugin/createPlugin", auth, async (req, res) => {
    res.send(await service.createPlugin(req.body));
  });

  // 更新插件
  app.post("/api/plugin/updatePlugin", auth, async (req, res) => {
    res.send(await service.updatePlugin(req.body));
  });

  // 获得所有插件
  app.get("/api/plugin/getAllPlugins", auth, async (req, res) => {
    res.send(<Result>{ success: true, msg: "获取成功", data: await service.getAllPlugins(true) });
  });

  // 获得插件详情
  app.get("/api/plugin/getPlugin", auth, async (req, res) => {
    if (!req.query.id) {
      return res
        .status(400)
        .send(<Result>{ success: false, msg: "id不能为空" });
    }
    let id = req.query.id as string;
    res.send(<Result>{ success: true, msg: "获取成功", data: await service.getPlugin(id) });
  });

  // 群聊 插件信息
  app.get("/api/plugin/roomPlugins", auth, async (req, res) => {
    if (!req.query.id) {
      return res
        .status(400)
        .send(<Result>{ success: false, msg: "id不能为空" });
    }
    let roomId = req.query.roomId as string;
    res.send(<Result>{ success: true, msg: "获取成功", data: await permissionService.getRoomsPluginsInfo(roomId) });
  });


  // 设置授权信息
  app.post("/api/plugin/setPermission",auth,async (req,res)=>{
    res.send(await permissionService.setPermission(req.body))
  })


}


