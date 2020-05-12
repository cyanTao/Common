export function copyUrl(url) {
  const input = document.createElement('input')
  input.setAttribute('readonly', 'readonly')
  input.setAttribute('value', url)
  document.body.appendChild(input)
  if (navigator.userAgent.indexOf('Android') !== -1) {
    // 安卓的时候focus
    input.focus()
  }
  input.setSelectionRange(0, 9999)
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    this.success('已复制到剪贴板')
  }
  document.body.removeChild(input)
}

/**
 * async方法异常捕获
 * @param {Function} asnycFunc 要捕获的async 方法
 */
export async function errorCaptured(asnycFunc) {
  try {
    let res = await asnycFunc()
    return [null, res]
  } catch (e) {
    return [e, null]
  }
}

/**
 * 将回调函数转为 promise 的辅助函数
 * @param {*} fn 要转的回调函数
 */
export function promisify(fn) {
  return function () {
    const args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve) {
      args.push(function (result) {
        resolve(result)
      })
      fn.apply(null, args)
    })
  }
}

export const sleep = (time = 0) => new Promise(resolve => {
  setTimeout(resolve, time)
})

/**
 * 深层遍历替换json中指定项的值
 * @param {object} item 要遍历的数据
 * @param {any} fill 当匹配回调规则后要替换该项的值
 * @param {function} fn 当这个函数返回真则会将改项替换为 fill的值, 接受一个参数,是当前遍历到的那一项
 */
function mapItems(item, fill, fn) {
  if (item instanceof Object) {
    for (let key in item) {
      item[key] = mapItems(item[key], fill, fn)
    }
    return item
  }
  if (fn && typeof fn === 'function') {
    if (fn(item)) {
      return fill
    }
  }
  return item
}