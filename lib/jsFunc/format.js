/**
 * 格式化时间
 * @param {number|string|Date} time 要格式化的时间
 * @param {string} fmt 格式
 * @param {string} empty 格式化错误为空时显示什么
 */
export function formatTime(time, fmt = 'YYYY-MM-DD HH:mm', empty = '') {
  let dateObj
  // 如果传入的是时间对象
  if (typeof time === 'object') {
    if (notDate(time)) {
      return empty
    } else {
      dateObj = time
    }
  } else {
    // 当传入这个是非数字
    if (isNaN(time)) {
      if (notDate(new Date(time))) {
        return empty
      } else {
        dateObj = new Date(time)
      }
      // 当传入的是数字
    } else if (!Number(time)) {
      return empty
    } else {
      dateObj = new Date(Number(time) * 1000)
    }
  }
  // 格式化时间开始
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  let o = {
    'M+': dateObj.getMonth() + 1 + '',
    'D+': dateObj.getDate() + '',
    'H+': dateObj.getHours() + '',
    'm+': dateObj.getMinutes() + '',
    's+': dateObj.getSeconds() + ''
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : addZero(o[k])
      )
    }
  }
  // 添加0
  function addZero(str) {
    return ('00' + str).substr(str.length)
  }
  // 判断是否时间对象
  function notDate(obj) {
    return obj.toString() === 'Invalid Date'
  }
  return fmt
}

/**
 *  去掉空格和换行
 * @param {string} str 字符串或者数字
 */
export function trim(str) {
  if (typeof str === 'string') {
    return str.replace(/ /g, '').replace(/\n/g, '')
  }
  return str
}

/**
 * 格式化文件后缀,常用语根据不同后缀显示不同图片
 * @param {string} ext 文件后缀
 */
export function getTypeByExt(ext) {
  if (ext === undefined) return 'video'
  ext = ext.toLowerCase()
  if (['doc', 'docx'].indexOf(ext) > -1) {
    return 'doc'
  }
  if (['xls', 'xlsx'].indexOf(ext) > -1) {
    return 'xls'
  }
  if (['ppt', 'pptx'].indexOf(ext) > -1) {
    return 'ppt'
  }
  if (['pdf'].indexOf(ext) > -1) {
    return 'pdf'
  }
  if (['jpg', 'jpeg', 'png', 'gif'].indexOf(ext) > -1) {
    return 'img'
  }
  if (['zip', 'rar'].indexOf(ext) > -1) {
    return 'zip'
  }
  if (['mp3', 'wma', 'wav', 'amr'].indexOf(ext) > -1) {
    return 'mp3'
  }
  if (['mp4'].indexOf(ext) > -1) {
    return 'mp4'
  }
  return 'others'
}