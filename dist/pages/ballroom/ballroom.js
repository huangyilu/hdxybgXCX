// pages/ballroom/ballroom.js

import * as hoteldata from '../../utils/hoteldata-format';
import * as HotelDataService from '../../services/hotel-service';
import shoppingCarStore from '../../services/shopping-car-store';
import contactsInfoStore from '../../services/contacts-info-store';
import moment from '../../utils/npm/moment';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ballroomid: 0,
    ballInfo: {},

    // 弹窗
    reserveddateData: {
      dateViewHidden: true,
      picker_value: '',
      picker_year: [],
      picker_month: [],
      picker_day: [],
      choose_year: '',
      choose_month: '',
      choose_day: '',
      now_year: '',
      now_month: '',
      now_day: '',
      reserved: null
    },

    tableNum: 0,
    tableHidden: true,

    shoppingcar: [],
    // 联系人 方式
    contacts: {
      contact: '',
      contactInformation: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 设当前日期
    var date = new Date()
    this.setData({
      'reserveddateData.now_year': date.getFullYear(),
      'reserveddateData.now_month': date.getMonth() + 1,
      'reserveddateData.now_day': date.getDate(),
      ballroomid: options.ballroomid,
      'reserveddateData.picker_value': moment().format('YYYY-MM-DD'),
      'reserveddateData.choose_year': moment().format('YYYY'),
      'reserveddateData.choose_month': moment().format('MM'),
      'reserveddateData.choose_day': moment().format('DD')
    })

    // console.log(options.ballroomid);

    this.getBallroomDetails(options.ballroomid);

    // 日期选择
    this.setThisMonthPicArr();

    // 查看购物车
    this.checkShoppingCar();


  },

  // 取数据
  getBallroomDetails(ballroomid) {
    var me = this;
    HotelDataService.queryBallroomDetails(+ballroomid).then((result) => {

      me.setData({
        balldetails: result,
        ballInfo: hoteldata.fomatBallroomInfo(result)
      })

      wx.setStorageSync('ballTablenNum', me.data.ballInfo.tabNumsText);
      // console.log('balldetails ... ' + JSON.stringify(result));
      
      // 切换title名字
      wx.setNavigationBarTitle({
        title: ballInfo.name,
      })

    }).catch(() => {
      console.log('fails');
    })
  },

  // 页面跳转
  goWeddingTalentPage () {
      
//    contactsInfoStore.get('reservedDate').then(result => {
//        
//        console.log('contactsInfoStore success .. ' + result);
//
////        if (result) {
//          wx.navigateTo({
//            url: '../weddingTalent/weddingTalent?reservedDate=' + result
//          })
////        } else {
////          // 弹窗选择日期
////          this.setData({
////            'reserveddateData.dateViewHidden': false
////          })
////        }
//
//    }).catch(error => {
//      console.log('contactsInfoStore .. error' + JSON.stringify(error));
//        
//      // 弹窗选择日期
//      this.setData({
//        'reserveddateData.dateViewHidden': false
//      })
//        
//    });

    var value = wx.getStorageSync('reservedDate');
//    console.log('reserveddate = ' + value);
      
      if (value) {
          wx.navigateTo({
            url: '../weddingTalent/weddingTalent?reservedDate=' + value
          })
      } else {
          // 弹窗选择日期
          this.setData({
            'reserveddateData.dateViewHidden': false
          })
      }


  },
  goScheduleQueryPage (e) {
    wx.navigateTo({
      url: '../calculate/scheduleQuery?hallid=' + this.data.ballroomid
    })
  },
  goAppointmentSitePage () {
    wx.navigateTo({
      url: '../calculate/appointmentSite?hallid=' + this.data.ballroomid
    })
  },
  goCommentPage () {
    wx.navigateTo({
      url: '../ballroom/ballCommentList?hallid=' + this.data.ballroomid
    })
  },

  // 点击事件
  pickerChange(e) {
    const val = e.detail.value;

    var choose_year = this.data.reserveddateData.picker_year[val[0]],
      choose_month = this.data.reserveddateData.picker_month[val[1]],
      choose_day = this.data.reserveddateData.picker_day[val[2]];

    var dateString = choose_year + '-' + choose_month + '-' + choose_day;
    // 检测 日期 是否可预订
    HotelDataService.queryIsReserved(dateString, this.data.ballroomid).then((result) => {
      // false 没有被预订
      // console.log('queryIsReserved ... ' + JSON.stringify(result));
      this.setData({
        'reserveddateData.reserved': result
      })

      console.log('queryIsReserved ... ' + JSON.stringify(this.data.reserveddateData.reserved));

    }).catch(() => {
      console.log('fails');
    })
    
    this.setData({
      'reserveddateData.choose_year': choose_year,
      'reserveddateData.choose_month': choose_month,
      'reserveddateData.choose_day': choose_day
    })
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  setThisMonthPicArr() {
    var now_year = this.data.reserveddateData.now_year,
      now_month = this.data.reserveddateData.now_month,
      now_day = this.data.reserveddateData.now_day;

    var picker_year = [],
        picker_month = [],
        picker_day = [];
    for (var i = now_year; i <= (now_year + 100); i++) {
      picker_year.push(i);
    }
    for (var i = 1; i <= 12; i++) {
      if (i < 10) {
        i = '0' + i;
      }
      picker_month.push(i);
    }
    var end_day = this.getThisMonthDays(now_year, now_month);
    for (var i = 1; i <= end_day; i++) {
      if (i < 10) {
        i = '0' + i;
      }
      picker_day.push(i);
    }
    var idx_year = picker_year.indexOf(now_year);
    var idx_month = picker_month.indexOf(now_month);
    var idx_day = picker_day.indexOf(now_day);

    // console.log('idx_year: ' + idx_year + ' idx_month: ' + idx_month + ' idx_day: ' + idx_day);

    this.setData({
      'reserveddateData.picker_value': [idx_year, idx_month, idx_day],
      'reserveddateData.picker_year': picker_year,
      'reserveddateData.picker_month': picker_month,
      'reserveddateData.picker_day': picker_day
    });
  },
  bindSaveChooseTime () {
    var chooseTime = this.data.reserveddateData.choose_year + '-' + this.data.reserveddateData.choose_month + '-' + this.data.reserveddateData.choose_day;
    chooseTime = moment(chooseTime).format('YYYY-MM-DD');

    if (moment(chooseTime).isBefore()) {
      wx.showModal({
        title: '提示',
        content: '不能选择今天以前的日期！',
        showCancel: false
      })
    } else {
      // 预订时间 联系人 存储本地
      this.saveLocalChooseTime(chooseTime);
      this.saveLocalContacts(this.data.contacts);
      // 加入购物车
      this.joinShoppingCar();
      this.setData({
        'reserveddateData.dateViewHidden': true
      })
      
      wx.navigateTo({
        url: '../weddingTalent/weddingTalent?reservedDate=' + chooseTime
      })
    }
  },
  
  checkShoppingCar () {
    shoppingCarStore.get('shoppingcar').then(result => {

      console.log('shoppingcar...' + JSON.stringify(result));
      this.setData({
        shoppingcar: result
      })

    }).catch(error => {
      console.log(error);
    });
  },
  joinShoppingCar () {
    var balldetails = hoteldata.formatLocalShoppingcar(this.data.balldetails, '宴会厅');
    var newShoppingcar = this.data.shoppingcar;
    newShoppingcar.push(balldetails);
    shoppingCarStore.save('shoppingcar', newShoppingcar);
  },
  saveLocalChooseTime (chooseTime) {
    wx.setStorage({
      key: "reservedDate",
      data: chooseTime
    })
      
//    contactsInfoStore.save('reservedDate', chooseTime);
  },
  saveLocalContacts (contacts) {
    wx.setStorage({
      key: "contacts",
      data: contacts
    })
//    contactsInfoStore.save('contacts', contacts);
  },

  bindContactInput (e) {
    this.setData({
      'contacts.contact': e.detail.value
    })
  },
  bindContactInfoInput (e) {
    this.setData({
      'contacts.contactInformation': e.detail.value
    })
  },
  bindTablesChooseTap () {
    this.setData({
      tableHidden: false
    })
  },
  bindTableSliderChange (e) {
    this.setData({
      'ballInfo.tabNumsText': e.detail.value
    })
    //保存桌数
    wx.setStorageSync('ballTablenNum', e.detail.value);
  },
  bindCancelBtnTap (e) {
    if (e.currentTarget.dataset.type == 'table') {
      this.setData({
        tableHidden: true
      })
    } else {
      this.setData({
       'reserveddateData.dateViewHidden': true
      })
    }
  },
  bindConfirmBtnTap (e) {
    // if (e.currentTarget.dataset.type == 'table') {
      // 检查是否选过桌数 保存桌数
      // this.bindSaveTableNum();

    // } else {

      if (!this.data.reserveddateData.reserved) {
        // 检查是否有选过 预订时间
        this.bindSaveChooseTime();
      }

    // }
  },
  bindSaveTableNum () {
    var value = wx.getStorageSync('ballTablenNum');
    if (value) {
      this.setData({
        'ballInfo.tabNumsText': value
      })
    } else {
      wx.setStorageSync('ballTablenNum', this.data.ballInfo.tabNumsText);
    }
    this.setData({
      tableHidden: true
    })
  }

})