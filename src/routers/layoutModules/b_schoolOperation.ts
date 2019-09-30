import Layout from '@/layout/index.vue'
export default [
  {
    path: '/school_options',
    component: Layout,
    redirect: '/school_options/school_radar',
    meta: {
      title: '机构运营',
      icon: 'example'
    },
    children: [
      {
        path: 'school_radar',
        component: () => import(/* webpackChunkName: "school_radar" */ '@/views/schoolOperationSection/school_radar/index.vue'),
        meta: {
          title: '机构雷达',
          keepAlive: true,
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
          type: 'school_rank'
        }
      }
    ]
  }
]
