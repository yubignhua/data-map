const files = require.context('.', true, /\.ts$/)
// console.log(files.keys()) // ["./home.js"] 返回一个数组
let configRouters:any[] = []
files.keys().forEach((key) => {
  if (key === './index.ts') return
  configRouters = configRouters.concat(files(key).default) // 读取出文件中的default模块
})
export default configRouters
