import Layout from '@/layout/index.vue'
export default [
  {
    path: '/financeData',
    component: Layout,
    redirect: '/mainboard/mainboard',
    meta: {
      title: '财务报表',
      icon: 'hamburger'
    },
    children: [
      {
        path: 'financeData_detal',
        component: () => import(/* webpackChunkName: "school_radar" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: '财务数据',
          type: 'finance_data',
          link: 'https://redash.mofaxiao.com/dashboards?type=finance_data'

        }
      },
      {
        path: 'operationCockpit_other',
        component: () => import(/* webpackChunkName: "school_radar" */ '@/views/businessDataSection/iframePage/index.vue')
      }
    ]
  }
]
