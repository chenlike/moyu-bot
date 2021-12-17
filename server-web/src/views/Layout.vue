<script setup lang="ts">
import { ref, computed } from "vue"
import { NLayout, NLayoutSider, NMenu } from "naive-ui"
import { useRoute, useRouter } from "vue-router";
import { useLogin } from "@/composables/auth"
import { onMounted } from "vue"





const route = useRoute()
const router = useRouter()
const { checkLogin } = useLogin()
const activeMenu = computed<string>({
    get() {
        return route.path
    },
    set(v) {
        router.push(v)
    }
})

const menuOption = [
    {
        label: '群聊',
        key: '/room',
    },

    {
        label: '插件',
        key: '/plugin',
    },
]


onMounted(() => {
  checkLogin()
})





</script>

<template>
    <n-layout class="app-layout" has-sider>
        <n-layout-sider>
            <n-menu
                v-model:value="activeMenu"
                :root-indent="36"
                :indent="12"
                :options="menuOption"
            />
        </n-layout-sider>
        <n-layout>
            <div class="view-content">
                <router-view></router-view>
            </div>
   
        </n-layout>
    </n-layout>
</template>

<style lang="scss" scoped>
.app-layout {
    height: 100%;
}

.view-content{
    height: 199%;
    overflow: auto;
}
</style>
