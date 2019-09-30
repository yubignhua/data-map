import Layout from '@/layout/index.vue'
export default [
  {
    path: '/teachingData',
    component: Layout,
    redirect: '/mainboard/mainboard',
    meta: {
      title: '教学报表',
      icon: '导航'
    },
    children: [
      {
        path: 'teaching_prod_data',
        component: () => import(/* webpackChunkName: "school_radar" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: '系统数据',
          type: 'teaching_product',
          link: 'https://redash.mofaxiao.com/dashboards?type=teaching_product'

        }
      },
      {
        path: 'teaching_option_data',
        component: () => import(/* webpackChunkName: "school_radar" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: '业务数据',
          type: 'teaching_business',
          link: 'https://redash.mofaxiao.com/dashboards?type=teaching_business'

        }
      }

    ]
  }
]
