
import moment from './npm/moment';
import { flattenDeep } from './npm/lodash-wx'
import * as appConfig from '../app-config';

// 酒店基本信息
export function formatHotelInfo(info) {
  return {
    hotelName: info.name,
    hotelScore: info.reputationLevel ? info.reputationLevel : 0,
    // hotelComments: 10,
    hotelLocation: info.address,
    hotelDescription: info.descreption,
    hotelPhonecall: info.tel,
    hotelBgimg: info.img
  }
}

// 宴会厅
export function formatBallrooms(list) {
  return list.map(item => this.formatBallroomsItem(item))
}
export function formatBallroomsItem(item) {
  return {
    // imgUrl: item.img,
    ballroomId: item.banquetHallId,
    imgUrl: item.img,
    name: item.name,
    level: item.floorNum,
    tabNums: item.minTable + '~' + item.maxTable,
    highLevel: item.floorHeight
  }
}
// 单个宴会厅 详情 浏览图片
export function fomatBallroomInfo (item) {
  return {
    banquetHallId: item.banquetHallId,
    name: item.name,
    level: item.floorNum + 'F',
    tabNums: item.minTable + '~' + item.maxTable + '桌',
    minTable: item.minTable ? item.minTable : 0,
    maxTable: item.maxTable ? item.maxTable : 0,
    tabNumsText: item.minTable ? item.minTable : 0,
    highLevel: item.floorHeight + 'm',
    area: item.area + '㎡',
    imgUrl: item.img,
    imgUrls: this.getBallroomImgs(item.img)
  }
}
export function getBallroomImgs(img){
  var newList = [];
  newList.push(img)
  return newList;
}
// 宴会厅 等 评论列表
export function formaHotelCommentList(list) {
  return list.map(item => this.formatHotelCommentListItem(item))
}
export function formatHotelCommentListItem(item) {
  return {
    avatar: item.headimg ? item.headimg : null,
    name: item.nickName ? item.nickName : null,
    desc: item.commentContent ? item.commentContent : null,
    score: item.compLevel ? this.getScoreStart(item.compLevel) : null
  }
}

// 婚礼人才
export function formatWeddingTalentLeftTab (result) {
  var arr = [];
  result.forEach((res) => {
    arr.push(res.occupation);
  })
  return arr;
}
export function formatWeddingTalent (list, talentname) {
  return list.map(item => this.formatWeddingTalentItem(item, talentname))
}
export function formatWeddingTalentItem (item, talentname) {
  return {
    title: '婚礼人才',
    talentname: talentname,
    talentid: item.weddingTalentId,
    imgUrl: item.headImg,
    name: item.name,
    praise: item.experience + '%好评',
    transaction: item.goodReputation ? '交易:' + item.goodReputation + '次' : '交易:0次',
    price: item.price,
    selected: false,
    freeStatus: item.freeStatus
  }
}

