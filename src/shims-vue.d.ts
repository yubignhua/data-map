/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-22 15:26:13
 * @LastEditTime: 2019-09-30 16:05:53
 * @LastEditors: Please set LastEditors
 */
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

//  interface Vue {
//     // readonly $services: any;
//     // readonly $ELEMENT: any;
//     // readonly $el:Element;
//     readonly elementMessage:any
//   }

declare interface IResponseData<T = any> {
  status_code: number;
  ok:number;
  data: T;
  message?: string;
  meta?: object
}

interface IAmap {
  new (): any;
  [key: string]: any
}

declare var AMap: IAmap
