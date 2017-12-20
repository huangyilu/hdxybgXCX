// pages/profile/myorder.js
var sliderWidth = 60; // 需要设置slider的宽度，用于计算中间位置
import * as hoteldata from '../../utils/hoteldata-format';
import * as HotelDataService from '../../services/hotel-service';
import * as AuthService from '../../services/auth-service';
import { Base64 } from '../../utils/urlsafe-base64'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // navbarTabs:['待付款','付尾款','待评价'],
    navbarTabs: ['待付款', '待评价'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    // 定金
    depositPrice: 0,
    // 尾款
    retainagePrice: 0,

    // 预约单 目前先用预约单代替 待付款
    appointmentList: [],

    // 待付款
    paymentList: [
      {
        payid: 0,
        time: '2017-09-09',
        depositPrice: 10000,
        retainagePrice: 28888,
        checked: false,
        payList: [
          {
            imgUrl: '../../images/1.jpg',
            title: '宴会厅',
            name: '苏园厅',
            floor: '1F',
            floorHeight: '层高:7m',
            price: '2888',
            nums: '1',
            checked: 'true'
          },
          {
            imgUrl: '../../images/1.jpg',
            title: '菜品',
            name: '佳偶天成宴',
            floor: '',
            floorHeight: '',
            price: '2588/桌',
            nums: '28'
          }
        ]
      }
    ],

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
      openid: wx.getStorageSync('openid')
    });

    //获取待付款订单
    // this.getAppointments();
    // 获取待评价订单
    // this.getPendingComments();
    
    
    
  },
  onShow: function (options) {
    // Do something when show.

    // 获取待评价订单
    this.getPendingComments();
    //获取待付款订单
    this.getAppointments();

  },

  navbarTabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  // 获取数据
  getPendingComments() {
    // 获取待评价订单
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
    HotelDataService.queryAppointmentList(this.data.openid).then((result) => {
      // console.log("queryAppointmentList success = " + JSON.stringify(result));
      this.setData({
        appointmentList: hoteldata.formatMyorderAppointmentList(result)
      })
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
  bindPaymentComTap () {
    wx.navigateTo({
      url: 'paymentCom',
    })
  }

  
})