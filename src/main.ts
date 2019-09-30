import Vue from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import router from '@/routers/index'
import '@/icons/components'
import '@/permission'
import Component from 'vue-class-component'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

Vue.use(ElementUI, {
  size: 'medium'
})
Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

type typeFlag = 'success' | 'warning' | 'error' | 'default';
Vue.prototype.$elementMessage = (msg:string, type:typeFlag) => {
  Vue.prototype.$message({
    message: msg,
    type: type,
    showClose: true
  })
}

Vue.prototype.$goBack = () => {
  window.history.length > 1 ? router.go(-1) : router.push('/')
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
