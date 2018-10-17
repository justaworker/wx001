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
    userId: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    views: [],
    isGoBack: false
  },
  onShow: function(options) {
    // 登录页面返回后
    if (this.data.isGoBack){
      if (app.globalData.tokenParam) {
        this.setData({
          token: app.globalData.tokenParam.token,
          userId: app.globalData.tokenParam.userId
        });
        this.reloadView();
      }

      if (app.globalData.user) {
        this.setData({
          userinfo: app.globalData.user,
          hasUserInfo: true
        });
      }
    }
  },
  onLoad: function(options) {
    var that = this;
    // app.setWatcher(this.data, this.watch);
    if (app.globalData.user) {
      this.setData({
        userinfo: app.globalData.user,
        hasUserInfo: true
      });
      if (app.globalData.tokenParam) {
        that.setData({
          token: app.globalData.tokenParam.token,
          userId: app.globalData.tokenParam.userId
        });
        that.reloadView();
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
        app.globalData.user = res;
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        if (app.globalData.tokenParam) {
          that.setData({
            token: app.globalData.tokenParam.token,
            userId: app.globalData.tokenParam.userId
          });
          that.reloadView();
        } else {
          // 获取token
          const {
            iv,
            encryptedData
          } = app.globalData.user;
          that.login(iv, encryptedData);
        }
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.user = res;
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          if (app.globalData.tokenParam) {
            that.setData({
              token: app.globalData.tokenParam.token,
              userId: app.globalData.tokenParam.userId
            });
            that.reloadView();
          } else {
            // 获取token
            const {
              iv,
              encryptedData
            } = app.globalData.user;
            that.login(iv, encryptedData);
          }
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
              // console.log(res)
              if (res.data && res.data.token) {
                app.globalData.tokenParam = {
                  token: res.data.token,
                  userId: res.data.user.userId
                };
                that.setData({
                  token: res.data.token,
                  userId: res.data.user.userId
                });
                that.reloadView();
              } else if (res.data.code === 30001) {
                // 用户未注册/绑定小程序
                wx.request({
                  url: urlList.reglogin,
                  method: 'POST',
                  data: {
                    thirdPartUser: res.data.thirdPartUser
                  },
                  success: res => {
                    if (res.data && res.data.token) {
                      app.globalData.tokenParam = {
                        token: res.data.token,
                        userId: res.data.user.userId
                      };
                      that.setData({
                        token: res.data.token,
                        userId: res.data.user.userId
                      });
                      that.reloadView();
                    } else {
                      wx.showToast({
                        title: 'request fail',
                        icon: 'error'
                      });
                    }
                  }
                });
              } else {
                wx.showToast({
                  title: 'request fail',
                  icon: 'error'
                });
              }
            }
          })
        }
      }
    });
  },
  reloadView() {
    // 加载用户视图列表
    var that = this;
    wx.request({
      url: urlList.userViewList + '/' + (1 || that.data.userId),
      method: 'GET',
      // data: {
      //   userId: 1 || that.data.userId
      // },
      header: {
        // 'Authorization': app.globalData.tokenParam.token
        'Authorization': that.data.token
      },
      success: res => {
        if (res && res.data && res.data.code === 0 && res.data.data) {
          that.setData({
            views: res.data.data
          });
        }
      }
    })
  }
})