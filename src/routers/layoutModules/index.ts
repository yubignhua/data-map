
import Layout from '@/layout/index.vue'

const files = require.context('.', true, /\.ts$/)
let configRouters:any[] = []
files.keys().forEach((key) => {
  if (key === './index.ts') return
  configRouters = configRouters.concat(files(key).default)
})

// console.log('configRouters: ', configRouters)
export default configRouters
// export default [
//   {
//     path: '/',
//     component: Layout,
//     redirect: '/mainboard',
//     children: [
//       ...configRouters
//     ]
//   }
// ]
