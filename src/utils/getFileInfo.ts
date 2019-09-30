/**
 * 获取文件的后缀名
 * @param name : string
 * @returns {string}
 */

export const getFileSuffix = (name: string) => {
  let result = ''
  let arr = name.split('.')
  if (arr.length > 1) {
    result = arr[arr.length - 1]
  }
  return result
}

/**
 * 获取文件的后缀名
 * @param name
 * @returns {string}
 */
export const getFilePrefix = (name:string) => {
  let result = ''
  let arr = name.split('.')
  if (arr.length > 1) {
    result = name.substr(0, name.length - arr[arr.length - 1].length - 1)
  } else {
    result = name.split('.')[0]
  }
  return result
}
