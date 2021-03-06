import { Plugin, IPlugin } from "./schema/plugin.schema"
import { schedulerRecvEmitter } from "@/scheduler/emitter"





/**
 * 创建插件
 * @param plugin 
 * @returns 
 */
export async function createPlugin(plugin: IPlugin): Promise<Result> {
    if (plugin.id == "") {
        return {
            success: false,
            msg: "插件id不能为空"
        }
    }
    if (plugin.name == "") {
        return {
            success: false,
            msg: "插件名称不能为空"
        }
    }

    let plugin_exist = await Plugin.findOne({ id: plugin.id })
    if (plugin_exist) {
        return {
            success: false,
            msg: "插件id已经存在"
        }
    }

    let new_plugin = new Plugin(plugin)
    await new_plugin.save()


    try {
        schedulerRecvEmitter.emit("updatePluginCode", plugin.id)
    } catch (err) {
        console.log(err)
        return {
            success: false,
            msg: "保存完成 但插件代码有错误",
            data:err
        }
    }


    return {
        success: true,
        msg: "新增成功"
    }
}

/**
 * 更新插件
 * @param plugin 
 */
export async function updatePlugin(plugin: IPlugin): Promise<Result> {
    if (plugin.id == "") {
        return {
            success: false,
            msg: "插件id不能为空"
        }
    }
    if (plugin.name == "") {
        return {
            success: false,
            msg: "插件名称不能为空"
        }
    }

    let plugin_exist = await Plugin.findOne({ id: plugin.id })
    if (!plugin_exist) {
        return {
            success: false,
            msg: "插件不存在"
        }
    }


    await Plugin.updateOne({ id: plugin.id }, plugin)

    try {
        schedulerRecvEmitter.emit("updatePluginCode", plugin.id)
    } catch (err) {
        console.log(err)
        return {
            success: false,
            msg: "保存完成 但插件代码有错误",
            data:err
        }
    }


    return {
        success: true,
        msg: "保存成功"
    }
}

/**
 * 获得所有插件
 * @returns 
 */
export async function getAllPlugins(onlyInfo?: boolean): Promise<IPlugin[]> {
    if (onlyInfo === true) {
        let res = await Plugin.find({}, { id: 1, name: 1 })
        return res
    } else {
        let res = await Plugin.find({})
        return res;
    }
}

/**
 * 获得插件
 * @param pluginId 
 * @returns 
 */
export async function getPlugin(pluginId: string) {
    let res = await Plugin.findOne({ id: pluginId })
    return res;
}