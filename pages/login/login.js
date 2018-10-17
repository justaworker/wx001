//index.js
// 引入配置文件config
const urlList = require('../../utils/config.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    nameValue: '',
    pwdValue: ''
  },
  onLoad: function(options) {

  },
  loginTap: function() {
    // 账号密码登录
    if (this.data.nameValue && this.data.pwdValue) {
      wx.request({
        url: urlList.userLogin,
        method: 'POST',
        data: {
          pwd: this.data.pwdValue,
          username: this.data.nameValue
        },
        success: res => {
          if (res.data && res.data.code===0 && res.data.token) {
            app.globalData.tokenParam = {
              token: res.data.token,
              userId: res.data.user.userId
            };
            app.globalData.user = res.data.user;
            const pages = getCurrentPages();
            const perPage = pages[pages.length - 2];
            perPage.setData({
              isGoBack: true
            });
            wx.navigateBack({
              delta: 2
            });
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
        title: '请输入正确的用户名和密码',
        icon: 'none'
      });
    }

  },
  bindNameInput: function(e) {
    this.setData({
      nameValue: e.detail.value
    })
  },
  bindPwdInput: function(e) {
    this.setData({
      pwdValue: e.detail.value
    })
  },

})