import { ReceiveMsgType, RecvMessage, TextMessage,PictureMessage,EmojiMessage, wechatRecvEmitter } from "@/wechat";
import {
  initPluginCache,
  getCreatePluginFunc,
  updatePluginCode,
  syncPlugins,
  PluginInstance,
  CreatePluginInstanceFunc,

} from "./plugin-cache";
import { getPermissions } from "@/service/permission";
import { getChatroomByWxid } from "@/service/chatroom";
import { schedulerRecvEmitter } from "./emitter";
import logger from "@/common/logger";
import {   MessageInfo,MessageInfoType } from "./type";
import getConfig from "@/common/config";
import { decodeImage, downloadFile } from "@/common/utils";
import { registerSchedule } from "./time-schedule";
import {
  sendText,
  sendMentionText,
  sendPicture,
  sendFile,
} from "@/wechat/request";

import { IChatroom } from "@/service/schema/chatroom.schema";
import { Command } from 'commander';

interface RoomPluginInfo {
  /**
   * 插件配置
   */
  config: string;
  /**
   * 插件id
   */
  pluginId: string;

  /**
   * 实例
   */
  instance: PluginInstance | null;
}

interface RoomPlugins {
  room_wxid: string;
  plugins: RoomPluginInfo[];
}

const roomsPlugin: Map<string, RoomPlugins> = new Map<string, RoomPlugins>();

// const moyuCommander = new Command("moyu");
// TODO moyu Commander


/**
 * 同步房间插件 & 配置
 */
async function syncRoomPlugins() {
  let permissions = await getPermissions(true);

  for (let permission of permissions) {
    let roomPlugins = roomsPlugin.get(permission.room_wxid);
    if (!roomPlugins) {
      roomPlugins = {
        room_wxid: permission.room_wxid,
        plugins: [],
      };
      roomsPlugin.set(permission.room_wxid, roomPlugins);
    }

    let plugin = roomPlugins.plugins.find(
      (p) => p.pluginId == permission.plugin_id
    );
    if (!plugin) {
      plugin = {
        config: permission.config,
        pluginId: permission.plugin_id,
        instance: null,
      };
      roomPlugins.plugins.push(plugin);
    } else {
      plugin.config = permission.config;
    }
  }
}

function getRoomPluginInstance(room_wxid: string, pluginId: string) {
  const config = getConfig();

  let roomInstance = roomsPlugin.get(room_wxid);
  if (!roomInstance) {
    return;
  }
  let plugin = roomInstance.plugins.find((p) => p.pluginId == pluginId);
  if (!plugin) {
    return null;
  }

  let createFunc = getCreatePluginFunc(plugin.pluginId);
  if (createFunc == null && typeof createFunc != "function") {
    logger.error("获得createFunc 错误");
    return null;
  }

  plugin.instance = createFunc({
    self_wxid: config.wxid!,
    room_wxid: room_wxid,
    config: plugin.config,
    getRoomInfo() {
      return getChatroomByWxid(room_wxid);
    },
    sendText(content: string) {
      sendText(room_wxid, content);
    },
    sendMentionText(content: string, at_list: string[]) {
      sendMentionText(room_wxid, content, at_list);
    },
    sendPicture(filePath: string) {
      sendPicture(room_wxid, filePath);
    },
    sendFile(filePath: string) {
      sendFile(room_wxid, filePath);
    },
    registerSchedule(key: string, rule: string) {
      registerSchedule(pluginId, key,room_wxid, rule);
    },
  });

  return plugin.instance;
}


/**
 * 监听消息
 */
