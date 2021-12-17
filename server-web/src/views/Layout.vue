<script setup lang="ts">
import { ref } from "vue"
import { IconSun, IconSunFill } from '@arco-design/web-vue/es/icon';
import { useRouter } from "vue-router"

const router = useRouter()
const darkMode = ref(true)


function modeChange() {
    if (darkMode.value) {
        // 设置为暗黑主题
        document.body.setAttribute('arco-theme', 'dark')
    } else {
        // 恢复亮色主题
        document.body.removeAttribute('arco-theme');
    }
}

function toPage(key: string) {

    router.push(`/layout/${key}`)

}

modeChange()


</script>

<template>
    <div class="app-layout">
        <a-layout style="height: 100%;">
            <a-layout-header style="border-bottom: 1px solid var(--color-border-2);">
                <div class="header">
                    <div class="title">摸鱼小助手</div>
                    <div @click="darkMode = !darkMode; modeChange()" class="darkMode">
                        <IconSun v-if="darkMode" />
                        <IconSunFill v-else></IconSunFill>
                    </div>
                </div>
            </a-layout-header>
            <a-layout>
                <a-layout-sider>
                    <a-menu
                        :style="{ width: '200px', borderRadius: '4px' }"
                        :default-selected-keys="['wechat']"
                        router
                        @menu-item-click="toPage"
                    >
                        <a-menu-item key="wechat">微信</a-menu-item>
                        <a-menu-item key="plugin">插件</a-menu-item>
                        <a-menu-item key="room">群聊</a-menu-item>
                    </a-menu>
                </a-layout-sider>
                <a-layout-content>
                    <div class="content">
                        <router-view></router-view>
                    </div>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </div>
</template>

<style lang="scss" scoped>
.app-layout {
    width: 100%;
    height: 100%;
    background-color: var(--color-bg-1);
    color: var(--color-text-2);
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    margin: 0 20px;
}
.darkMode {
    cursor: pointer;
    font-size: 20px;
}
.content {
    padding: 15px;
}
</style>
