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

export function getBrandWCPayRequestParams(dic) {
  return urlencodePostRequest('pay/prepay', dic);
}

export function uploadPaySuccess (dic) {
  return urlencodePostRequest('pay/completePay', dic);
}

export function makePayment(payDic) {

  return getBrandWCPayRequestParams(payDic).then((orderParams) => {
    
    if (orderParams.result) {
      return new Promise((resolve, reject) => {
        wx.requestPaymentAsync({
          appId: appConfig.appId,
          timeStamp: '' + orderParams.timeStamp,
          nonceStr: orderParams.nonceStr,
          package: 'prepay_id=' + orderParams.prepayId,
          signType: 'MD5',
          paySign: orderParams.paySign,
        }).then(res => {
          wx.showToast({
            title: '支付成功！',
            icon: 'success',
            duration: 2000
          })

          // var successInfo = {
          //   transactionId: transactionId, 
          //   orderId: orderParams.orderId, 
          //   price: payDic.price,
          //   priceType: orderParams.unPayTransPay
          // }

          // return uploadPaySuccess(successInfo).then((item) => {
          //   console.log('支付成功信息 提交成功。。' + item);
          // })
          return resolve(true)
          console.log('@@Pay Success: ' + JSON.stringify(res))
        })
      })
    } else {
      wx.showToast({
        title: '支付失败,请重试!',
        icon: 'success',
        duration: 5000
      })
      // return reject(false)
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

    return false
  })

}
