import logger from "@/common/logger";
import { getAllPlugins, getPlugin } from "@/service/plugin";
import { IPlugin } from "@/service/schema/plugin.schema";
import vm from "vm";
import { MessageInfo, CreateProps } from "./type"
export interface PluginInstance {
  /**
   * 触发定时任务
   * @param key 
   */
  onScheduled(key: string): any
  /**
   * 获得消息
   * @param msg 
   */
  onMessage(msg: MessageInfo): any
  /**
   * 释放
   */
  dispose(): void
}
export type CreatePluginInstanceFunc = (props: CreateProps) => PluginInstance

export interface PluginCache {
  // 插件id
  pluginId: string;
  context: {
    module: {
      exports: CreatePluginInstanceFunc | null;
    };
    [key: string]: any;
  };
}
// pluginId + room_id
const running_plugins: Map<string, PluginCache> = new Map<
  string,
  PluginCache
>();





// 同步插件 只新增 不做更新处理
export async function syncPlugins() {
  let plugins = await getAllPlugins();
  for (let plugin of plugins) {
    let plugin_cache = running_plugins.get(plugin.id);
    if (!plugin_cache) {
      plugin_cache = {
        pluginId: plugin.id,
        context: {
          module: {
            exports: null,
          },
          require,
          console,
        },
      };

      try {

        vm.runInNewContext(plugin.sourceCode, plugin_cache.context);
        console.log('加载插件:' + plugin_cache.pluginId)
      } catch (err) {
        logger.error(err);
      }

      running_plugins.set(plugin.id, plugin_cache);
    }
  }
}

// 更新插件实例
export async function updatePluginCode(pluginId: string): Promise<Result> {
  let plugin = await getPlugin(pluginId);
  if (!plugin) {
    logger.error("插件不存在");
    return {
      success: false,
      msg: "插件不存在"
    };
  }

  let plugin_cache = running_plugins.get(plugin.id);
  if (!plugin_cache) {
    logger.info("新增插件:"+plugin.id);
    plugin_cache = {
      pluginId: plugin.id,
      context: {
        module: {
          exports: null,
        },
        require,
        console,
      }
    }
    running_plugins.set(pluginId, plugin_cache)
  }
  // 清空 context
  plugin_cache.context = {
    module: {
      exports: null,
    },
    require,
    console,
  }

  plugin_cache.context.module.exports = null;

  try {
    console.log('newcode',plugin.sourceCode)
    vm.runInNewContext(plugin.sourceCode, plugin_cache.context);
    logger.info('更新插件:' + plugin_cache.pluginId)
    return {
      success: true,
      msg: "更新成功"
    }
  } catch (err) {
    logger.error("更新插件失败:" + err);
    return {
      success: false,
      msg: "插件更新错误",
      data: err
    }
  }
}

/**
 * 获得插件实例
 * @param pluginId 
 * @returns 
 */
export async function getCreatePluginFunc(pluginId: string): Promise<CreatePluginInstanceFunc | null> {
  let plugin_cache = running_plugins.get(pluginId);
  if (!plugin_cache) {

    logger.info("插件cache不存在:" + pluginId + "尝试进行加载");
    await syncPlugins();
    plugin_cache = running_plugins.get(pluginId);
    if(!plugin_cache){
      logger.error('尝试加载失败')
      return null
    }
  }

  return plugin_cache.context.module.exports;
}

/**
 * 初始化
 */
export async function initPluginCache() {
  await syncPlugins();
}