function handleMessage() {
  const config = getConfig();

  if (!config.wxid) {
    throw new Error("wxid 不能为空");
  }

  function executePlugin(msg: RecvMessage) {
    let roomInstance = roomsPlugin.get(msg.data.room_wxid);
    if (!roomInstance) {
      return;
    }
    const room_wxid = msg.data.room_wxid;
    // 忽略自己的消息
    if (msg.data.from_wxid == config.wxid) {
      return;
    }


    // 消息对象
    const msgInfo: MessageInfo = {
      type: "text",
      mentionSelf: false,
      mention_list: [],
      text: "",
      raw: "",
      async getSenderInfo() {
        if (msg.data.from_wxid) {
          let room = await getChatroomByWxid(room_wxid);
          if (!room) {
            return null;
          }
          let target = room.member_list.find(
            (t) => t.wxid == msg.data.from_wxid
          );
          return target;
        }
        return null;
      },
      savePicture() {
        if(msg.data.image){
          return decodeImage(msg.data.image);
        }
        throw new Error("NOT SUPPORT");
      },
    };

    // 根据不同类型进行处理
    if (msg.type == ReceiveMsgType.MT_RECV_TEXT_MSG) {
      msgInfo.type = "text";
      const d = msg as TextMessage
      msgInfo.mention_list = d.data.at_user_list;
      msgInfo.mentionSelf = d.data.at_user_list.includes(config.wxid!);
      msgInfo.text = d.data.msg
      msgInfo.raw = d.data.msg
    } else if (msg.type == ReceiveMsgType.MT_RECV_PICTURE_MSG) {
      msgInfo.type = "picture";
      const d = msg as PictureMessage
      msgInfo.raw = d.data.raw_msg
    } else if (msg.type == ReceiveMsgType.MT_RECV_EMOJI_MSG) {
      msgInfo.type = "emoji";
      const d = msg as EmojiMessage
      msgInfo.raw = d.data.raw_msg
    }

    const freezedMsgInfo = Object.freeze(msgInfo);

    for (let plugin of roomInstance.plugins) {
      try {
        const instance = getRoomPluginInstance(room_wxid, plugin.pluginId);

        if (instance == null) {
          continue;
        }

        if (instance.onMessage && typeof instance.onMessage == "function") {
          instance.onMessage(freezedMsgInfo);
        }
      } catch (err) {
        logger.error(err);
      }
    }
  }

  // 文本消息
  wechatRecvEmitter.on("onTextMessage", (msg) => {
    executePlugin(msg);
  });

  // 图片消息
  wechatRecvEmitter.on("onPictureMessage", (msg) => {
    executePlugin(msg);
  });

  // 动画表情
  wechatRecvEmitter.on("onEmojiMessage", (msg) => {
    executePlugin(msg);
  });
  // 定时任务
  schedulerRecvEmitter.on("executeSchedule", (pluginId,room_wxid, key) => {
    let roomInstance = roomsPlugin.get(room_wxid);
    if (!roomInstance) {
      return
    }
    try{
      const instance = getRoomPluginInstance(room_wxid, pluginId);
      if(instance == null){
        return
      }

      if (instance.onScheduled && typeof instance.onScheduled == "function") {
        instance.onScheduled(key);
      }
    }catch(err){
      logger.error(err)
    }

  });
}
/**
 * 初始化 调度者
 */
export async function initScheduler() {
  await initPluginCache();

  schedulerRecvEmitter.on("syncRoomPlugins", () => {
    syncRoomPlugins();
  });
  schedulerRecvEmitter.on("updatePlugin", (id) => {
    // 更新插件实例  先把当前缓存的插件实例 清除
    for (let room_wxid of roomsPlugin.keys()) {
      let roomInstance = roomsPlugin.get(room_wxid);
      if (!roomInstance) {
        continue;
      }
      let plugin = roomInstance.plugins.find((p) => p.pluginId == id);
      if (!plugin) {
        continue;
      }

      if(plugin.instance != null){
        try{
          if(plugin.instance.dispose && typeof plugin.instance.dispose == "function"){
            plugin.instance.dispose();
          }
        }catch(err){
          logger.error(err)
        }
      }
      plugin.instance = null;
    }
    updatePluginCode(id);
  });
  schedulerRecvEmitter.on("syncPlugins", () => {
    syncPlugins();
  });

  syncRoomPlugins();
  handleMessage();
}

/*
    module.exports = function(msg){

      console.log('inside')
      if(msg.text == 'plg'){
        msg.sendText('plgsb')
      }
      msg.sendText(msg.type)
    }
*/


