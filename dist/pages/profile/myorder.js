// pages/profile/myorder.js
var sliderWidth = 60; // 需要设置slider的宽度，用于计算中间位置
import * as hoteldata from '../../utils/hoteldata-format';
import * as HotelDataService from '../../services/hotel-service';
import * as AuthService from '../../services/auth-service';
import { Base64 } from '../../utils/urlsafe-base64'

import { makeFinalPay, makePayment, requestPayment } from '../../services/wxpay-service';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarTabs:['待付款','付尾款','待评价'],
    // navbarTabs: ['待付款', '待评价'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    // 定金
    depositPrice: 0,
    // 尾款
    retainagePrice: 0,

    // 预约单 目前先用预约单代替 待付款
    appointmentList: [],

    // 付尾款
    paymentList: [],

    // 待评价
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var res = wx.getSystemInfoSync();
    this.setData({
      'windowHeight': res.windowHeight,
      sliderLeft: (res.windowWidth / this.data.navbarTabs.length - sliderWidth) / 2,
      openid: wx.getStorageSync('openid').val
    });

    //获取待付款订单
    // this.getAppointments();
    // 获取待评价订单
    // this.getPendingComments();

    
    
  
  },
  onShow: function (options) {
    // Do something when show.

    //获取待付款订单
    this.getAppointments();
    // 获取待评价订单
    // this.getPendingComments();
    //获取 付尾款 订单
    // this.getPayRetainagePrice();

  },

  // tab切换
  navbarTabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    switch (+e.currentTarget.id) {
      case 0:
        // if (this.data.appointmentList.length <= 0) {
          //获取 待付款 订单
          this.getAppointments();
        // }
        break;
      case 1:
        // if (this.data.paymentList.length <= 0) {
          //获取 付尾款 订单
          this.getPayRetainagePrice();
        // }
        break;
      case 2:
        // if (this.data.commentList.length <= 0) {
          //获取 待评价 订单
          this.getPendingComments();
        // }
        break;
    }
    

  },

  // 获取数据
  getPendingComments() {
    // 待评价订单
    HotelDataService.queryPendingCommentList(this.data.openid).then((result) => {
      this.setData({
        commentResult: result,
        commentList: hoteldata.formatMyorderComments(result)
      })
    }).catch((error) => {
      console.log(error);
    })
  },
  getAppointments() {
    // 待付款
    HotelDataService.queryUnpaidOrderList(this.data.openid).then((result) => {
      // console.log("queryUnpaidOrderList success = " + JSON.stringify(result));
      this.setData({
        appointmentList: hoteldata.formatMyorderAppointmentList(result)
      })
      // console.log("appointmentList success = " + JSON.stringify(this.data.appointmentList));
      
    }).catch((error) => {
      console.log(error);
    })
  },
  getPayRetainagePrice() {
    // 查看 待付尾款 list
    HotelDataService.queryAppointmentList(this.data.openid).then((result) => {
      // console.log("uploadFinalPay success = " + JSON.stringify(result));
      this.setData({
        paymentList: hoteldata.formatMyorderPayRetainagePrice(result)
      })
      console.log("appointmentList success = " + JSON.stringify(this.data.paymentList));
    }).catch((error) => {
      console.log(error);
    })

  },

  bindAppointmentTap (e) {
    var title = e.currentTarget.dataset.title;
    // console.log(title);
    if (title == '宴会厅') {
      wx.navigateTo({
        url: '../ballroom/ballroom',
      })
    } else if (title == '菜品') {
      wx.navigateTo({
        url: '../dishesDetails/dishesDetails',
      })
    } else if (title == '婚礼人才') {
      wx.navigateTo({
        url: '../talentDetails/talentDetails',
      })
    } else if (title == '宴会庆典产品') {
      wx.navigateTo({
        url: '../celebrationDetails/celebrationDetails',
      })
    }

  },
  // 待评价
  bindCommentBtnTap (e) {

    var payid = e.currentTarget.dataset.payid;
    var index = e.currentTarget.id;
    wx.navigateTo({
      url: '../comment/comment?comment=' + Base64.encodeURI(JSON.stringify(this.data.commentResult[index])),
    })
  },

  // 付尾款的
  bindCheckboxChange (e) {
    console.log(e.detail.value);

    var depositPrice = 0;
    var retainagePrice = 0;

    if (e.detail.value.length > 0) {
      var checkedIndex = +e.detail.value[0];
      var paymentList = this.data.paymentList[checkedIndex];
      var payid = paymentList.payid;
      depositPrice = paymentList.depositPrice + this.data.depositPrice;
      retainagePrice = paymentList.retainagePrice + this.data.retainagePrice;
      console.log(payid);
    }

    this.setData({
      depositPrice: depositPrice ,
      retainagePrice: retainagePrice 
    })


    // console.log(totalPrice);

  },
  // 付尾款 最后确认
  bindPaymentTap () {
    wx.navigateTo({
      url: 'paymentCom',
    })
  },

  bindFinalyPayCellTap (e) {
    var index = e.currentTarget.id;
    var orderid = e.currentTarget.dataset.orderid;

    makeFinalPay(orderid, this.data.openid).then((result) => {
      console.log('支付 尾款 result...' + JSON.stringify(result));

      //刷新 付尾款 订单
      this.getPayRetainagePrice();

    }).catch((error) => {
      console.log('makePayment fail: ' + JSON.stringify(error));
    })
  },
  // 待付款 (购物车中点击付款后，未支付成功的订单，可在此处再次提交付款)
  bindPrePayCellTap (e) {
    
    var index = e.currentTarget.id;
    var orderid = e.currentTarget.dataset.orderid;

    var params = wx.getStorageSync('prepayOrderParams');

    requestPayment(params).then((result) => {
      console.log('支付 定金 result...' + JSON.stringify(result));
      
      if (result) {
        // 刷新 待付款
        this.getAppointments();
      }

    }).catch((error) => {
      console.log('makePayment fail: ' + JSON.stringify(error));
    })


  },
  // 取消订单 (交易关闭)
  bindCancelOrderTap (e) {
    var orderid = e.currentTarget.dataset.orderid;
    HotelDataService.uploadCloseUppayOrder(orderid).then((result) => {
      console.log('uploadCloseUppayOrder success: ' + JSON.stringify(result));

      if (result == 'SUCCESS') {
        // 刷新 待付款
        this.getAppointments();
      }

    }).catch((error) => {
      console.log('uploadCloseUppayOrder fail: ' + JSON.stringify(error));
    })
  }
  
})