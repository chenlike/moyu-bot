import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from "vue-router"


const router = createRouter({
    history: createWebHashHistory(),
    routes: [

    {
        path:"/",
        redirect:"/layout/wechat"
    },
    {
        path: "/layout",
        name: "layout",
        component: () => import("@/views/Layout.vue"),
        children:[
        ]
    },



    ],
})


export default router;
