import md5 from './md5.js'
import Notify from '../../../static/vant-weapp/dist/notify/notify'
import Toast from '../../../static/vant-weapp/dist/toast/toast'
import Dialog from '../../../static/vant-weapp/dist/dialog/dialog'
import language from '../../lang/language'

const config = {
  development: {
    domains: 'https://legwork.wlwork.com',
    appid: 'wxd0cdbe0f71da010b'
  },
  production: {
    domains: 'https://legwork.tobewo.com',
    appid: 'wx69bc7cc3a0e81511'
  }
}

const prefix = config[process.env.NODE_ENV].domains
const appid = config[process.env.NODE_ENV].appid

export default class Common {
  static setStorage (name, value) {
    return wx.setStorageSync(name, value)
  }
  static getStorage (name) {
    return wx.getStorageSync(name)
  }
  static removeStorage (name) {
    wx.removeStorageSync(name)
  }
  static back () {
    wx.navigateBack()
  }
  static title (title) {
    wx.setNavigationBarTitle({
      title
    })
  }
  static push (path) {
    wx.navigateTo({
      url: path
    })
  }
  static replace (path) {
    wx.redirectTo({
      url: path
    })
  }
  static launch (path) {
    wx.reLaunch({
      url: path
    })
  }
  static scrollTo (
    scrollTop,
    duration = 300
  ) {
    wx.pageScrollTo({
      scrollTop,
      duration
    })
  }
  static IsEmpty (str) {
    return !str.replace(/ /g, '').replace(/\n/g, '')
  }
  static isMoney (str) {
    return /^\d+(\.\d+)?$/.test(str)
  }
  static fail (message, duration = 2000) {
    Toast({
      type: 'fail',
      message,
      duration
    })
  }

  static loading (message, duration = 0) {
    message = message || Common.lang()['common_loading_tips']
    Toast({
      type: 'loading',
      message,
      duration,
      forbidClick: true,
      loadingType: 'spinner'
    })
  }
  static closeLoading () {
    Toast.clear()
  }

  static confirm (title = '提示', message = '消息') {
    return new Promise((resolve, reject) => {
      Dialog.confirm({
        title,
        message,
        confirmButtonText: Common.lang()['common_confirm_confirm'],
        cancelButtonText: Common.lang()['common_confirm_cancel']
      }).then(resolve).catch(reject)
    })
  }

  static alert (title = '提示', message = '消息') {
    return Dialog.alert({
      title: title,
      message: message,
      confirmButtonText: Common.lang()['common_confirm_confirm']
    })
  }

  static tips (message, duration = 1500) {
    Notify({
      message,
      duration
    })
  }
  static success (message, duration = 1500) {
    return new Promise((resolve) => {
      Toast({
        type: 'success',
        message,
        duration
      })
      setTimeout(resolve, duration)
    })
  }

  static sleep (duration = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  }

  static previewImg (path) {
    wx.previewImage({
      current: path,
      urls: [path]
    })
  }

  static http ({
    url,
    method = 'post',
    data = {},
    lock = true,
    error = true
  }) {
    const params = {
      ...data,
      app_id: appid,
      language: Common.getStorage('language') || 'zh-cn'
    }
    return new Promise((resolve, reject) => {
      if (lock) {
        Common.loading(Common.lang()['common_loading_tips'])
      }
      wx.request({
        url: url.indexOf('http') !== -1 ? url : prefix + url,
        method,
        data: params,
        header: {
          token: Common.getStorage('token')
        },
        success: (res) => {
          console.warn({
            method,
            url,
            params,
            response: res
          })
          if (lock) {
            Common.closeLoading()
          }
          const {
            stat,
            msg,
            error_code: code,
            data
          } = res.data
          if (Number(stat) === 1) {
            if (Number(code) === 0) {
              resolve(data)
            } else if (Number(code) === 10000) {
              // 未登录去帮它登陆再执行原来的请求
              Common.wxLogin(() => {
                Common.http({
                  url,
                  method,
                  data,
                  lock,
                  error
                }).then(response => {
                  resolve(response)
                }).catch(reject)
              })
            } else {
              if (error) {
                Common.fail(msg)
              }
              reject(data)
            }
          } else if (Number(code) === 10000) {
            // 未登录去帮它登陆再执行原来的请求
            Common.wxLogin(() => {
              Common.http({
                url,
                method,
                data,
                lock,
                error
              }).then(response => {
                resolve(response)
              }).catch(reject)
            })
          } else {
            if (error) {
              Common.fail(msg)
            }
            reject(data)
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

  static add0 (num) {
    return num > 9 ? num : '0' + num
  }
  static formatTime (time, fmt = 'YYYY-MM-DD HH:mm', empty = '--') {
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
    function addZero (str) {
      return ('00' + str).substr(str.length)
    }
    // 判断是否时间对象
    function notDate (obj) {
      return obj.toString() === 'Invalid Date'
    }
    return fmt
  }
  static lang () {
    const lang = Common.getStorage('language') || 'zh-cn'
    return language[lang]
  }

  static wxLogin (callback) {
    Common.loading(Common.lang()['common_logining_tips'])
    wx.login({
      success: res => {
        Common.http({
          url: '/auth/mp_login',
          method: 'get',
          data: {
            code: res.code,
            lock: false
          }
        })
          .then(res => {
            const {
              token
            } = res
            Common.setStorage('token', token)
            Common.updateInfo(() => {
              Common.success(Common.lang()['common_logining_success_tips'])
              if (callback) {
                callback()
              }
            })
          })
      },
      fail: err => {
        console.error(err)
      }
    })
  }
  // 每次登陆完更新一下用户信息
  static updateInfo (callback) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: userRes => {
              const {
                userInfo
              } = userRes
              const {
                nickName,
                avatarUrl,
                country,
                province,
                gender,
                city
              } = userInfo
              this
                .http({
                  url: '/auth/mp_submit_userinfo',
                  data: {
                    nick_name: nickName,
                    avatar: avatarUrl,
                    sex: gender,
                    province,
                    city,
                    country
                  },
                  lock: false
                }).then(() => {
                  if (callback) {
                    callback()
                  }
                })
            }
          })
        } else {
          Common.push('/pages/mine/login/main')
        }
      },
      fail: err => {
        console.error('获取设置失败' + JSON.stringify(err))
      }
    })
  }

