import Layout from '@/layout/index.vue'
export default [

  {
    path: '/overallOptration',
    component: Layout,
    redirect: '/overallOptration/operationCockpit',
    meta: {
      title: '整体业务',
      icon: 'tree'
    },
    children: [
      {
        path: 'operationCockpit',
        component: () => import(/* webpackChunkName: "workboard" */ '@/views/overallOptration/operationCockpit/index.vue'),
        meta: {
          title: '业务驾驶舱',
          keepAlive: true,
          type: 'bi'
        }
      },
      {
        path: 'operationCockpit_other',
        component: () => import(/* webpackChunkName: "workboard" */ '@/views/overallOptration/operationCockpit/index.vue')
        // meta: {
        //   title: '其他',
        //   icon: 'dashboard'
        // }
      },
      {
        path: 'iframe_live',
        component: () => import(/* webpackChunkName: "workboard" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: '双师业务',
          type: 'live_business',
          hidden: true,
          link: 'https://datavauth.mofaxiao.com/datav?view_type=live'
        }
      },
      {
        path: 'iframe_ai',
        component: () => import(/* webpackChunkName: "workboard" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: 'AI业务',
          type: 'ai_business',
          hidden: true,
          link: 'https://datavauth.mofaxiao.com/datav?view_type=ai'
        }
      },
      {
        path: 'iframe_content',
        component: () => import(/* webpackChunkName: "workboard" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: '内容业务',
          hidden: true,
          type: 'content_business',
          link: 'https://datavauth.mofaxiao.com/datav?view_type=content'
        }
      },
      {
        path: 'iframe_market',
        component: () => import(/* webpackChunkName: "workboard" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: '市场业务',
          hidden: true,
          link: 'https://101.201.76.246:8010/datav'
        }
      },
      {
        path: 'iframe_overview',
        component: () => import(/* webpackChunkName: "workboard" */ '@/views/businessDataSection/iframePage/index.vue'),
        meta: {
          title: '未来魔法校',
          hidden: true,
          link: 'https://datavauth.mofaxiao.com/datav?view_type=overview'
        }
      }

    ]
  }
]

// {
//   path: 'delivery',
//   redirect: '/delivery/list',
//   component: () => import(/* webpackChunkName: "delivery" */ '@/views/delivery/index.vue'),
//   meta: {
//     title: '交付单'
//   },
//   children: [
//     {
//       path: 'list',
//       name: 'deliveryList',
//       component: () => import(/* webpackChunkName: "deliveryList" */ '@/views/delivery/list.vue'),
//       meta: {
//         title: '全部交付单'
//       }
//     },
//     {
//       path: 'detail',
//       name: 'deliveryDetail',
//       component: () => import(/* webpackChunkName: "deliveryDetail" */ '@/views/delivery/detail.vue'),
//       meta: {
//         title: '交付详情',
//         activeMenu: '/delivery/list',
//         hidden: true
//       }
//     }
//   ]
// }
