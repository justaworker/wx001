//index.js
// 引入配置文件config
const urlList = require('../../utils/config.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    token: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mockList: [{
        id: '001',
        icon: '../../images/home_s.png',
        name: '视图标题001',
        updateTime: '2018-10-02'
      },
      {
        id: '002',
        icon: '../../images/home_s.png',
        name: '视图标题002',
        updateTime: '2018-10-02'
      },
      {
        id: '003',
        icon: '../../images/home_s.png',
        name: '视图标题003',
        updateTime: '2018-10-02'
      },
      {
        id: '004',
        icon: '../../images/home_s.png',
        name: '视图标题004',
        updateTime: '2018-10-02'
      },
      {
        id: '005',
        icon: '../../images/home_s.png',
        name: '视图标题005',
        updateTime: '2018-10-02'
      },
      {
        id: '006',
        icon: '../../images/home_s.png',
        name: '视图标题006',
        updateTime: '2018-10-02'
      },
    ]
  },
  onLoad: function(options) {
    if (app.globalData.user) {
      this.setData({
        userinfo: app.globalData.user,
        hasUserInfo: true
      });
      if (app.globalData.token) {
        that.setData({
          token: app.globalData.token
        });
      } else {
        // 获取token
        const {
          iv,
          encryptedData
        } = app.globalData.user;
        this.login(iv, encryptedData);
      }

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
          app.globalData.user = res.user;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }
  },
  getUserInfo: function(e) {
    var that = this;
    if (e.detail && e.detail.userInfo) {
      app.globalData.user = e.detail;
      that.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      const {
        iv,
        encryptedData
      } = e.detail;
      that.login(iv, encryptedData);
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  //实时获取查询输入框值
  getSearchVal: function(e) {
    this.setData({
      searchVal: e.detail.value
    });
  },
  //登录接口
  login: function(iv, encryptedData) {
    var that = this;
    wx.login({
      success: res => {
        // console.log(res)
        if (res.errMsg == 'login:ok') {
          //调用refreshTokeUrl接口刷新token
          wx.request({
            url: urlList.login,
            method: 'POST',
            data: {
              code: res.code,
              iv,
              encryptedData
            },
            success: res => {
              console.log(res)
              if (res.data.token) {
                that.setData({
                  token: res.data.token
                });
                app.globalData.token = res.data.token;
              } else if (res.data.code === 30001) {
                // 用户未注册/绑定小程序
                wx.request({
                  url: urlList.reglogin,
                  method: 'POST',
                  data: {
                    thirdPartUser: res.data.thirdPartUser
                  },
                  success: res => {
                    app.globalData.token = res.data.token;
                    that.setData({
                      token: res.data.token
                    });
                  }
                });
              }
            }
          })
        }
      }
    });
  },

})