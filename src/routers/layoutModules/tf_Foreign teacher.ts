import Layout from '@/layout/index.vue'
export default [
  {
    path: '/foreign_teacher',
    component: Layout,
    redirect: '/mainboard/mainboard',
    meta: {
      title: '乐外教报表',
      icon: '班课详情'
    },
    children: [
      {
        path: 'foreign_teacher-data',
        component: () => import(/* webpackChunkName: "school_radar" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: '乐外教数据',
          type: 'lwj_business',
          link: 'https://redash.mofaxiao.com/dashboards?type=foreign_teacher'

        }
      },
      {
        path: 'operationCockpit_other',
        component: () => import(/* webpackChunkName: "school_radar" */ '@/views/businessDataSection/iframePage/index.vue')
      }
    ]
  }
]
