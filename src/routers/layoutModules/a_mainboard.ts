import Layout from '@/layout/index.vue'
export default [

  {
    path: '/mainboard',
    component: Layout,
    redirect: '/mainboard/mainboard',
    meta: {
      title: '首页',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'mainboard',
        component: () => import(/* webpackChunkName: "workboard" */ '@/views/mainboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'dashboard',
          keepAlive: true
        }
      },
      {
        path: '401',
        component: () => import(/* webpackChunkName: "schoolRadarDetails" */ '@/views/commonPage/401.vue'),
        meta: {
          title: '401',
          hidden: true
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
