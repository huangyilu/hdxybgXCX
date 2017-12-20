// pages/celebrationDetails/celebrationList.js

import * as hoteldata from '../../utils/hoteldata-format';
import * as HotelDataService from '../../services/hotel-service';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banquet: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var me = this;
    HotelDataService.queryCelebrationList(options.celebrationid).then((result) => {
      // console.log("success = " + JSON.stringify(result.hotel));
      console.log("gethoteldata success...");
      me.setData({
        banquet: hoteldata.formatBanquet(result)
      })

    }).catch((error) => {
      console.log(error);
    })

  },

  goCelebrationDetailsPage (e) {
    wx.navigateTo({
      url: '../celebrationDetails/celebrationDetails?celebrationid=' + e.currentTarget.id
    })
  }
})