  static getUserInfo () {
    return Common.http({
      url: '/auth/mp_user_info',
      method: 'get'
    })
  }
  static checkSetting () {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userLocation']) {
            resolve()
          } else {
            Common.confirm(Common.lang()['task_opt_title'], Common.lang()['common_location_tips']).then(() => {
              wx.openSetting({
                success (res) {
                  console.log(res.authSetting)
                  // res.authSetting = {
                  //   "scope.userInfo": true,
                  //   "scope.userLocation": true
                  // }
                }
              })
            })
            // eslint-disable-next-line prefer-promise-reject-errors
            reject()
          }
        }
      })
    })
  }
  static randomTxt () {
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let random = ''
    for (let i = 0; i < 10; i++) {
      random += str[Math.floor(Math.random() * i)]
    }
    return random
  }
  static async getDLSetting () {
    const data = await Common.http({
      url: '/upload/mp_upload_config',
      method: 'get',
      lock: false
    })
    Common.setStorage('setting', data)
    return data
  }

  static async uploadImg (path, silence = false) {
    return new Promise((resolve, reject) => {
      (async () => {
        if (!silence) {
          Common.loading(Common.lang()['common_uploading_tips'])
        }

        let setting = Common.getStorage('setting')
        const expire = setting.expire
        if (!expire || new Date(expire * 1000) - new Date() <= 0) {
          setting = await Common.getDLSetting()
        }
        const {
          host,
          signature,
          accessid,
          dir,
          policy,
          uri
        } = setting

        const name = md5(Common.randomTxt + new Date().getTime()) + path.slice(path.lastIndexOf('.'))
        wx.uploadFile({
          url: host, // 仅为示例，非真实的接口地址
          filePath: path,
          name: 'file',
          formData: {
            key: dir + name,
            policy: policy,
            OSSAccessKeyId: accessid,
            signature,
            success_action_status: '200' // 让服务端返回200，不设置则默认返回204
          },
          success: response => {
            if (!silence) {
              Common.closeLoading()
            }
            if (response.statusCode === 200) {
              const fullPath = uri + name
              resolve(fullPath)
            } else {
              Common.fail(Common.lang()['common_uploading_fail_tips'])
              // eslint-disable-next-line prefer-promise-reject-errors
              reject()
            }
          },
          fail: (err) => {
            console.log(err)
            Common.fail(Common.lang()['common_uploading_fail_tips'])
            // eslint-disable-next-line prefer-promise-reject-errors
            reject()
          }
        })
      })()
    })
  }

  static viewInfo (id) {
    Common.push('/pages/mine/detail/main?id=' + id)
  }

  // 获取订阅消息下发权限
  static async reqSubscribe () {
    const tmplIds = await Common.http({
      url: '/task/mp_template_ids',
      method: 'get'
    })
    return new Promise((resolve, reject) => {
      Common.getAllSub(tmplIds, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  // 递归迫使同意所有的订阅消息
  static getAllSub (tmplIds, callback) {
    let maxThree = tmplIds.slice(0, 3)
    if (maxThree.length) {
      wx.requestSubscribeMessage({
        tmplIds: maxThree,
        success: ({
          errMsg,
          ...other
        }) => {
          if (errMsg === 'requestSubscribeMessage:ok') {
            for (let key in other) {
              if (tmplIds.includes(key) && other[key] !== 'ban' && other[key] === 'accept') {
                tmplIds.splice(tmplIds.findIndex(item => item === key), 1)
              }
            }
            if (tmplIds.length) {
              wx.showModal({
                title: Common.fail(Common.lang()['task_opt_title']),
                content: '需要授权剩余订阅才能收到推送',
                success: ({
                  confirm
                }) => {
                  if (confirm) {
                    Common.getAllSub(tmplIds, callback)
                  } else {
                    // eslint-disable-next-line standard/no-callback-literal
                    callback('取消继续授权')
                  }
                },
                fail: err => {
                  callback(err)
                }
              })
            } else {
              callback()
            }
          }
        },
        fail: err => {
          console.error(err)
          callback(err)
        }
      })
    } else {
      callback()
    }
  }

  // 检查更新
  static checkUpdate () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (e) {
      // 请求完新版本信息的回调
      console.log(e)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: Common.lang()['common_update'],
        content: Common.lang()['common_update_desc'],
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function (err) {
      console.error('onUpdateFailed' + JSON.stringify(err))
    })
  }
}
