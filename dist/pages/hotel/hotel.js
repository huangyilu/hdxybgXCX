//index.js

import * as hoteldata from '../../utils/hoteldata-format';
import * as HotelDataService from '../../services/hotel-service';
import * as AuthService from '../../services/auth-service';

// var amapFile = require('../../libs/amap-wx.js');
// var amapKey = '2a397d94c316bfaa79acf7397bcc4dbb';
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapKey = 'JJSBZ-TZ4CO-GW3WF-SLT4O-KR4BO-D5FGW';

const pageOptions = {
  data: {
    bodyHidden: true,
    // 酒店基本信息
    hotelInfo:{},
    // 评分
    score: [],

    // 宴会厅
    ballrooms: [],
    ballroomsNum: 0,
    ballPackText: "收起",

    // 婚宴菜单
    weddingmenu: [],
    weddingmenuNum: 0,

    // 宴会庆典
    banquet: []
  },
  //事件处理函数
  onLoad: function () {

    AuthService.wxappLogin()
    // 取数据
    this.getHotelData();

  },


// 页面跳转
  goBallroomPage (e) {
    var id = e.currentTarget.dataset.ballroomid;
    wx.navigateTo({
      url: '../ballroom/ballroom?ballroomid=' + id
    })
  },
  goCelebrationDetailsPage (e) {
    wx.navigateTo({
      url: '../celebrationDetails/celebrationDetails?celebrationid=' + e.currentTarget.id
    })
  },
  goWeddingTalentPage() {
    wx.navigateTo({
      url: '../weddingTalent/weddingTalent?type=dishes'
    })
  },
  goDishesDetailsPage (e) {
    wx.navigateTo({
      url: '../dishesDetails/dishesDetails?dishesid=' + e.currentTarget.id,
    })
  },
  goCelebrationListPage () {
    wx.navigateTo({
      url: '../celebrationDetails/celebrationList',
    })
  },
  // 点击事件
  bindBallroomTap: function () {

    wx.navigateTo({
      url: '../ballroom/allBallroomList',
    })

  },
  bindLocationTap: function () {

    //初始化 腾讯地图提供地理编码，拿到经纬度后打开 微信内置地图
    var me = this;
    var qqmapsdk = new QQMapWX({
      key: qqmapKey
    });

    qqmapsdk.geocoder({
      address: me.data.hotelInfo.hotelLocation,
      success: function (res) {
        // console.log("endLat = " + res.result.location.lat);
        // console.log("endng = " + res.result.location.lng);
        wx.openLocation({
          name: me.data.hotelInfo.hotelName,
          address: me.data.hotelInfo.hotelLocation,
          latitude: res.result.location.lat,
          longitude: res.result.location.lng,
          scale: 28
        })

      },
      fail: function (res) {
        console.log('qqmapsdk error' + JSON.stringify(res));
      },
      complete: function (res) {
        // console.log(res);
      }
    });

  },
  bindPhoneCallTap (e) {
    console.log(this.data.hotelInfo.hotelPhonecall);
    wx.makePhoneCall({
      phoneNumber: this.data.hotelInfo.hotelPhonecall
    })
  },
  bindHotelDescTap (e) {
    wx.showModal({
      title: e.currentTarget.dataset.title,
      showCancel: false,
      content: e.currentTarget.dataset.content
    })
  },

  // 取数据
  getHotelData() {
    var me = this;
    HotelDataService.queryHotelHome().then((result) => {
      // console.log("success = " + JSON.stringify(result.hotel));
      console.log("gethoteldata success...");

      var hotelInfo = hoteldata.formatHotelInfo(result.hotel);
      // var weddingmenu = hoteldata.formatWeddingmenu(result.comboList);

      // var bans = hoteldata.formatBanquet(result.celebrationList);

      me.setData({
        bodyHidden: false,
        hotelInfo: hotelInfo,
        score: hoteldata.getScoreStart(hotelInfo.hotelScore),
        ballrooms: hoteldata.formatBallrooms(result.banquetHallList),
        ballroomsNum: result.banquetHallList.length,
        weddingmenu: hoteldata.formatWeddingmenu(result.comboList),
        weddingmenuNum: result.comboList.length,
        banquet: hoteldata.formatBanquet(result.celebrationList),
      })

    }).catch((error) => {
      console.log(error);
    })
  }


};

Page(pageOptions);
