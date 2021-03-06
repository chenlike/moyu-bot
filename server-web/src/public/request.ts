import axios from "axios"




const instance = axios.create()


instance.interceptors.response.use(
    response => {
        if (response.data.code) {
            switch (response.data.code) {
                case 401:
                    
                    break
            }
        }
        return response
    },
    error => {
        return Promise.reject(error.response) 
    })

export default instance