/**
 * @message: 获取 url 中的参数
 * @parameter:
 * @Return:
 * @Date: 2019-07-25 11:20:02
 */
export const getQueryStr = (key:string):string => {
  const queryString = window.location.search.match(
    new RegExp('[?&]' + key + '=([^&]*)(&?)', 'i')
  )
  const val = (queryString && queryString.length > 1 && queryString[1]) || ''
  return val
}

/**
 * @message: 将对象装换成 url参数
 * @parameter:
 * @Return:
 */
export const stringify = (params:any) => {
  if (JSON.stringify(params) === '{}' || !params) {
    return ''
  }
  let url = '?'
  for (const i in params) {
    url += `${i}=${params[i]}&`
  }
  return url.slice(0, url.length - 1)
}

/**
 * @message: 将 url 参数装换成对象
 * @parameter:
 * @Date: 2019-10-09 16:22:54
 */
export function param2Obj(url:string) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}

export function debounce(func: () => void, wait: number, immediate?: boolean) {
  let timeout: any = null
  let args: any = null
  let context: any = null
  let timestamp: number = 0
  let result: any = null

  const later = () => {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(this: any, ...args: any) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * @message: 在 dom 元素上切换样式
 * @parameter:
 * @Return:
 */
export function toggleClass(element:HTMLElement, className:string) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @message: 获取时间戳
 * @parameter:
 * @Return:
 */
export function getTime(type: string) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source:any) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments shallowClone')
  }
  const targetObj:any = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = Math.round((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

export function callback(data, success, fail?) {
  if (data.code === SUCCESS_STATUS) {
    success()
  } else {
    fail()
  }
}

/**
 * @message: 格式化当前时间
 * @parameter:  'yyyy-MM-dd HH:mm:ss'
 * @Return: 
 */
export function  formatCurDate(fmt:any) {
  // Date.prototype.Format = function(fmt) {
    const date = new Date()
    var o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'H+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
    return fmt
  // }
}
