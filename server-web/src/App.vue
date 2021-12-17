<script lang="ts" setup>

import { onMounted, ref } from '@vue/runtime-core';
import { Message } from "@arco-design/web-vue"
import request from "@/public/request"
import { useRouter } from "vue-router"


</script>
<template>
  <router-view>
  </router-view>
</template>
<style lang="scss">
html,
body,
#app {
  height: 100%;
  margin: 0px;
  padding: 0px;
}
</style>
