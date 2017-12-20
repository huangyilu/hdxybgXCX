import * as AuthService from './auth-service';

import {
  wxJsonBackendPostRequestP as jsonPostRequest
}
  from './wx-request-promise';

export function getBrandWCPayRequestParams(productId, attach, amount) {
  let cred = AuthService.getCredentials()
  console.log('cred:' + JSON.stringify(cred))
  return jsonPostRequest('Orders/wxpayreqparams', {
    openid: cred.openid,
    product_id: productId,
    attach,
    amount
  })
}

export const donationItems = [
  {
    name: '1元',
    productId: 'Donation100',
    amount: 100,
    icon: '../../images/money/RMB1.png'
  }
]

export function makeDonation(donationAmount, donationTarget, amount, ) {

  let donationItem = donationItems.find(d => d.amount === donationAmount)
  if (!donationItem) {
    donationItem = makeFreeDonationItem(donationAmount)
  }
  let attach
  if (donationTarget) {
    attach = JSON.stringify(donationTarget)
  } else {
    attach = '打赏'
  }

  return getBrandWCPayRequestParams(donationItem.productId, attach, donationItem.donationAmount).then((orderParams) => {
    return wx.requestPaymentAsync({
      timeStamp: orderParams.timestamp,
      nonceStr: orderParams.nonceStr,
      package: orderParams.package,
      signType: orderParams.signType,
      paySign: orderParams.paySign
    }).then(res => {
      wx.showToast({
        title: '支付成功！',
        icon: 'success',
        duration: 2000
      })
      console.log('@@Pay Success: ' + JSON.stringify(res))
    })
    //            .catch(res => {
    //                console.log('@@Pay Failed: ' + JSON.stringify(res))
    //            })
  }).catch((error) => {
    console.log(error)
    wx.showToast({
      title: '支付失败，请重新尝试或联系客服',
      icon: 'success',
      duration: 5000
    })
  })
}
