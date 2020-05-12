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