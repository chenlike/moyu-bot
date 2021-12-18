<script lang="ts" setup>
import { ref, reactive, onMounted, computed, nextTick } from "vue"
import { NLayout, NLayoutSider, NMenu, NFormItem, NForm, NInput, NButton, NThing, useMessage } from "naive-ui"
import request from "@/public/request"
import * as monaco from "monaco-editor"
import { libString } from "@/monaco/extraLib"


import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// monaco 特殊处理
// https://github.com/vitejs/vite/discussions/1791
self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}


const message = useMessage()




interface IPlugin {
    /**
     * 插件id  唯一 
     */
    id: string;
    /**
     * 插件名称
     */
    name: string;
    /**
     * 代码
     */
    sourceCode: string;
}

const state = reactive({
    // 插件列表
    plugins: <IPlugin[]>[],


    // 是否是创建新插件
    isCreate: false,
    // 选择插件的信息
    choosePluginInfo: <IPlugin | null>null
})



const pluginListOption = computed(() => {
    return state.plugins.map(plugin => {
        return {
            label: plugin.name,
            key: plugin.id
        }
    })
})
const currentChoosePluginId = computed(() => {
    if (state.choosePluginInfo == null || state.isCreate) {
        return ""
    }
    return state.choosePluginInfo.id
})


async function getAllPlugins() {
    let res = await request.get("/api/plugin/getAllPlugins")
    state.plugins = res.data.data
    if (state.plugins.length > 0) {
        choosePlugin(state.plugins[0].id)
    }
}
// 选择插件
async function choosePlugin(pluginId: string) {
    let res = await request.get("/api/plugin/getPlugin", {
        params: {
            id: pluginId
        }
    })
    state.choosePluginInfo = res.data.data
    state.isCreate = false
    nextTick(() => {
        loadEditor()
    })
}


let editor: monaco.editor.IStandaloneCodeEditor | null = null
function loadEditor() {
    if (editor == null) {

        // compiler options
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            allowJs: true,
            allowNonTsExtensions: true,
            checkJs: true
        });

        // extra libraries
        monaco.languages.typescript.javascriptDefaults.addExtraLib(libString, 'node_modules/moyu.d.ts');




        editor = monaco.editor.create(document.getElementById('code-editor')!, {
            value: "",
            language: "javascript",
            theme: "vs-dark",


        })
    }
    editor.setValue(state.choosePluginInfo?.sourceCode ?? "")

}

async function createNewPlugin() {
    state.choosePluginInfo = {
        id: "",
        name: "",
        sourceCode: `
// 储存数据 MongoDB 
// const mongo = require("mongoose")
// const 你的Model = mongo.model("schema名", new mongo.Schema({
//   name: String, // 对应字段
//   aaa:String
// }))

const axios = require("axios")


/**
 * 入口
 * @param {import('moyu').CreateProps} props
 * @returns {import('moyu').PluginInstance} instance
 */
function pluginEntry(props){
    
    return {
        async onMessage(msg){
            // 收到消息时
        },
        async onScheduled(key){
            // props.registerSchedule 定时任务出发时
        },
        dispose(){
            // 销毁时
        }

    }
}
module.exports = pluginEntry
        
        `
    }
    state.isCreate = true
    nextTick(() => {
        loadEditor()
    })
}
async function save() {
    if (state.choosePluginInfo == null) {
        return
    }
    if (state.choosePluginInfo.id == "") {
        message.error("id不能为空")
        return
    }
    if (state.choosePluginInfo.name == "") {
        message.error("名称不能为空")
        return
    }
    if (state.choosePluginInfo.sourceCode == "") {
        message.error("代码不能为空")
        return
    }

    let res = await request.post("/api/plugin/" + (state.isCreate ? 'createPlugin' : 'updatePlugin'), {

        id: state.choosePluginInfo.id,
        name: state.choosePluginInfo.name,
        sourceCode: editor!.getValue()

    })

    if (res.data.success) {
        message.success("保存成功")
        choosePlugin(state.choosePluginInfo.id)
    } else {
        message.error(res.data.msg)
    }
}

onMounted(() => {
    getAllPlugins()
})



</script>
<template>
    <n-layout style="height: 100%;" has-sider>
        <n-layout-sider content-style="padding: 24px;">
            <n-menu
                @update-value="choosePlugin"
                v-model:value="currentChoosePluginId"
                :options="pluginListOption"
            />

            <n-button
                type="primary"
                @click="createNewPlugin"
                style="width: 100%;margin-top: 20px;"
            >+ 新增插件</n-button>
        </n-layout-sider>
        <n-layout class="content">
            <n-thing style="height: 100%;">
                <template #header>
                    <div v-if="state.isCreate">创建插件</div>
                    <div v-else>修改 {{ state.choosePluginInfo?.name }}</div>
                </template>
                <n-form
                    style="height: 100%;"
                    v-if="state.choosePluginInfo != null"
                    :label-width="70"
                    label-align="left"
                    label-placement="left"
                    :model="state.choosePluginInfo"
                >
                    <n-button style="margin-bottom: 20px;" @click="save" type="primary">保存</n-button>
                    <n-form-item path="id" label="插件Id:">
                        <n-input
                            placeholder="id"
                            :disabled="!state.isCreate"
                            v-model:value="state.choosePluginInfo.id"
                        ></n-input>
                    </n-form-item>
                    <n-form-item path="name" label="插件名:">
                        <n-input placeholder="名称" v-model:value="state.choosePluginInfo.name"></n-input>
                    </n-form-item>
                    <n-form-item path="sourceCode" label="代码:">
                        <div id="code-editor"></div>
                    </n-form-item>
                </n-form>
            </n-thing>
        </n-layout>
    </n-layout>
</template>

<style lang="scss" scoped>
.content {
    margin: 15px;
}
#code-editor {
    height: 100%;
    width: 100%;
    min-height: 900px;
}
</style>