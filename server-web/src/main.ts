import { createApp } from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import request from "./public/request"
import router from "@/router"




const app = createApp(App)

app.config.globalProperties.$http = request;
app.use(router)
app.use(ArcoVue)
app.mount('#app')
