// pages/dishesDetails/dishesComment.js

import * as hoteldata from '../../utils/hoteldata-format';
import * as HotelDataService from '../../services/hotel-service';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments: ['']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    HotelDataService.queryDishesComment(options.comboid).then((result) => {
      // console.log("success = " + JSON.stringify(result.hotel));
      this.setData({
        comments: hoteldata.formaHotelCommentList(result)
      })

    }).catch((error) => {
      console.log(error);
    })

  }


})