//index.js
// 引入配置文件config
const urlList = require('../../utils/config.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    serverHttp: 'http://58.213.91.74:21381/springbootdemo-0.0.1-SNAPSHOT', // 默认请求地址
    animation: '',
    // categoryList: ['企业', '人才', '资金', '政策'],
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
    // this.login();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      // this.loginRecord(app.globalData.userInfo.nickName);

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
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });

        }
      });
    }
    if (!this.data.hasUserInfo) {
      // this.getUserInfo();
    }
    //实例化一个动画
    this.animation = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 1000,
      /**
       * http://cubic-bezier.com/#0,0,.58,1  
       *  linear  动画一直较为均匀
       *  ease    从匀速到加速在到匀速
       *  ease-in 缓慢到匀速
       *  ease-in-out 从缓慢到匀速再到缓慢
       * 
       *  http://www.tuicool.com/articles/neqMVr
       *  step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
       *  step-end   保持 0% 的样式直到动画持续时间结束        一闪而过
       */
      timingFunction: 'linear',
      // 延迟多长时间开始
      delay: 100,
      /**
       * 以什么为基点做动画  效果自己演示
       * left,center right是水平方向取值，对应的百分值为left=0%;center=50%;right=100%
       * top center bottom是垂直方向的取值，其中top=0%;center=50%;bottom=100%
       */
      transformOrigin: 'left top 0',
      success: function(res) {
        console.log(res)
      }
    });
  },
  getUserInfo: function(e) {
    var that = this;
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        // console.log(res.userInfo);
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        const { iv, encryptedData} = res;
        that.login(iv, encryptedData);
      },
      fail: resfail => console.log(resfail)
    });
  },
  //实时获取查询输入框值
  getSearchVal: function(e) {
    this.setData({
      searchVal: e.detail.value
    });
  },
  //登录接口
  login: function (iv, encryptedData) {
    wx.login({
      success: res => {
        // console.log(res)
        if (res.errMsg == 'login:ok') {
          //调用refreshTokeUrl接口刷新token
          wx.request({
            url: urlList.loginUrl,
            method: 'POST',
            data: { 
              code: res.code,
              iv,
              encryptedData
               },
            // header: {
            //   'Authorization': ''
            // },
            success: res => {
              console.log(res)
              if (res.data.code===30001){
                wx.request({
                  url: urlList.register,
                  method: 'POST',
                  data: {
                    thirdPartUser: res.thirdPartUser
                  },
                  // header: {
                  //   'Authorization': ''
                  // },
                  success: res => {
                    console.log(res)
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