// 人才详情
export function formatTalentDetails(result) {
  return {
    avatar: result.talent.headImg,
    name: result.talent.name,
    occupation: result.talent.occupation,
    experience: result.talent.experience ? '从业' + result.talent.experience + '年' : '从业0年',
    transaction: result.talent.chosenCount ? '交易记录：' + result.talent.chosenCount : '交易记录：0',
    scoreNum: result.talent.comprehensive ? result.talent.comprehensive : '0',
    score: this.getScoreStart(result.talent.comprehensive),
    phonecall: result.talent.tel,
    mypics: result.pictureList.length > 0 ? this.getTheTopN(result.pictureList, 3) : [],
    myvideos: result.mediaList.length > 0 ? this.getTheTopN(result.mediaList, 3) : [],
    introduce: result.talent.introduction,
    freeStatus: result.talent.freeStatus
  }
}
// 人才 详情评论
export function formatTalentDetailComment (list) {
  return list.map(comt => this.formatTalentDetailCommentItem(comt));
}
export function formatTalentDetailCommentItem (item) {
  return {
    avatar: item.img,
    name: item.nickName,
    desc: item.commentContent,
    score: this.getScoreStart(item.compLevel)
  }
}
// 人才 更多图片
export function formatTalentMorePic (list) {
  return list.map(item => this.formatTalentMorePicItem(item));
}
export function formatTalentMorePicItem(item) {
  return {
    time: item.dateString,
    urls: item.pictureList
  }
}
export function formatTalentMorePicBrowse (list) {
  var newList = [];
  list.forEach((datepic,i) => {
      datepic.pictureList.forEach((pic,j) => {
        var dic = {
          id: i * 2 + j + 1,
          url: pic.src,
          time: datepic.dateString
        };
        newList.push(dic);
      })
  })
  return newList;
}
// 人才 更多视频
export function formatTalentMoreVideo(list) {
  return list.map(item => this.formatTalentMoreVideoItem(item));
}
export function formatTalentMoreVideoItem(item) {
  return {
    time: item.dateString,
    urls: item.mediaList
  }
}
export function formatTalentMoreVideoBrowse(list) {
  var newList = [];
  list.forEach((datevideo, i) => {
    datevideo.mediaList.forEach((pic, j) => {
      var dic = {
        id: (i + 1) * (j + 1),
        url: pic.vediosrc,
        time: datevideo.dateString
      };
      newList.push(dic);
    })
  })
  return newList;
}
// 人才对比 选择列表
export function formatTalentSelectComp (list) {
  return list.map(item => this.formatTalentSelectCompItem(item));
}
export function formatTalentSelectCompItem (item) {
  return {
    talentId: item.weddingTalentId,
    name: item.name,
    avatar: item.headImg,
    goodCom: item.goodReputation ? item.goodReputation : 0,
    deal: item.chosenCount ? item.chosenCount : 0,
    price: item.price,
    checked: false
  }
}
// 人才对比 
export function formatTalentComparison (item) {
  return {
    // 基础信息
    title: {
      avatar: item.talent.headImg,
      username: item.talent.name,
      identity: item.talent.occupation,
      experience: item.talent.experience,
      transaction: item.talent.chosenCount,
      score: item.talent.comprehensive
    },
    // 个人介绍
    introduce: {
      text: item.talent.introduction,
      introduceHidden: true
    },
    // 策划风格
    style: {
      styles: item.talent.style ? this.getTalentStyle(item.talent.style) : ''
    },
    // 作品展示
    show: {
      showImgHidden: true,
      showImgs: item.pictureList.length > 0 ? this.getTheTopN(this.getTalentShowing(item.pictureList, item.mediaList), 2)  : [],
      allShowImgs: this.getTalentShowing(item.pictureList, item.mediaList).length > 2 ? this.getTalentShowing(item.pictureList, item.mediaList) : []
    },
    // 评论
    comment: {
      coms: item.talentCommentList.length > 0 ? this.getTalentComment(item.talentCommentList) : ''
    }
  }
}
// 人才对比 策划风格
export function getTalentStyle (style) {
  return style.split(',');
}
// 人才对比 作品展示
export function getTalentShowing (imgs,videos) {
  var newArr = [];
  imgs.forEach(img => {
    var dic = {
      id: img.id,
      imgsrc: img.src,
      time: moment(img.uptime).format('YYYY-MM-DD')
    }
    newArr.push(dic);
  })
  videos.forEach(video => {
    var dic = {
      id: video.id,
      imgsrc: video.imgsrc,
      vediosrc: video.vediosrc,
      time: moment(video.uptime).format('YYYY-MM-DD')
    }
    newArr.push(dic);
  })
  return newArr;
}
// 人才对比 评论
export function getTalentComment (list) {
  return list.map(item => this.getTalentCommentItem(item))
}
export function getTalentCommentItem (item) {
  return {
    username: item.nickName,
    avarUrl: item.headimg,
    text: item.commentContent,
    score: this.getScoreStart(item.compLevel)
  }
}

