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
    obj: {
      id: '001',
      name: '视图标题001',
      icon: '../../images/search_s.png',
      updateTime: '2018-10-02'
    },
    categoryList: ['企业', '人才', '资金', '政策'],
    mockList: [{
        id: '001',
        icon: '../../images/search_s.png',
        name: '公司001',
        label: '公司标签 公司标签 公司标签'
      },
      {
        id: '002',
        icon: '../../images/search_s.png',
        name: '公司002',
        label: '公司标签 公司标签 公司标签'
      },
      {
        id: '003',
        icon: '../../images/search_s.png',
        name: '公司003',
        label: '公司标签 公司标签 公司标签'
      },
      {
        id: '004',
        icon: '../../images/search_s.png',
        name: '公司004',
        label: '公司标签 公司标签 公司标签'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      text: options.id
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