import Vue from 'vue'
import Router from 'vue-router'
import commonList from './common'
import layoutModulesList from '@/routers/layoutModules/index'
import commonModulesList from './commonModules/index'
import Layout from '@/layout/index.vue'
Vue.use(Router)

/*
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             侧边栏的icon
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    activeMenu: path             if set path, the sidebar will highlight the path you set
  }
*/
const pageRouterList: any[] = [...layoutModulesList, ...commonModulesList, ...commonList]
// console.log('pageRouterList: ', pageRouterList)

let router: any = new Router({
  mode: 'history',
  base: 'ms-data',
  routes: pageRouterList,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  }
})
export default router