export const weddinghost = [
  {
    avatar: '../../images/1.jpg',
    name: '黎明',
    praise: '91%',
    transaction: '20',
    price: '3999'
  },
  {
    avatar: '../../images/1.jpg',
    name: '张晓晓',
    praise: '92%',
    transaction: '20',
    price: '3999'
  },
  {
    avatar: '../../images/1.jpg',
    name: '李芬芬',
    praise: '93%',
    transaction: '20',
    price: '3999'
  }
] 

export const weddingplanner = [
  {
    avatar: '../../images/1.jpg',
    name: '张晓晓',
    praise: '94%',
    transaction: '20',
    price: '3999'
  },
  {
    avatar: '../../images/1.jpg',
    name: '李芬芬',
    praise: '95%',
    transaction: '20',
    price: '3999'
  }
]


// 菜品
export function formatWeddingmenu(list) {
  return list.map(item => this.formatWeddingmenuItem(item))
}
export function formatWeddingmenuItem(item) {
  return {
    title: '菜品',
    disId: item.id,
    name: item.name,
    price: item.price,
    imgUrl: item.img,
    selected: false
  }
}
export function formatDishesDetails (item) {
  return {
    name: item.combo.name,
    price: item.combo.price,
    dishesList: item.dishStyleList
  }
}

//宴会庆典
export function formatBanquet(list) {
  return list.map(item => this.formatBanquetItem(item))
}
export function formatBanquetItem(item) {
  return {
    name: item.name,
    price: item.preprice,
    celebrationid: item.id,
    imgUrl: item.image,
    style: item.style
  }
}
// 宴会庆典详情
export function formatCelebrationDetailsCheckbox (item) {
  return [
    {
      name: item.basename,
      checked: true,
      stage: true,
      notStage: false,
      stagePrice: item.stagePrice,
      value: item.preprice,
      stagevalue: 0
    },
    {
      name: item.comboname,
      checked: false,
      stage: false,
      notStage: false,
      stagePrice: item.stagePrice,
      value: item.price,
      stagevalue: 0
    }
  ]
}
export function formatCelebrationDetails(item) {
  return {
    name: item.name,
    showImgs: item.images,
    styles: item.style,
    theme: item.theme,
    basicPrice: item.preprice,
    comboname: item.comboname,
    luxuryPrice: item.price,
    celeDesc: [
      {
        name: '迎宾区',
        array: item.welcome.split(',')
      },
      {
        name: '仪式区',
        array: item.ceremony.split(',')
      },
      {
        name: '婚宴区',
        array: item.weddingplace.split(',')
      },
      {
        name: '舞台灯光',
        array: item.desklight.split(',')
      }
    ]
  }
}
// 庆典详情 更多图片
export function formatCeleDetailMorePic(list) {
  return list.map(item => this.formatCeleDetailMorePicItem(item));
}
export function formatCeleDetailMorePicItem(item) {
  return {
    time: item.dateString,
    urls: item.celePictureList
  }
}
export function formatCeleDetailMorePicBrowse(list) {
  var newList = [];
  list.forEach((datepic, i) => {
    datepic.celePictureList.forEach((pic, j) => {
      var dic = {
        id: i * 2 + j + 1,
        url: pic.src,
        time: datepic.dateString
      };
      newList.push(dic);
    })
  })
  return newList;
}


// 转化时间戳
export function formatTimestampToStr(timestamp) {
  return moment(timestamp * 1000).format('YYYY-MM-DD');
}

