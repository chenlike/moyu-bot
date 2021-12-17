import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from "vue-router"


const router = createRouter({
    history: createWebHashHistory(),
    routes: [

    {
        path:"/",
        redirect:"/room"
    },
    {
        path: "/layout",
        name: "layout",
        component: () => import("@/views/Layout.vue"),
        children:[
            {
                path:"/room",
                name:"room",
                component:()=>import("@/views/Room.vue")
            },{
                path:"/plugin",
                name:"plugin",
                component:()=>import("@/views/Plugin.vue")
            }
        ]
    },



    ],
})


export default router;
