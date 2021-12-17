import { reactive, ref } from "vue"
import { useDialog, NInput, useMessage } from "naive-ui"

import request from "@/public/request"

export function useLogin() {
    const dialog = useDialog()
    const message = useMessage()

    const state = reactive({
        password: "",
        isDialogOpen: false
    })

    

    function openDialog() {

        if (state.isDialogOpen) {
            return
        }


        state.password = ""
        state.isDialogOpen = true
        


        async function login(){
            if (state.password === "") {
                message.error("密码不能为空")
                return false
            }

            let res = await request.post<Result>("/api/auth/login",{
                password:state.password
            })
            if(res.data.success){
                state.isDialogOpen = false
                // 重新进入页面 
                window.location.reload()
                return true
            }
            message.error(res.data.msg ?? "登录失败")
            return false
        }
    
        dialog.create({
            title: "登录",
            showIcon: false,
            closable: false,
            maskClosable: false,
            positiveText: "登录",
            content: () => {
                return <>

                    <NInput
                        v-model={[state.password, 'value']}
                        type="password"
                        show-password-on="mousedown"
                        placeholder="密码"
                        onKeydown={async (e)=>{
                            if(e.key == "Enter"){
                                await login()
                            }
                        }}
                    />

                </>
            },

            onPositiveClick() {
                return login()
            }

        })
    }


    async function checkLogin(){
        try{
            await request.get("/api/auth")
        }catch{
            openDialog()
        }
    }


    return {
        checkLogin
    }
}

