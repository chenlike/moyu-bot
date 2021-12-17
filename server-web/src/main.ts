import { createApp } from 'vue'
import App from './App.vue'
import request from "./public/request"
import router from "@/router"


const app = createApp(App)

app.config.globalProperties.$http = request;
app.use(router)
app.mount('#app')
