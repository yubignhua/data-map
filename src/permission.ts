import router from './routers/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Route } from 'vue-router'
import { getToken } from '@/utils/cookies'
import { AppModule } from '@/store/modules/app'
// AppModule.getAuhMap()

NProgress.configure({ showSpinner: false })
const whiteList = ['/login']

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()

  // if (getToken()) {
  //   if (to.path === '/login') {
  //     // If is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     AppModule.getAuhMap().then(res => {
  //       if (to.meta.type) {
  //         if ((AppModule as any).authMap[to.meta.type]) {
  //           next()
  //         } else {
  //           next({ path: '/mainboard/401' })
  //         }
  //       } else {
  //         next()
  //       }
  //     })
  //   }
  // } else {
  //   // Has no token
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // In the free login whitelist, go directly
  //     next()
  //   } else {
  //     // Other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.fullPath}`)
  //     NProgress.done()
  //   }
  // }
  next()
})

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()

  // set page title
  document.title = to.meta.title || '未来魔法校商业智能平台'
})