// 购物车
export function formatShoppingcar(list) {
  return list.map((item, i) => this.formatShoppingcarItem(item, i))
}
export function formatShoppingcarItem(item, i) {
  return {
    shopppingid: i,
    payid: item.content.typeid,
    imgUrl: this.getLocalShoppingImgurl(item.title, item),
    title: item.content.info.talentname ? item.content.info.talentname : item.title,
    name: item.content.info.name ? item.content.info.name : '',
    floor: item.content.info.floorNum ? item.content.info.floorNum + 'F' : '',
    floorHeight: item.content.info.floorHeight ? '层高:' + item.content.info.floorHeight +'m' : '',
    tableNum: item.content.info.minTable ? item.content.info.minTable + '~' + item.content.info.maxTable + '桌' : '',
    price: item.content.packageStage ? this.getCelebrationPrice(item.content.packageStage) : (item.content.info.price ? item.content.info.price : 0),
    // price: item.content.packageStage ? (item.content.packageStage.stage == true ? (item.content.packageStage.packPrice + item.content.packageStage.stageprice) : (item.content.info.price ? item.content.info.price : 0)) : (item.content.info.price ? item.content.info.price : 0),
    nums: item.content.tableNum ? item.content.tableNum : 1,
    finalTableNum: item.content.tableNum ? item.content.tableNum : null,
    minTable: item.content.info.minTable ? item.content.info.minTable : null,
    maxTable: item.content.info.minTable ? item.content.info.maxTable : null,
    packageStage: item.content.packageStage ? item.content.packageStage : null,
    symbolEdit: 'false',
    checked: true,
  }
    
}

// 计算 宴会庆典 套餐 价钱
export function getCelebrationPrice(packageStage) {
  var price = packageStage.packPrice;
  if (packageStage.stage) {
    price = packageStage.packPrice + packageStage.stageprice
  }
  return price;
}

// 保存本地购物车 格式
export function formatLocalShoppingcar(item, name, tableNum, packageStage) {
  return {
    title: name,
    content: {
      typeid: this.getLocalShoppingId(name, item),
      info: item,
      tableNum: tableNum ? tableNum : null,
      packageStage: packageStage ? packageStage : null
    },
    selected: true
  }
}
export function getLocalShoppingId(name, item) {
  if (name == '宴会厅') {
    return item.banquetHallId;
  } else if (name == '婚礼人才') { 
    return item.talentid;
  } else if (name == '菜品') {
    return item.id;
  } else if (name == '宴会庆典') {
    return item.id;
  }
}
export function getLocalShoppingImgurl(name, item) {
  if (name == '宴会厅') {
    return item.content.info.img;
  } else if (name == '婚礼人才') {
    return item.content.info.imgUrl;
  } else if (name == '菜品') {
    return item.content.info.img;
  } else if (name == '宴会庆典') {
    return item.content.info.image;
  }
}
// 预付定金
export function formatuploadPrepay(list, reservedDate, customerName, tel, totalPrice, prepayPrice, hallTable, desc, comboStyle, isStage, celePrice, openid) {

// hotelId: +appConfig.hotelId,
// customerName: dic.customerName,
// tel: dic.tel,
// customerId: dic.customerId,
// reservedDates: dic.reservedDate,
// hall: dic.hallid,
// combo: dic.comboid,
// celebration: dic.celebrationid,
// talent: dic.talentid,
// desc: dic.desc,
// count: dic.count,
// prePay: dic.prePay,
// hallTable: dic.hallTable,
// comboStyle: dic.comboStyle,
// isStage: dic.isStage
  
  var dic = {
    hotelId: +appConfig.hotelId,
    customerName: customerName ? customerName : '',
    tel: tel ? tel : '',
    customerId: openid ? openid : '',
    openId: openid ? openid : '',
    reservedDates: reservedDate ? reservedDate : '',
    desc: desc ? desc : '',
    count: totalPrice ? totalPrice : '',
    prePay: prepayPrice ? prepayPrice : '',
  }
  var talentids = [];

  console.log(JSON.stringify(dic));

  list.forEach(item => {
    if (item.title == '宴会厅') {
      dic.hall = item.content.typeid;
    } else if (item.title == '婚礼人才') {
      // dic.talentid = dic.talentid + ',' + item.content.typeid;
      talentids.push(item.content.typeid);
      dic.talent = talentids.join(",");
      console.log('talentid ... ' + dic.talent);
    } else if (item.title == '菜品') {
      dic.combo = item.content.typeid;
      dic.hallTable = hallTable;
    } else if (item.title == '宴会庆典') {
      dic.celebration = item.content.typeid;
      dic.celePrice = celePrice.toString();
      dic.comboStyle = comboStyle;
      dic.isStage = isStage;
    }
  })

  return dic
}

