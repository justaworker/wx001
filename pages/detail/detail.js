// pages/detail/detail.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    curContent: '基本信息',
    obj: {
      id: '001',
      name: '公司名称或人才名称',
      icon: '../../images/home_s.png',
      updateTime: '2018-10-02'
    },
    categoryList: ['基本信息', '连接节点'],
    images: [],
    content: {
      id: 'null',
      text: '专业方向 工作单位 论文列表'
    },
    mockList: [{
        id: '001',
        icon: '../../images/user_s.png',
        name: '公司001',
        label: '公司标签 公司标签 公司标签'
      },
      {
        id: '002',
        icon: '../../images/user_s.png',
        name: '公司002',
        label: '公司标签 公司标签 公司标签'
      },
      {
        id: '003',
        icon: '../../images/user_s.png',
        name: '公司003',
        label: '公司标签 公司标签 公司标签'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      content: {
        id: options.id
      }
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      });
    }
  },

  getUserInfo: function(e) {
    var that = this;
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      },
      fail: resfail => console.log(resfail)
    });
  },

  tapName: function(e) {
    this.setData({
      curContent: e.currentTarget.dataset.name
    });

  },

  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      // count: 1,
      // sizeType: [],
      // sourceType: [],
      success: function(res) {
        // const tempFilePaths = res.tempFilePaths;
        const images = that.data.images.concat(res.tempFilePaths);
        // 限制最多只能留下3张照片
        // this.data.images = images.length <= 3 ? images : images.slice(0, 3) 
        that.setData({
          images: images.length <= 3 ? images : images.slice(0, 3)
        });
        // wx.uploadFile({
        //   url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   formData: {
        //     'user': 'test'
        //   },
        //   success(res) {
        //     const data = res.data
        //     //do something
        //   }
        // })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx;
    this.data.images.splice(idx, 1);
    this.setData({
      images: this.data.images
      });
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})