const dateFormat = (d:any, fmt:any) => {
  if (!d || !fmt) {
    return ''
    // throw new Error('lack date or format')
  }
  // 转换毫秒和字符串为时间对象
  if (typeof d === 'string' || typeof d === 'number') {
    d = new Date(d)
  }
  // d是NaN的时候返回空
  if (isNaN(d)) return ''
  const dateObj:any = {
    'M+': d.getMonth() + 1, // 月份
    'D+': d.getDate(), // 日
    'h+': d.getHours(), // 小时
    'm+': d.getMinutes(), // 分
    's+': d.getSeconds(), // 秒
    'Q+': Math.floor((d.getMonth() + 3) / 3), // 季度
    'S': d.getMilliseconds() // 毫秒
  }

  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (var k in dateObj) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (dateObj[k]) : (('00' + dateObj[k]).substr(('' + dateObj[k]).length)))
    }
  }
  return fmt
}

const dayFormat = (timeSec: number) => {
  if (!timeSec) {
    return ''
  }
  const day = timeSec / (60 * 60 * 24)

  if (day >= 1) {
    const hours = (timeSec % (60 * 60 * 24)) / 3600
    return hours > 1 ? `${Math.floor(day)}天${Math.floor(hours)}小时` : `${Math.floor(day)}天`
  }
  const hours = Math.floor(timeSec / (60 * 60))
  return hours > 0 ? `${hours}小时` : '1小时内'
}

const recentlyTime = (timeSec: number) => {
  if (!timeSec) {
    return ''
  }

  const hours = timeSec / (60 * 60)

  if (hours < 1) {
    return '1小时内'
  } else if (hours < 24) {
    return `${Math.floor(hours)}小时`
  } else {
    const day = timeSec / (60 * 60 * 24)
    return `${Math.floor(day)}天`
  }
}

export {
  dateFormat,
  dayFormat,
  recentlyTime
}
