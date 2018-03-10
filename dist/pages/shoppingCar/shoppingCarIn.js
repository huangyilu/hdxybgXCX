// pages/shoppingCar/shoppingCarIn.js

import { remove } from '../../utils/npm/lodash-wx';
import shoppingCarStore from '../../services/shopping-car-store';
import contactsInfoStore from '../../services/contacts-info-store';
import * as HotelDataService from '../../services/hotel-service';
import * as hoteldata from '../../utils/hoteldata-format';
import { uniqWith, isEqual, difference } from '../../utils/npm/lodash-wx'
import moment from '../../utils/npm/moment';

import { makePayment, makePaymentWithO } from '../../services/wxpay-service';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    prepagetype: '',

    allchecked: true,
    totalPrice: 0,
    prepayPrice: 0,
    edit: '管理',
    paymentList: [],
    shoppingcarinstore: [],
    openId: 0,
    prepayPercent: 0,
    appointmentList: [],

    // 桌数
    tableHidden: true,
    tabNumsText: 0,
    minTable: 0,
    maxTable: 0,

    // 宴会庆典
    packageStage: {},

    // 购物车 补齐类型
    shoppingtypes: [],

    // 弹窗
    // reserveddateData: {
    //   dateViewHidden: true,
    //   picker_value: '',
    //   picker_year: [],
    //   picker_month: [],
    //   picker_day: [],
    //   choose_year: '',
    //   choose_month: '',
    //   choose_day: '',
    //   now_year: '',
    //   now_month: '',
    //   now_day: ''
    // },

    // 性别
    genderItems: [
      { name: '女士', value: '女士', checked: 'true' },
      { name: '先生', value: '先生' },
    ],

    // 是否 同时选了人才 和庆典 全部准备好 预约下单
    isGetReadyMakeAppoint: true,
    reservedDate: ''
  },

  onShow: function () {
    this.getShoppingCarData();
    this.getAppointments();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 设当前日期
    // var date = new Date()
    // this.setData({
    //   'reserveddateData.now_year': date.getFullYear(),
    //   'reserveddateData.now_month': date.getMonth() + 1,
    //   'reserveddateData.now_day': date.getDate(),
    //   ballroomid: options.ballroomid,
    //   'reserveddateData.picker_value': moment().format('YYYY-MM-DD'),
    //   'reserveddateData.choose_year': moment().format('YYYY'),
    //   'reserveddateData.choose_month': moment().format('MM'),
    //   'reserveddateData.choose_day': moment().format('DD')
    // })
    //初始化 日期选择
    // this.setThisMonthPicArr();

    // this.getShoppingCarData();


    this.setData({
      openId: wx.getStorageSync('openid').val,
      prepayPercent: wx.getStorageSync('prepayPercent'),
      prepagetype: options.prepagetype ? options.prepagetype : ''
    })

  },
  onUnload: function () {
    // shoppingCarStore.remove('shoppingcar');
  },

  checkShoppingCar(result) {

    var types = ['宴会厅', '菜品', '主持人', '策划师', '摄影师', '化妆师'];
    // var types = ['宴会厅', '菜品', '主持人', '策划师', '摄影师', '化妆师', '宴会庆典'];
    var shoppingtyppes = [];
    var istalent = false;
    var isCelebration = false;
    var isBallroom = false;
    result.forEach(item => {
      if (item.title == '婚礼人才') {
        shoppingtyppes.push(item.content.info.talentname);
      } else {
        shoppingtyppes.push(item.title);
      }

      if (item.title == '婚礼人才' && item.selected == true) {
        istalent = true;
      }
      // if (item.title == '宴会庆典' && item.selected == true) {
      //   isCelebration = true;
      // }
      if (item.title == '宴会厅' && item.selected == true) {
        isBallroom = true;
      }

    })

    if (isBallroom) {
      // if (istalent) {
      //   if (isCelebration) {
      //     // 如果选了婚礼人才 没选庆典 则不可下单
      //     this.setData({
      //       isGetReadyMakeAppoint: true
      //     })
      //   } else {
      //     this.setData({
      //       isGetReadyMakeAppoint: false
      //     })
      //   }
      // } else {
      //   this.setData({
      //     isGetReadyMakeAppoint: true
      //   })
      // }
    } else {
      this.setData({
        isGetReadyMakeAppoint: false
      })
    }

    // shoppingtyppes = uniqWith(shoppingtyppes, isEqual);
    // console.log('已选的数组 shoppingtyppes...' + JSON.stringify(shoppingtyppes));

    var newTypes = difference(types, shoppingtyppes);
    // console.log('缺少的数组 new Types .. ' + JSON.stringify(newTypes));

    // console.log('isGetReadyMakeAppoint 状态 ...' + this.data.isGetReadyMakeAppoint);

    this.setData({
      shoppingtypes: newTypes
    })


  },
  // 判断是否 填写了 预订日期 联系人 等，如果没有选宴会厅 就是没选
  // checkReserveddate() {

  //   if (!wx.getStorageSync('reservedDate')) {

  //     this.setData({
  //       'reserveddateData.dateViewHidden': false
  //     })
  //     return false;
  //   } else {
  //     return true;
  //   }
  // },

  getAppointments() {
    // 待付款
    HotelDataService.queryUnpaidOrderList(wx.getStorageSync('openid').val).then((result) => {
      this.setData({
        appointmentList: result
      })
    }).catch((error) => {
      console.log(error);
    })
  },
  getShoppingCarData() {
    shoppingCarStore.get('shoppingcar').then(result => {

      this.getMaxMinTable(result);
      this.setData({
        shoppingcarinstore: hoteldata.formatShoppingcarInStore(result),
        paymentList: hoteldata.formatShoppingcar(result, this.data.tabNumsText)
      })

      console.log('get shoppingcar...' + JSON.stringify(hoteldata.formatShoppingcarInStore(result)));

      this.getTotalPrice(this.data.paymentList);
      // 检查 购物是否完整
      this.checkShoppingCar(result);
      // console.log('format paymentList../=' + JSON.stringify(this.data.paymentList));

    }).catch(error => {
      console.log(error);
    });

    //取 联系人信息 日期等
    var contacts = wx.getStorageSync('contacts') ? wx.getStorageSync('contacts') : '';
    var reservedDate = wx.getStorageSync('reservedDate') ? wx.getStorageSync('reservedDate') : '';
    var isGetReadyMakeAppoint = this.data.isGetReadyMakeAppoint;

    if (contacts == '' || reservedDate == '') {
      isGetReadyMakeAppoint = false;
    }

    console.log('contacts = ' + contacts);
    console.log('reservedDate = ' + reservedDate);

    this.setData({
      contacts: contacts,
      reservedDate: reservedDate,
      isGetReadyMakeAppoint: isGetReadyMakeAppoint
    })

  },
  // 获取最大桌数 最小桌数 宴会庆典 全息信息等
  getMaxMinTable(list) {
    var min = 0;
    var max = 0;
    var packageStage = {};

    list.forEach(item => {
      if (item.title == '宴会厅') {
        min = item.content.info.minTable;
        max = item.content.info.maxTable;
      } else if (item.title == '宴会庆典') {
        packageStage = item.content.packageStage
      }
    })
    var tabNumsText = min;
    if (wx.getStorageSync('ballTablenNum')) {
      tabNumsText = wx.getStorageSync('ballTablenNum');
    }

    console.log('tabNumsText .. ' + tabNumsText);

    this.setData({
      minTable: min,
      maxTable: max,
      tabNumsText: tabNumsText,
      packageStage: packageStage
    })
  },
  // 计算购物车总价
  getTotalPrice(list) {
    var price = 0;
    list.forEach(item => {
      if (item.checked == true) {
        price = price + (item.price * item.nums)
      }
    })
    this.setData({
      totalPrice: price,
      prepayPrice: (price * (+this.data.prepayPercent / 100)).toFixed(2)
    })
  },

  bindCheckboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.paymentList,
      values = e.detail.value;
    var shoppingcarinstore = this.data.shoppingcarinstore;

    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      shoppingcarinstore[i].selected = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].shopppingid == values[j]) {
          checkboxItems[i].checked = true;
          shoppingcarinstore[i].selected = true;
          break;
        }
      }
    }
    if (this.data.allchecked) {
      this.setData({
        allchecked: !this.data.allchecked
      });
    }
    this.setData({
      paymentList: checkboxItems,
      shoppingcarinstore: shoppingcarinstore
    });
    this.getTotalPrice(this.data.paymentList);
    // 检查 购物是否完整
    this.checkShoppingCar(this.data.shoppingcarinstore);
  },
  bindAllCheckboxChange(e) {
    // console.log(e);
    var allchecked = e.currentTarget.dataset.checked;
    // console.log(allchecked);
    var paymentList = this.data.paymentList;
    var shoppingcarinstore = this.data.shoppingcarinstore;

    paymentList.forEach(function (paylist, j) {
      paylist.checked = !allchecked;
    })
    shoppingcarinstore.forEach(function (storelist, j) {
      storelist.selected = !allchecked;
    })

    this.setData({
      paymentList: paymentList,
      allchecked: !allchecked,
      shoppingcarinstore: shoppingcarinstore
    })
    this.getTotalPrice(this.data.paymentList);
    // 检查 购物是否完整
    this.checkShoppingCar(this.data.shoppingcarinstore);
  },
  bindOrderEditTap(e) {

    var edit = this.data.edit;

    if (edit == '管理') {
      edit = '完成';
    } else {
      edit = '管理';
      //更新 本地购物车

      console.log('更新本地购物车 shoppingcarinstore .. ' + JSON.stringify(this.data.shoppingcarinstore));

      shoppingCarStore.save('shoppingcar', this.data.shoppingcarinstore);
      this.getTotalPrice(this.data.paymentList);

      // 检查 购物是否完整
      this.checkShoppingCar(this.data.shoppingcarinstore);
      // 检查 如果 删掉了 宴会厅 则把本地保存的联系人 方式 预约日期 删除
      this.checkBallroomDeleted();

    }
    this.setData({
      edit: edit
    })

  },
  bindDeleteTap(e) {

    var shoppingcarinstore = this.data.shoppingcarinstore;
    var paymentList = this.data.paymentList;

    remove(shoppingcarinstore, function (n) {
      return n.selected == true;
    });
    remove(paymentList, function (n) {
      return n.checked == true;
    });

    this.setData({
      paymentList: paymentList,
      shoppingcarinstore: shoppingcarinstore
    })
  },
  bindShoppingEditTap(e) {

    var shopppingid = e.currentTarget.dataset.shopppingid,
      payList = this.data.paymentList,
      editType = e.currentTarget.dataset.type,
      shoppingcarinstore = this.data.shoppingcarinstore;

    if (editType == 'edit') {
      payList[shopppingid].symbolEdit = 'true';
    } else {
      payList[shopppingid].symbolEdit = 'false';
    }
    this.setData({
      paymentList: payList
    })

  },
  bindShoppingSymbolTap(e) {

    var syType = e.currentTarget.dataset.type,
      shopppingid = e.currentTarget.dataset.shopppingid,
      payList = this.data.paymentList;

    if (syType == 'reduce') {

      if (payList[shopppingid].nums == this.data.minTable) {
        wx.showModal({
          title: '提示',
          content: '不能再减少啦~',
          showCancel: false
        })
      } else {
        payList[shopppingid].nums--;
      }

    } else {
      if (payList[shopppingid].nums == this.data.maxTable) {
        wx.showModal({
          title: '提示',
          content: '不能再多啦~',
          showCancel: false
        })
      } else {
        payList[shopppingid].nums++;
      }
    }
    this.setData({
      tabNumsText: payList[shopppingid].nums,
      paymentList: payList
    })

    //保存桌数
    wx.setStorageSync('ballTablenNum', payList[shopppingid].nums);

    this.getTotalPrice(this.data.paymentList);

  },
  // 付定金
  bindPayTap(e) {
    // if (this.checkReserveddate()) {
      // 判断 是否 有未付款的 订单 如果有，则不可以再下单
      if (this.data.appointmentList.length > 0) {
        //还有未 付款的 订单
        wx.showModal({
          title: '提示！',
          content: '您还有未付定金的订单！请付款后再下单！',
        })
      } else {
        // 判断 是否 同时选了人才 和庆典 
        if (this.data.isGetReadyMakeAppoint) {
          // 上传 资料
          // 如果价钱为0时，走另一个接口
          if (this.data.prepayPrice == 0) {
            this.bindUploadPriceOPrepay();
          } else {
            this.bindUploadPrepay();
          }
        } else {
          wx.showModal({
            title: '提示！',
            content: '选了人才一定要选宴会庆典哦！',
          })
        }
      }
    // }
  },
  bindUploadPrepay(e) {

    var info = hoteldata.formatuploadPrepay(this.data.shoppingcarinstore, this.data.reservedDate, this.data.contacts.contact, this.data.contacts.contactInformation, this.data.contacts.gender, this.data.totalPrice, +this.data.prepayPrice, +this.data.tabNumsText, '酒店服务', this.data.packageStage.packName, this.data.packageStage.stage, this.data.packageStage.packPrice, this.data.openId);

    console.log('info ... ' + JSON.stringify(info));

    // 发起支付
    makePayment(info).then((result) => {
      console.log('makePayment result...' + JSON.stringify(result));

      if (result == true) {
        // 跳转 我的订单 付尾款
        wx.switchTab({
          url: '../profile/profile',
          success: function () {
            wx.navigateTo({
              url: '../profile/myorder?swipindex=1',
            })
          }
        })
        // 清空 本地购物车联系人 预定日期
        this.removeSavedContacts();

      } else if (result == false) {
        // 跳转 我的订单 待付款
        wx.switchTab({
          url: '../profile/profile',
          success: function () {
            wx.navigateTo({
              url: '../profile/myorder',
            })
          }
        })
        // 清空 本地购物车联系人 预定日期
        this.removeSavedContacts();
      }

    }).catch((error) => {
      console.log('makePayment fail: ' + JSON.stringify(error));

      if (error == false) {
        // 跳转 我的订单 待付款
        wx.switchTab({
          url: '../profile/profile',
          success: function () {
            wx.navigateTo({
              url: '../profile/myorder',
            })
          }
        })
        // 清空 本地购物车联系人 预定日期
        this.removeSavedContacts();
      }
      if (error == 1) {
        // 清空 本地购物车联系人 预定日期
        this.removeSavedContacts();
        // 跳转 首页
        wx.switchTab({
          url: '../hotel/hotel',
        })
      } else if (error == 2) {
        // 跳转 首页
        wx.switchTab({
          url: '../hotel/hotel',
        })
      }

    })

  },
  // 如果价钱为0时走另一个接口
  bindUploadPriceOPrepay() {

    var info = hoteldata.formatuploadPrepay(this.data.shoppingcarinstore, this.data.reservedDate, this.data.contacts.contact, this.data.contacts.contactInformation, this.data.contacts.gender, this.data.totalPrice, +this.data.prepayPrice, +this.data.tabNumsText, '酒店服务', this.data.packageStage.packName, this.data.packageStage.stage, this.data.packageStage.packPrice, this.data.openId);

    console.log('bindUploadPriceOPrepay info ... ' + JSON.stringify(info));

    makePaymentWithO(info).then((result) => {

      // 跳转 我的订单 待付款
      wx.navigateTo({
        url: '../profile/myorder',
      })
      // 清空 本地购物车联系人 预定日期
      this.removeSavedContacts();

    }).catch((error) => {
      console.log(error);
    })
  },
  bindMissingShoppingTypesTap(e) {

    // 注意 此处 与 外部 购物车 不一样 的操作！
    if (this.data.prepagetype == 'wedtalt') {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateBack({
        delta: 2
      })
    }

  },

  // 检查 如果 删掉了宴会厅 -- 即还缺 宴会厅 则把本地保存的联系人 方式 预约日期 删除
  checkBallroomDeleted() {
    console.log('checkBallroomDeleted');
    var shoppingtypes = this.data.shoppingtypes;
    shoppingtypes.forEach(item => {
      if (item == '宴会厅') {
        // this.removeSavedContacts();
        wx.removeStorage({
          key: 'reservedDate',
          success: function (res) {
            console.log('removeStorage reservedDate')
          }
        })
        wx.removeStorage({
          key: 'contacts',
          success: function (res) {
            console.log('removeStorage contacts')
          }
        })
        wx.removeStorage({
          key: 'packageStage',
          success: function (res) {
            console.log('removeStorage packageStage')
          },
        })
      }
    })
  },
  // 清空本地 联系人 方式 预约日期
  removeSavedContacts() {

    shoppingCarStore.clear('shoppingcar').finally(() => {

      console.log('removeStorage shoppingcar')
      this.setData({
        paymentList: [],
        shoppingcarinstore: []
      })

      this.getTotalPrice(this.data.paymentList);

    });

    wx.removeStorage({
      key: 'reservedDate',
      success: function (res) {
        console.log('removeStorage reservedDate')
      }
    })
    wx.removeStorage({
      key: 'contacts',
      success: function (res) {
        console.log('removeStorage contacts')
      }
    })
  },
  // 填写联系人电话选预约日期
  // pickerChange(e) {
  //   const val = e.detail.value;

  //   var choose_year = this.data.reserveddateData.picker_year[val[0]],
  //     choose_month = this.data.reserveddateData.picker_month[val[1]],
  //     choose_day = this.data.reserveddateData.picker_day[val[2]];

  //   this.setData({
  //     'reserveddateData.choose_year': choose_year,
  //     'reserveddateData.choose_month': choose_month,
  //     'reserveddateData.choose_day': choose_day
  //   })
  // },
  // getThisMonthDays(year, month) {
  //   return new Date(year, month, 0).getDate();
  // },
  // setThisMonthPicArr() {
  //   var now_year = this.data.reserveddateData.now_year,
  //     now_month = this.data.reserveddateData.now_month,
  //     now_day = this.data.reserveddateData.now_day;

  //   var picker_year = [],
  //     picker_month = [],
  //     picker_day = [];
  //   for (var i = now_year; i <= (now_year + 100); i++) {
  //     picker_year.push(i);
  //   }
  //   for (var i = 1; i <= 12; i++) {
  //     if (i < 10) {
  //       i = '0' + i;
  //     }
  //     picker_month.push(i);
  //   }
  //   var end_day = this.getThisMonthDays(now_year, now_month);
  //   for (var i = 1; i <= end_day; i++) {
  //     if (i < 10) {
  //       i = '0' + i;
  //     }
  //     picker_day.push(i);
  //   }
  //   var idx_year = picker_year.indexOf(now_year);
  //   var idx_month = picker_month.indexOf(now_month);
  //   var idx_day = picker_day.indexOf(now_day);

  //   this.setData({
  //     'reserveddateData.picker_value': [idx_year, idx_month, idx_day],
  //     'reserveddateData.picker_year': picker_year,
  //     'reserveddateData.picker_month': picker_month,
  //     'reserveddateData.picker_day': picker_day
  //   });
  // },
  // bindSaveChooseTime() {
  //   var chooseTime = this.data.reserveddateData.choose_year + '-' + this.data.reserveddateData.choose_month + '-' + this.data.reserveddateData.choose_day;
  //   chooseTime = moment(chooseTime).format('YYYY-MM-DD');

  //   if (moment(chooseTime).isBefore()) {
  //     wx.showModal({
  //       title: '提示',
  //       content: '不能选择今天以前的日期！',
  //       showCancel: false
  //     })
  //   } else {
  //     // 预订时间 联系人 存储本地
  //     this.saveLocalChooseTime(chooseTime);
  //     this.saveLocalContacts(this.data.contacts);

  //     this.setData({
  //       'reserveddateData.dateViewHidden': true
  //     })
  //   }
  // },
  // bindCancelBtnTap(e) {
  //   if (e.currentTarget.dataset.type == 'table') {
  //   } else {
  //     this.setData({
  //       'reserveddateData.dateViewHidden': true
  //     })
  //   }
  // },
  // bindConfirmBtnTap(e) {
  //   if (e.currentTarget.dataset.type == 'table') {
  //   } else {
  //     // 检查是否有选过 预订时间
  //     this.bindSaveChooseTime();
  //   }
  // },
  // bindContactInput(e) {
  //   this.setData({
  //     'contacts.contact': e.detail.value
  //   })
  // },
  // bindContactInfoInput(e) {
  //   this.setData({
  //     'contacts.contactInformation': e.detail.value
  //   })
  // },
  // bindGenderCheckboxChange(e) {
  //   this.setData({
  //     'contacts.gender': e.detail.value
  //   })
  // },

  // saveLocalChooseTime(chooseTime) {
  //   wx.setStorage({
  //     key: "reservedDate",
  //     data: chooseTime
  //   })
  //   this.setData({
  //     reservedDate: chooseTime
  //   })
  //   console.log('saveLocalChooseTime = ' + chooseTime)
  // },
  // saveLocalContacts(contacts) {
  //   wx.setStorage({
  //     key: "contacts",
  //     data: contacts
  //   })
  //   this.setData({
  //     contacts: contacts
  //   })
  //   console.log('saveLocalContacts = ' + JSON.stringify(contacts))
  // },

})