import Layout from '@/layout/index.vue'
export default [
  {
    path: '/businessDataSection',
    component: Layout,
    redirect: '/mainboard/mainboard',
    meta: {
      title: '业务报表',
      icon: 'form'
    },
    children: [
      {
        path: 'iframePage',
        component: () => import(/* webpackChunkName: "school_radar" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: '双师业务数据',
          link: 'https://redash.mofaxiao.com/dashboards?type=live_business',
          type: 'live_business'
        }
      },
      {
        path: 'iframePage1',
        component: () => import(/* webpackChunkName: "school_radar" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: 'AI业务数据',
          link: 'https://redash.mofaxiao.com/dashboards?type=ai_business',
          type: 'ai_business'
        }
      },
      {
        path: 'iframePage6',
        component: () => import(/* webpackChunkName: "schoolRadarDetails" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: '内容业务数据',
          type: 'content_business',
          link: 'https://redash.mofaxiao.com/dashboards?type=content_business'
        }
      },
      {
        path: 'iframePage4',
        component: () => import(/* webpackChunkName: "school_radar" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: '师训业务数据',
          type: 'train_business',
          link: 'https://redash.mofaxiao.com/dashboards?type=train_business'
        }
      }
    ]
  }
]
