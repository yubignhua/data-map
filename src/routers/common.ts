
export default [
  // 登录
  {
    path: '/',
    redirect: '/mainboard/mainboard',
    meta: {
      hidden: true
    }
  },

  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: {
      hidden: true,
      title: '登录'
    }
  },
  // 401无权限页面
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "login" */ '@/views/commonPage/401.vue'),
    meta: {
      hidden: true,
      title: ' 401'
    }
  },
  // 404页面
  {
    path: '*',
    component: () => import(/* webpackChunkName: "login" */ '@/views/commonPage/404.vue'),
    meta: {
      hidden: true,
      title: ' 404'
    }
  }
]
