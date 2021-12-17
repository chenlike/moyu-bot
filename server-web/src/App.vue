<script lang="ts" setup>
import { darkTheme, NConfigProvider, NDialogProvider, NMessageProvider } from "naive-ui"

</script>
<template>
  <n-config-provider class="naive-provider" :theme="darkTheme">
    <n-message-provider>
      <n-dialog-provider>
        <router-view></router-view>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
<style lang="scss">
html,
body,
#app,
.naive-provider {
  height: 100%;
  margin: 0px;
  padding: 0px;
}
</style>
