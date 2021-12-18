<script lang="tsx" setup>
import { ref, reactive, onMounted, computed, nextTick } from "vue"
import {
    NSpace, NCard, useThemeVars, NTabs, NTabPane, NDataTable, NLayout, NLayoutSider,
    NMenu, NThing, NButton, NForm, NFormItem, NSwitch, NEmpty,
    useMessage
} from "naive-ui"
import request from "@/public/request"
import * as monaco from "monaco-editor"
const themeVars = useThemeVars()

const message = useMessage()

interface Member {
    // 微信号
    wxid: string,
    // 昵称
    nickname: string,
    // 备注名
    remark: string,
    //头像
    avatar: string,
}

interface IChatroom {
    // 群聊 wxid
    wxid: string;
    // 名称
    name: string;
    // 头像
    avatar?: string;
    // 群主id
    manager_wxid?: string;
    // 成员
    member_list: Member[];
}

interface RoomPluginInfo {
    pluginId: string;
    pluginName: string;
    enable: boolean,
    config: string
}






const roomMemberColumns = [
    {
        title: "名称",
        key: "nickname",
        render(row: Member) {
            return <>
                <NSpace align='center'>
                    <img style="width:50px;height:50px" src={row.avatar} />
                    <div>{row.nickname}</div>
                </NSpace>
            </>

        }
    },
    {
        title: "wxid",
        key: "wxid"
    }
]



interface State {
    // 群聊列表
    list: IChatroom[],
    // 当前选中的群聊
    chooseRoom: string,
    /**
     * 选中房间的插件信息
     */
    chooseRoomPlugins: RoomPluginInfo[]
    /**
     * 当前选中的插件
     */
    choosePlugin: RoomPluginInfo | null

}

const state = reactive<State>({
    list: [],
    chooseRoom: "",
    chooseRoomPlugins: [],
    choosePlugin: null
})

// 当前群聊信息
const currentRoom = computed(() => {
    let current = state.list.find(t => t.wxid === state.chooseRoom)
    return current
})
// 当前插件信息
const currentPlugin = computed(() => {
    if (state.choosePlugin == null) {
        return ""
    }
    return state.choosePlugin.pluginId
})
// 当前插件列表
const currentPluginMenuOption = computed(() => {
    return state.chooseRoomPlugins.map(t => {
        return {
            label: `${t.pluginName}`,
            key: t.pluginId,
        }
    })
})



/**
 * 选择房间
 */
async function chooseRoom(wxid: string, disableAutoChoose?: boolean) {
    state.chooseRoom = wxid
    state.chooseRoomPlugins = []
    let res = await request.get("/api/plugin/roomPlugins?id=" + wxid)
    state.chooseRoomPlugins = res.data.data;

    if (disableAutoChoose === true) {

    } else {
        if (state.chooseRoomPlugins.length != 0) {
            choosePlugin(state.chooseRoomPlugins[0].pluginId)
        }
    }

}



let editor: monaco.editor.IStandaloneCodeEditor | null = null

/**
 * 选择插件
 */
function choosePlugin(pluginId: string) {
    let plugin = state.chooseRoomPlugins.find(t => t.pluginId == pluginId)
    if (plugin == undefined) {
        state.choosePlugin = null
        return
    }
    state.choosePlugin = JSON.parse(JSON.stringify(plugin))


    nextTick(() => {
        if (editor == null) {
            editor = monaco.editor.create(document.getElementById('config-editor')!, {
                value: "",
                language: "yaml",
                theme: "vs-dark",
                minimap: {
                    enabled: false
                },
            })
        }
        editor.setValue(plugin?.config ?? "")
    })

}
/**
 * 获得所有群聊信息
 */
async function getRoomInfo() {
    let res = await request.get("/api/room")

    state.list = res.data.data;
    if (state.list.length != 0) {
        chooseRoom(state.list[0].wxid)
    }
}


async function saveConfig() {
    if (state.choosePlugin === null) {
        message.warning("当前未选择插件")
        return
    }

    let currentRoomId = state.chooseRoom;
    let currentPluginId = state.choosePlugin.pluginId


    let res = await request.post("/api/plugin/setPermission", {
        room_wxid: currentRoomId,
        plugin_id: currentPluginId,
        enable: state.choosePlugin.enable,
        config: editor?.getValue() ?? ""
    })
    if (res.data.success) {
        // 重新加载
        await chooseRoom(currentRoomId,true)
        await choosePlugin(currentPluginId)
        message.success("设置成功")
    } else {
        message.error(res.data.msg)
    }
}











