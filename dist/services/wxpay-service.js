import * as AuthService from './auth-service';
import * as appConfig from '../app-config';
import Promise from '../utils/npm/bluebird.min';

import {
  wxJsonBackendPostRequestP as jsonPostRequest
}
from './wx-request-promise';

import {
  wxUrlencodedBackenPostRequestP as urlencodePostRequest
}
from 'wx-request-promise';

// 待付款
export function getBrandWCPayRequestParams(dic) {
  return urlencodePostRequest('pay/prepay', dic);
}
// 付尾款
export function getBrandWCFinalyPayRequestParams(orderid, openid) {
  return urlencodePostRequest('pay/payed', {
    orderId: orderid,
    openId: openid
  });
}

export function makeFinalPay(orderid, openid) {
  return getBrandWCFinalyPayRequestParams(orderid, openid).then((orderParams) => {
    if (orderParams.result) {
      // return requestPayment((orderParams)).then(res => {
      //   console.log('res .. ' + JSON.stringify(res));
      // })
      return new Promise((resolve, reject) => {
        wx.requestPayment({
          appId: appConfig.appId,
          timeStamp: '' + orderParams.timeStamp,
          nonceStr: orderParams.nonceStr,
          package: 'prepay_id=' + orderParams.prepayId,
          signType: 'MD5',
          paySign: orderParams.paySign,
          success: (res) => {

            wx.showToast({
              title: '支付成功！',
              icon: 'success',
              duration: 2000
            })
            console.log('@@Pay Success: ' + JSON.stringify(res))
            resolve(true)
          },
          fail: (error) => {

            if (error.errMsg == 'requestPayment:cancel') {
              console.log('取消支付');
            } else {
              wx.showToast({
                title: '支付失败,请重试!',
                icon: 'success',
                duration: 5000
              })
            }
            console.log('@@Pay fail: ' + JSON.stringify(error))
            reject(false)
          }
        })
      })
    } else {
      wx.showToast({
        title: '支付失败,请重试!',
        icon: 'success',
        duration: 5000
      })
    }
  })
}

export function requestPayment(orderParams) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      appId: appConfig.appId,
      timeStamp: '' + orderParams.timeStamp,
      nonceStr: orderParams.nonceStr,
      package: 'prepay_id=' + orderParams.prepayId,
      signType: 'MD5',
      paySign: orderParams.paySign,
      success: (res) => {

        wx.showToast({
          title: '支付成功！',
          icon: 'success',
          duration: 2000
        })
        console.log('@@Pay Success: ' + JSON.stringify(res))
        resolve(true)
      },
      fail: (error) => {
      
        if (error.errMsg == 'requestPayment:cancel') {
          console.log('取消支付');
        } else {
          wx.showToast({
            title: '支付失败,请重试!',
            icon: 'success',
            duration: 5000
          })
        }
        console.log('@@Pay fail: ' + JSON.stringify(error))
        reject(false)
      }
    })
  })
  // return wx.requestPaymentAsync({
  //   appId: appConfig.appId,
  //   timeStamp: '' + orderParams.timeStamp,
  //   nonceStr: orderParams.nonceStr,
  //   package: 'prepay_id=' + orderParams.prepayId,
  //   signType: 'MD5',
  //   paySign: orderParams.paySign,
  // }).then(res => {
  //   wx.showToast({
  //     title: '支付成功！',
  //     icon: 'success',
  //     duration: 2000
  //   })
  //   console.log('@@Pay Success: ' + JSON.stringify(res))
  //   return res
  // }).catch((error) => {
  //   console.log('@@Pay fail: ' + JSON.stringify(error))
    
  //   if (error.errMsg == 'requestPayment:cancel') {
  //     console.log('取消支付');
  //   } else {
  //     wx.showToast({
  //       title: '支付失败,请重试!',
  //       icon: 'success',
  //       duration: 5000
  //     })
  //   }
  //   return error
  // })
}

export function makePayment(payDic) {

  return getBrandWCPayRequestParams(payDic).then((orderParams) => {
    
    if (orderParams.result) {

      wx.setStorageSync('prepayOrderParams', {
        appId: appConfig.appId,
        timeStamp: '' + orderParams.timeStamp,
        nonceStr: orderParams.nonceStr,
        package: 'prepay_id=' + orderParams.prepayId,
        signType: 'MD5',
        paySign: orderParams.paySign,
      })

      return new Promise((resolve, reject) => {
        wx.requestPayment({
          appId: appConfig.appId,
          timeStamp: '' + orderParams.timeStamp,
          nonceStr: orderParams.nonceStr,
          package: 'prepay_id=' + orderParams.prepayId,
          signType: 'MD5',
          paySign: orderParams.paySign,
          success: (res) => {

            wx.showToast({
              title: '支付成功！',
              icon: 'success',
              duration: 2000
            })
            console.log('@@Pay Success: ' + JSON.stringify(res))
            resolve(true)
          },
          fail: (error) => {

            if (error.errMsg == 'requestPayment:cancel') {
              console.log('取消支付');
            } else {
              wx.showToast({
                title: '支付失败,请重试!',
                icon: 'success',
                duration: 5000
              })
            }
            console.log('@@Pay fail: ' + JSON.stringify(error))
            reject(error)
          }
        })
      })
      // wx.requestPaymentAsync({
      //   appId: appConfig.appId,
      //   timeStamp: '' + orderParams.timeStamp,
      //   nonceStr: orderParams.nonceStr,
      //   package: 'prepay_id=' + orderParams.prepayId,
      //   signType: 'MD5',
      //   paySign: orderParams.paySign,
      // }).then(res => {
      //   wx.showToast({
      //     title: '支付成功！',
      //     icon: 'success',
      //     duration: 2000
      //   })

      //   console.log('@@Pay Success: ' + JSON.stringify(res))
      // })
    } else {
      wx.showToast({
        title: '支付失败,请重试!',
        icon: 'success',
        duration: 5000
      })
    }

  }).catch((error) => {
    console.log('@@Pay fail: ' + JSON.stringify(error))

    if (error.errMsg == 'requestPayment:cancel') {
      console.log('取消支付');
    } else {
      wx.showToast({
        title: '支付失败,请重试!',
        icon: 'success',
        duration: 5000
      })
    }

  })

}
