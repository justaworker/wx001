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
          app.globalData.token = res.data.token;
          wx.navigateBack({
            delta: 2
          });
        }
      });
    } else {
      wx.showToast({
        title: '请输入正确的用户名和密码',
        icon: 'none'
      })
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