<script lang="tsx" setup>
import { ref, reactive, onMounted, computed } from "vue"
import { NSpace, NCard, useThemeVars, NTabs, NTabPane, NDataTable, NList, NListItem, NThing, NButton, NTag } from "naive-ui"
import request from "@/public/request"
import { stat } from "fs"
import { title } from "process"


const themeVars = useThemeVars()


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

}

const state = reactive<State>({
    list: [],
    chooseRoom: "",
    chooseRoomPlugins: []
})

const currentRoom = computed(() => {
    let current = state.list.find(t => t.wxid === state.chooseRoom)

    return current
})

/**
 * 选择房间
 */
async function chooseRoom(wxid: string) {
    state.chooseRoom = wxid
    state.chooseRoomPlugins = []
    let res = await request.get("/api/plugin/roomPlugins?id=" + wxid)
    state.chooseRoomPlugins = res.data.data;
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
                            <n-list bordered>
                                <n-list-item
                                    v-for="plugin in state.chooseRoomPlugins"
                                    :key="plugin.pluginId"
                                >
                                    <n-thing>
                                        <template #header>
                                            <div>
                                                <span>{{ plugin.pluginName }}</span>

                                                <span style="margin-left: 20px;font-size: 14px;">
                                                    <span
                                                        v-if="plugin.enable"
                                                        style="color:#63e2b7"
                                                    >启用中</span>
                                                    <span v-else style="color:grey">未启用</span>
                                                </span>
                                            </div>
                                            <div>
                                                <span class="sub-title">{{ plugin.pluginId }}</span>
                                            </div>
                                        </template>

                                        <n-button text type="primary">修改配置</n-button>
                                    </n-thing>
                                </n-list-item>
                            </n-list>
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
</style>