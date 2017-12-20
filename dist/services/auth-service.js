
import * as appConfig from '../app-config';
import Promise from '../utils/npm/bluebird.min';
const FORCE_LOGIN = false

var storeE = {
  set: function (key, val, exp) {
    try {
      wx.setStorageSync(key, { val: val, exp: exp, time: new Date().getTime() })
    } catch (e) {
    }
  },
  get: function (key) {
    try {
      var info = wx.getStorageSync(key)
      if (!info) {
        return null
      }
      if (new Date().getTime() - info.time > info.exp) {
        return null
      }
      return info.val
    } catch (e) {
      return null;
    }
  }
}

export function authFromServer(authCode) {
  // console.log('authFromServer...')
  return new Promise((resolve, reject) => {
    wx.request({
      // url: 'http://47.104.19.44/getOpenId',
      url: appConfig.apiBase + 'getOpenId',
      method: 'GET',
      data: {
        "code": authCode,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log("authFromServer result: " + JSON.stringify(res))
        if (+res.statusCode === 200) {
          console.log('authFromServer succeed: ' + JSON.stringify(res))
          // saveAuthInfo(authCode, res.data)

          wx.setStorage({
            key: "openid",
            data: res.data.openId
          })

          return resolve()
        } else {
          console.log("wxappauth failed: " + res.statusCode)
          return reject(+res.statusCode)
        }
      },
      fail: function (error) {
        return reject(error)
      }
    })
  })
}

export function wxappLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (loginResult) {
        console.log('loginResult: ' + JSON.stringify(loginResult))
        wx.setStorage({
          key: "authCode",
          data: loginResult.code
        })
        return authFromServer(loginResult.code)
      },
      fail: function (error) {
        return reject(error)
      }
    })
  });
}

// 判断是否登录 或登录过期
export function isLoggedIn() {
  let userInfo = getUserInfo()
  return wx.checkSessionAsync()
    .then(() => {
      return !FORCE_LOGIN
    }).catch(() => {
      return false
    })
}

export function ensureLoggedIn() { 
  return isLoggedIn().then((loggedIn) => {
    if (loggedIn) {
      console.log('LoggedInAlready.')
      throw new Error('LoggedInAlready')
    } else {
      return wxappLogin()
    }
  }).then(({ authCode, userInfoResult }) => {
    return authFromServer(authCode, userInfoResult)
  }).catch(error => {

  })
}

export function getUserInfoAsync() {
  return isLoggedIn().then((loggedIn) => {
    if (loggedIn) {
      let userProfile = getUserProfile()
      if (userProfile) {
        return {
          userId: getUserId(),
          apiToken: getCugeApiToken(),
          gender: userProfile.gender === 'male' ? 'M' : 'F',
          username: userProfile.nickname,
          avatarSrc: userProfile.headimgurl
        }
      }
    } else {
      return ensureLoggedIn().then(() => {
        return getUserInfoAsync()
      }).catch(() => {
        return {
          userId: 0,
          apiToken: null,
          gender: 'M',
          username: '点击头像登录',
          avatarSrc: ''
        }
      })
    }
  })
}

export function getAuthOpenId() {
  return storeE.get('openid')
}
export function getAuthCode() {
  return storeE.get('authCode')
}