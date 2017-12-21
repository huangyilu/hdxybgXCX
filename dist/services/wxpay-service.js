import * as AuthService from './auth-service';
import * as appConfig from '../app-config';

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

    return wx.requestPaymentAsync({
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

      console.log('@@Pay Success: ' + JSON.stringify(res))
    })

  }).catch((error) => {
    console.log('@@Pay fail: ' + JSON.stringify(error))

    wx.showToast({
      title: '支付失败，请重新尝试或联系客服',
      icon: 'success',
      duration: 5000
    })
  })

}
