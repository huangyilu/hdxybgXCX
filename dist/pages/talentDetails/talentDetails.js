// pages/talentDetails/talentDetails.js

import * as hoteldata from '../../utils/hoteldata-format';
import * as HotelDataService from '../../services/hotel-service';
import contactsInfoStore from '../../services/contacts-info-store';
import { Base64 } from '../../utils/urlsafe-base64'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    talentId: 0,
    talentType: '',
    // introduce: [{
    //   name: 'div',
    //   attrs: {
    //     class: 'div_class',
    //     style: 'font-size: 13px; color: #999999;'
    //   },
    //   children: [{
    //     type: 'text',
    //     text: '&nbsp;&nbsp;创意无限，为每一对有婚礼梦想的新人精雕细琢专属他们的完美品质婚礼！用我对时尚的敏锐触觉，和数百场婚礼策划经验，去为80后的新人诠释幸福，捍卫爱情美好的瞬间！将新人的个性与激情演绎成永恒的浪漫。'
    //   }]
    // }],
    comments: [],
    // 评分
    // score: ['red', 'red', 'red', '', ''],
    tatDetl: null,
    completeTalent: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 综合评分
//    this.getScoreStart(this.data.tatDetl.score);
    // 人才详情
    this.getTalentDetails(options.talentid);
      
//    contactsInfoStore.get('reservedDate').then(result => {
//        // 人才详情
//        this.getTalentDetails(options.talentid, result);
//        
//        this.setData({
//            reserveddate: result
//        })
//    }).catch(error => {
//        console.log('contactsInfoStore .. ' + JSON.stringify(error));
//    });

    this.setData({
      talentId: options.talentid
    })



  },

  // 取数据
  getTalentDetails (talentId, reserveddate) {
    var me = this;

    var reserveddate = wx.getStorageSync('reservedDate');
    this.setData({
        reserveddate: reserveddate
    })
    
    // 基本信息
    HotelDataService.queryTalentDetails(talentId, reserveddate).then((result) => {
      console.log("queryTalentDetails success = " + JSON.stringify(result));
      // console.log("queryTalentDetails success...");
      var details = hoteldata.formatTalentDetails(result);
      var comments = hoteldata.formaHotelCommentList(result.talentCommentList);
      console.log( 'queryTalentDetails' +JSON.stringify(details));
      me.setData({
        tatDetl: details,
        comments: comments,
        talentType: result.occupation,
        completeTalent: result
      })

    }).catch((error) => {
      console.log(error);
    })
  },
  getScoreStart(score) {
    // var score = 3;
    var starts = ['', '', '', '', ''];
    for (var i = 0; i < score; i++) {
      starts[i] = 'red';
    }
    this.setData({
      score: starts
    })
  },

  // 点击事件
  bindMoreCommentTap () {
    // 查看全部评论
    var me= this;
    HotelDataService.queryTalentComment(this.data.talentId).then((result) => {
      // console.log("queryTalentComment success = " + JSON.stringify(result));
      me.setData({
        comments: hoteldata.formatTalentDetailComment(result)
      })
    }).catch((error) => {
      console.log(error);
    })
  },
  bindPhoneCallTap () {
    wx.makePhoneCall({
      phoneNumber: this.data.tatDetl.phonecall,
    })
  },

  // 跳转
  goTalentComparisonPage (e) {
    // wx.navigateTo({
    //   url: 'talentSelectComp?talentId=' + this.data.talentId + '&talentType=' + this.data.tatDetl.occupation,
    // })
//    var reserveddate = wx.getStorageSync('reservedDate');
      
      
    // 获取同类型人才
    HotelDataService.queryTalentSameTypeList(this.data.talentId, this.data.reserveddate).then((result) => {
      console.log("queryTalentSameTypeList success = " + JSON.stringify(result));
      if (result.length > 0) {
        wx.navigateTo({
          url: 'talentSelectComp?talentOne=' + Base64.encodeURI(JSON.stringify(this.data.completeTalent)) + '&talentId=' + this.data.talentId + '&talentList=' + Base64.encodeURI(JSON.stringify(result)),
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '该人才只有一位哦~',
        })
      }

    }).catch((error) => {
      console.log(error);
    })
    
  },
  goMorePicPage (e) {
    wx.navigateTo({
      url: 'talentMorePic?talentid=' + this.data.talentId,
    })
  }, 
  goMoreVideoPage (e) {
    wx.navigateTo({
      url: 'talentMoreVideo?talentid=' + this.data.talentId,
    })
  },
  goCommentPage (e) {
    wx.navigateTo({
      url: 'talentComment?talentid=' + this.data.talentId,
    })
  }


})