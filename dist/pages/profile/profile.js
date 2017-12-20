// profile.js

Page({
  data: {
    userInfo: {},
  },
  onLoad: function (options) {
  
    var me = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        me.setData({
          userInfo: userInfo
        })
        wx.setStorage({
          key: 'userinfo',
          data: userInfo,
        })
      }
    })

  },

  bindMessageTap () {
    
    wx.navigateTo({
      url: '../message/message',
    })

  },

  // 跳转
  goChangeSchedulePage () {
    wx.navigateTo({
      url: '../calculate/changeSchedule',
    })
  },
  goFeedbackPage () {
    wx.navigateTo({
      url: 'feedback',
    })
  },
  goHistoryOrderPage () {
    wx.navigateTo({
      url: 'historyorder',
    })
  },
  goMyorderPage () {
    wx.navigateTo({
      url: 'myorder',
    })
  }

  

})