// 我的订单 -- 待付款 -- 预约码 款
export function formatMyorderAppointmentList (list) {
  return list.map(item => this.formatMyorderAppointmentItem(item))
}
export function formatMyorderAppointmentItem (item) {
  return {
    time: moment(item.reservedDate).format('YYYY-MM-DD'),
    reservationCode: item.vaidateCode,
    reservationCodeImg: item.twoBarCode,
    appList: this.formatAppList(item.hall, item.combo, item.celebration, item.talent)
  }
}
export function formatAppList (hall, combo, celebration, talent) {

  var newList = [];

  if (hall) {
    hall.forEach(item => {
      newList.push(this.formatAppListItem(item, '宴会厅'));
    })
  }
  if (combo) {
    combo.forEach(item => {
      newList.push(this.formatAppListItem(item, '菜品'));
    })
  }
  if (celebration) {
    celebration.forEach(item => {
      newList.push(this.formatAppListItem(item, '宴会庆典'));
    })
  }
  if (talent) {
    talent.forEach(item => {
      newList.push(this.formatAppListItem(item, '婚礼人才'));
    })
  }

  return newList
}
export function formatAppListItem(item,title) {
  return {
    imgUrl: item.image ? item.image : (item.headImg ? item.headImg : item.img),
    title: item.occupation ? item.occupation : title,
    name: item.name,
    floor: item.floorNum ? item.floorNum : '',
    floorHeight: item.floorHeight ? '层高：' + item.floorHeight : '',
    price: item.price ? item.price : 0,
    nums: item.countTable ? item.countTable : 1
  }
}

// 我的订单 -- 付尾款
export function formatMyorderPayRetainagePrice (list) {
  return list.map(item => this.formatMyorderPayRetainagePriceItem(item));
}
export function formatMyorderPayRetainagePriceItem (item) {
  return {
    time: moment(item.reservedDate).format('YYYY-MM-DD'),
    depositPrice: 10000,
    retainagePrice: 28888,
    checked: true,
    payList: this.formatAppList(item.hall, item.combo, item.celebration, item.talent)
  }
}

// 我的订单 -- 待评价
export function formatMyorderComments (list) {
  return list.map(item => this.formatMyorderCommentsItem(item));
}
export function formatMyorderCommentsItem (item) {
  return {
    payid: item.id,
    time: moment(item.reservedDate).format('YYYY-MM-DD'),
    totalPrice: item.count,
    payList: this.formatAppList(item.hall, item.combo, item.celebration, item.talent)
  }
}


// 我的消息
export function formatMessageList (list) {
  return list.map(item => this.formatMessageListItem(item));
}
export function formatMessageListItem (item) {
  return {
    id: item.messageId,
    title: item.title,
    text: item.commentContent,
    time: moment(item.updateDate).format('YYYY-MM-DD')
  }
}

