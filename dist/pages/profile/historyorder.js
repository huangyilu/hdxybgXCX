// pages/profile/historyOrder.js

import * as hoteldata from '../../utils/hoteldata-format';
import * as HotelDataService from '../../services/hotel-service';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: ['']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取 历史订单
    var openid = wx.getStorageSync('openid').val;
    console.log('openid .. ' + openid);

    HotelDataService.queryHistoryOrderList(openid).then((result) => {
      console.log("queryHistoryOrderList success = " + JSON.stringify(result));

      var list = hoteldata.formatHistoryorder(result)
      this.setData({
        historyList: list
      })
      console.log('historyList *** ' + JSON.stringify(list));

    }).catch((error) => {
      console.log(error);
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})