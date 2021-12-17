import axios, { Axios } from "axios"

/**
 * 挂载在vue上的实例
 */
 declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
      /**
       * http请求(axios)
       */
      $http: Axios; 
   
    }
  }
  