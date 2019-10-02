/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-30 11:39:02
 * @LastEditTime: 2019-10-02 21:55:13
 * @LastEditors: Please set LastEditors
 */
import Layout from '@/layout/index.vue'
export default [
  {
    path: '/school_options',
    component: Layout,
    redirect: '/school_options/school_radar',
    meta: {
      title: '设备设置',
      icon: 'example'
    },
    children: [
      {
        path: 'school_radar',
        component: () => import(/* webpackChunkName: "school_radar" */ '@/views/schoolOperationSection/school_radar/index.vue'),
        meta: {
          title: '设备设置',
          keepAlive: true,
          icon: 'example',
          type: 'radar'
        }
      },
      {
        path: 'radar_detail',
        component: () => import(/* webpackChunkName: "schoolRadarDetail" */ '@/views/schoolOperationSection/schoolRadarDetail/index.vue'),
        meta: {
          title: '机构详情',
          hidden: true
        }
      },

      {
        path: 'dts_rank',
        component: () => import(/* webpackChunkName: "dtsRank" */ '@/views/schoolOperationSection/dtsRank/index.vue'),
        meta: {
          title: '机构排名',
          keepAlive: true,
          type: 'school_rank',
          hidden: true
        }
      }
    ]
  }
]
