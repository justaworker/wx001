// pages/detail/detail.js
// 引入配置文件config
const urlList = require('../../utils/config.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    view: {},
    datas: [],
    downLoadUrl: urlList.download + '/',
    downLoadToken: '',
    playVideoID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      view: options.jsonView ? JSON.parse(options.jsonView) : {},
      downLoadToken: `?Authorization=${app.globalData.tokenParam.token}`,
      datas: options.jsonDatas ? JSON.parse(options.jsonDatas) : [],
      userInfo: app.globalData.userInfo
    });
  },

  previewImgByUrl(e) {
    const image = e.target.dataset.imageurl
    wx.previewImage({
      current: image, //当前预览的图片
      urls: [image] //所有要预览的图片
    })
  },

  onPlayVideo(e) {
    const id = e.currentTarget.dataset.id
    if (id === this.data.playVideoID) {
      // empty
    } else {
      const preVideo = wx.createVideoContext(`video-${this.data.playVideoID}`);
      preVideo.pause();
      this.setData({
        playVideoID: id
      });
    }
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

  },
})