onMounted(() => {
    getRoomInfo()
})




</script>
<template>
    <div class="container">
        <div class="rooms">
            <n-space vertical>
                <div
                    @click="chooseRoom(room.wxid)"
                    v-for="room in state.list"
                    :key="room.wxid"
                    :class="state.chooseRoom == room.wxid ? 'selected' : ''"
                    class="room"
                >
                    <img class="room-img" :src="room.avatar" />
                    <div class="room-name">{{ room.name }}</div>
                </div>
            </n-space>
        </div>
        <div class="detail">
            <n-card style="width: 100%;" hoverable>
                <template #header>
                    <span>{{ currentRoom ? currentRoom.name : '未选择群聊' }}</span>
                    <span
                        style="margin-left: 10px;"
                        class="sub-title"
                    >{{ currentRoom ? currentRoom.wxid : '' }}</span>
                </template>

                <template v-if="currentRoom != undefined">
                    <n-tabs type="line">
                        <n-tab-pane name="插件配置" tab="插件配置">
                            <n-layout has-sider>
                                <n-layout-sider :width="200">
                                    <n-menu
                                    @update-value="choosePlugin"
                                        v-model:value="currentPlugin"
                                        :options="currentPluginMenuOption"
                                    />
                                </n-layout-sider>
                                <n-layout>
                                    <template v-if="state.choosePlugin != null">
                                        <div class="plugin-content">
                                            <n-thing>
                                                <template #header>
                                                    <span>{{ state.choosePlugin.pluginName }}</span>
                                                    <span
                                                        style="margin-left: 10px;"
                                                        class="sub-title"
                                                    >
                                                        {{ state.choosePlugin.pluginId }}
                                                        <span
                                                            style="margin-left: 15px;"
                                                            v-if="state.choosePlugin.enable"
                                                        ></span>
                                                    </span>
                                                </template>

                                                <n-form
                                                    :label-width="70"
                                                    label-align="left"
                                                    label-placement="left"
                                                    :model="state.choosePlugin"
                                                    ref="formRef"
                                                >
                                                    <n-form-item label="启用状态:">
                                                        <n-switch
                                                            v-model:value="state.choosePlugin.enable"
                                                        />
                                                    </n-form-item>
                                                    <n-form-item label="配置:">
                                                        <div id="config-editor"></div>
                                                    </n-form-item>
                                                    <n-form-item label=" ">
                                                        <n-button @click="saveConfig" type="primary">保存</n-button>
                                                    </n-form-item>
                                                </n-form>
                                            </n-thing>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <n-empty description="没有任何信息~"></n-empty>
                                    </template>
                                </n-layout>
                            </n-layout>
                        </n-tab-pane>
                        <n-tab-pane name="成员" tab="成员">
                            <n-data-table
                                :columns="roomMemberColumns"
                                :data="currentRoom.member_list"
                            />
                        </n-tab-pane>
                    </n-tabs>
                </template>
            </n-card>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.container {
    height: 100%;
    display: flex;
}
.rooms {
    width: 250px;
    border-right: 1px solid rgba(255, 255, 255, 0.09);
    height: 100%;
    padding-right: 15px;
    margin-top: 20px;
    margin-left: 15px;

    .room {
        display: flex;
        align-items: center;
        padding: 10px 5px 10px 10px;
        cursor: pointer;
        &.selected {
            color: #63e2b7;
            background-color: #283534;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        &:hover {
            border-radius: 5px;

            color: #63e2b7;
        }
        .room-img {
            width: 40px;
            height: 40px;
        }
        .room-name {
            margin-left: 15px;
        }
    }
}
.detail {
    margin: 20px 15px 0px 15px;
    flex: auto;
}
.sub-title {
    color: rgba(255, 255, 255, 0.52);
    font-size: 14px;
}
.plugin-content {
    padding: 15px;
}
#config-editor {
    width: 100%;
    height: 100%;
    min-height: 200px;
}
</style>