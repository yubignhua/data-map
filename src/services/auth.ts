import { Message } from 'element-ui'
import { removeToken } from '../utils/cookies'

function handleError(err: any) {
  var message
  if (err.data.status_code === 401) {
    message = err.data.message || 'token过期,请退出重新登录'
    // 401 移除token 刷新页面走router check 到login 页面
    removeToken()
    location.reload()
  } else if (/^4[0-9]{2}/.test(err.data.status_code)) {
    message = err.data.message || '网络错误，请稍后重试'
  } else {
    message = '服务器开小差儿，请稍后重试！'
  }
  Message.error(message)
}

function handleNetWork() {
  Message.error('网络错误，请检查网络！')
}

export default {
  handleError,
  handleNetWork
}
