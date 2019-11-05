/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-30 11:37:29
 * @LastEditTime: 2019-10-02 21:59:46
 * @LastEditors: Please set LastEditors
 */
import Layout from '@/layout/index.vue'
export default [

  {
    path: '/data_view',
    component: Layout,
    redirect: '/data_view/dts_rank',
    meta: {
      title: '数据统计',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'dts_rank',
        component: () => import(/* webpackChunkName: "dtsRank" */ '@/views/schoolOperationSection/dtsRank/index.vue'),
        meta: {
          title: '数据统计',
          keepAlive: true,
          type: 'school_rank',
          icon: 'example'
        }
      }
    ]
  }
]