// 评价
export function formatCommentEditList(hall, combo, celebration, talent) {

  var newList = [];

  if (hall) {
    hall.forEach(item => {
      newList.push(this.formatCommentEditItem(item, '宴会厅', item.banquetHallId));
    })
  }
  if (combo) {
    combo.forEach(item => {
      newList.push(this.formatCommentEditItem(item, '菜品', item.id));
    })
  }
  if (celebration) {
    celebration.forEach(item => {
      newList.push(this.formatCommentEditItem(item, '宴会庆典', item.id));
    })
  }
  if (talent) {
    var dic = {
      title: '婚礼人才',
      talentlist: this.formatCommentTalentlist(talent),
      score: 0,
      commentText: '',
      uploadImgUrls: [],
      uploadImgNums: 0,
      uploadImgBtnHidden: false,
      uploadImgViewHeight: 0
    }
    newList.push(dic)
  }

  return newList
}
export function formatCommentEditItem (item, title, id) {
  return {
    id: id,
    title: item.occupation ? item.occupation : title,
    talentlist: item.occupation ? this.formatCommentTalentlist(item) : null,
    name: item.name,
    icons: ['', '', '', '', ''],
    score: 0,
    commentText: '',
    uploadImgUrls: [],
    uploadImgNums: 0,
    uploadImgBtnHidden: false,
    uploadImgViewHeight: 0
  }
}
export function formatCommentTalentlist (list) {
  return list.map((item,j) => this.formatCommentTalentItem(item,j))
}
export function formatCommentTalentItem (item,j) {
  return {
    id: item.weddingTalentId,
    talentid: j,
    title: item.occupation,
    name: item.name,
    icons: ['', '', '', '', ''],
    score: 0,
  }
}

// 提交评价
export function formatUploadComment(list, orderId, openId, nickName, synthelist, avatarUrl) {

  var comdic = {};
  comdic.orderId = orderId;
  comdic.openId = openId;
  comdic.nickName = nickName;
  comdic.headImg = avatarUrl;
  comdic.syntheCommentLevel = this.formatUploadCommentLevelString(synthelist);
  
  list.forEach(item => {
    var stringdic = {}
    stringdic.commentContent = item.commentText;
    stringdic.compLevel = item.score;
    // item.uploadImgUrls.forEach(img => {
    //   stringdic.img = stringdic.img + ',' + img
    // })

    if (item.title == '宴会厅') {
      stringdic.hallId = item.id;
      comdic.hallComment = JSON.stringify(stringdic);
    }
    if (item.title == '菜品') {
      stringdic.comboId = item.id;
      comdic.comboComment = JSON.stringify(stringdic);
    }
    if (item.title == '宴会庆典') {
      stringdic.celebrationId = item.id;
      comdic.celebrationComment = JSON.stringify(stringdic);
    }
    if (item.title == '婚礼人才') {
      stringdic.compLevel = '';
      stringdic.talentId = '';
      item.talentlist.forEach((talent,i) => {
        if (i == item.talentlist.length-1) {
          stringdic.talentId = stringdic.talentId + talent.id;
          stringdic.compLevel = stringdic.compLevel + talent.score;
        } else {
          stringdic.talentId = talent.id + ',' + stringdic.talentId;
          stringdic.compLevel = talent.score + ',' + stringdic.compLevel;
        }
      })
      comdic.talentComment = JSON.stringify(stringdic);
    } 

  })
  // console.log(JSON.stringify(comdic));
  return comdic;
}
// 计算 综合评分
export function formatUploadCommentLevelString (list) {
  var newScore = 0;
  list.forEach(item => {
    newScore = newScore + item.score;
  })
  return +(newScore / list.length).toFixed(1);
}

// 历史订单
export function formatHistoryorder(list) {
  return list.map(item => this.formatHistoryorderItem(item))
}
export function formatHistoryorderItem (item) {
  return {
    payid: item.id,
    date: moment(item.reservedDate).format('YYYY-MM-DD'),
    totalPrice: item.count,
    prePrice: item.obligation,
    appointmentList: this.formatAppList(item.hall, item.combo, item.celebration, item.talent)
  }
}



// 小方法

// 取前两条
export function getLittleArrs(balls) {

  if (balls.length > 2) {
    var newBalls = [];
    for (var i = 0; i < 2; i++) {
      newBalls.push(balls[i]);
    }
    return newBalls;
  } else {
    return balls;
  }

}

// 取前N条 
export function getTheTopN(list, n) {
  var newList = [];
  for (var i = 0; i < n; i++) {
    newList.push(list[i]);
  }
  return newList;
}

// 评分转换星星
export function getScoreStart(score) {
  var starts = ['', '', '', '', ''];
  for (var i = 0; i < score; i++) {
    starts[i] = 'red';
  }
  return starts;
}
