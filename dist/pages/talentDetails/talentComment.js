// pages/talentDetails/talentComment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 0,
    uploadImgUrls: [],
    uploadImgNums: 0,
    uploadImgBtnHidden: false,

    // 评分星星
    scoringItems: [
      {
        itemId: 0,
        title: '诚实守信',
        icons: ['', '', '', '', '']
      },
      {
        itemId: 1,
        title: '职业形象',
        icons: ['', '', '', '', '']
      },
      {
        itemId: 2,
        title: '业务技能',
        icons: ['', '', '', '', '']
      },
      {
        itemId: 3,
        title: '服务态度',
        icons: ['', '', '', '', '']
      },
      {
        itemId: 4,
        title: '宾客反响',
        icons: ['', '', '', '', '']
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync()

    this.setData({
      windowWidth: res.windowWidth
    })

  },

  bindUploadImgTap() {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        var uploadImgNums = that.data.uploadImgNums + res.tempFilePaths.length
        that.setData({
          uploadImgUrls: that.data.uploadImgUrls.concat(res.tempFilePaths),
          uploadImgNums: uploadImgNums
        });
        console.log(that.data.uploadImgNums);
        if (uploadImgNums >= 9) {
          that.setData({
            uploadImgBtnHidden: true
          })
        }
      }
    })


  },

  bindStarIconTap (e) {
    
    var itemId = e.currentTarget.dataset.itemid;
    var index = e.currentTarget.id;

    switch (itemId) 
    {
      case 0:
        this.setData({
          'scoringItems[0].icons': this.changeStartIcons(this.data.scoringItems[itemId].icons, index)
        })
      break;
      case 1:
        this.setData({
          'scoringItems[1].icons': this.changeStartIcons(this.data.scoringItems[itemId].icons, index)
        })
        break;
      case 2:
        this.setData({
          'scoringItems[2].icons': this.changeStartIcons(this.data.scoringItems[itemId].icons, index)
        })
        break;
      case 3:
        this.setData({
          'scoringItems[3].icons': this.changeStartIcons(this.data.scoringItems[itemId].icons, index)
        })
        break;
      case 4:
        this.setData({
          'scoringItems[4].icons': this.changeStartIcons(this.data.scoringItems[itemId].icons, index)
        })
        break;
    }
  },
  changeStartIcons(icons, index) {
    var startRed = 'choosed';
    var start = '';
    icons.forEach((arc, i) => {
      if (i >= index) {
        icons[i] = startRed;
      } else {
        icons[i] = start;
      }
    })
    return icons;
  },

  bindTextInput(e) {
    // event.detail = { value: value }
    console.log(e)
    this.setData({
      textLangth: 150 - e.detail.value.length
    })

  }

})