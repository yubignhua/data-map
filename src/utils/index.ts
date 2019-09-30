
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
