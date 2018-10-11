//index.js
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
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function(options) {
    // 获取缓存的服务IP
    if (wx.getStorageSync('serverIP')) {
      this.setData({
        serverHttp: wx.getStorageSync('serverIP')
      });
    }
    // 优先使用设置的服务IP
    if (options.http) {
      wx.setStorageSync('serverIP', options.http);
      this.setData({
        serverHttp: options.http
      });
    }
    // this.getOne();
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
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
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
        // that.loginRecord(res.userInfo.nickName);
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
  //实时获取纠错输入框值
  getCompanyName: function(e) {
    this.setData({
      companyName: e.detail.value
    });
  },
  getCompanyShortName: function(e) {
    this.setData({
      companyShortName: e.detail.value
    });
  },
  getCompanyAbout: function(e) {
    this.setData({
      companyAbout: e.detail.value
    });
  },
  getKeyWord: function(e) {
    this.setData({
      keyWord: e.detail.value
    });
  },
  // 搜索记录
  searchOne: function() {
    if (this.data.searchVal === '#1234#') {
      // 设置IP
      this.setData({
        isHideDialog: false
      });
    } else if (this.data.searchVal === '#123456#') {
      // 还原默认IP
      wx.setStorageSync('serverIP', '');
      this.setData({
        serverHttp: 'http://58.213.91.74:21381/springbootdemo-0.0.1-SNAPSHOT'
      });
    } else {
      this.queryRecord({
        condition: this.data.searchVal
      }, (res) => {
        this.clearInputs();
        this.hideInputs();
        this.setData({
          searchValue: ''
        });
      });

    }
  },
  // 随机一条记录
  newOne: function() {
    this.clearInputs();
    this.hideInputs();
    this.getOne();
  },
  // 页面初始获取记录
  getOne: function() {
    this.queryRecord();
  },
  //保存记录纠错
  saveOne: function() {
    var oldSeq = this.data.company.seq;
    var req = {
      userID: this.data.userInfo.nickName || '游客',
      company: {
        oldSeq: oldSeq,
        companyName: this.data.companyName,
        companyShortName: this.data.companyShortName,
        keyWord: this.data.keyWord,
        companyAbout: this.data.companyAbout,
      }
    };
    this.saveRecord(req);
  },
  // 清空纠错输入框内容
  clearInputs: function() {
    console.log(this.data.inputVal);
    this.setData({
      inputVal: {},
      companyName: '',
      companyShortName: '',
      keyWord: '',
      companyAbout: ''
    });
  },
  // 展示、隐藏纠错输入框
  toggleInput: function(e) {
    var key = e.currentTarget.dataset.key;
    var arrows = this.data.arrows;
    arrows[key] = !arrows[key];
    this.setData({
      arrows: arrows
    });
  },
  //隐藏所有纠错输入框
  hideInputs: function(e) {
    this.setData({
      arrows: {
        hiddenName: true,
        hiddenShortName: true,
        hiddenAbout: true,
        hiddenKeyWord: true
      }
    });
  },
  //登录接口
  loginRecord: function(userName) {
    wx.request({
      url: this.data.serverHttp + '/user/login',
      data: {
        userName: userName,
        status: '0'
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {

      },
      fail: function(resFail) {
        console.log(JSON.stringify(resFail));
      }
    });
  },
  // 查询标注接口
  queryRecord: function(req, fn) {
    const that = this;
    wx.request({
      url: that.data.serverHttp + '/company/queryOne',
      data: req || {},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res && res.data) {
          that.setData({
            company: res.data
          });
          if (fn) {
            fn(res);
          }
        }
      },
      fail: function(resFail) {
        console.log(JSON.stringify(resFail));
      }
    });
  },
  // 保存标注接口
  saveRecord: function(req) {
    var that = this;
    wx.request({
      url: that.data.serverHttp + '/company/addRecord',
      data: req,
      method: 'POST',
      // header: {
      //   'content-type': 'json' //不能写"application/json"否则报400错误。
      // },
      success: function(res) {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '保存成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          });
        }
      },
      fail: function(resFail) {}
    });
  },
  getUrl: function(e) {
    this.setData({
      dialogUrl: e.detail.value
    });
  },
  cancel: function() {
    this.setData({
      isHideDialog: true
    });
  },
  confirm: function() {
    this.setData({
      isHideDialog: true
    });
    if (this.data.dialogUrl) {
      wx.setStorageSync('serverIP', this.data.dialogUrl);
      this.setData({
        serverHttp: this.data.dialogUrl
      });
      this.getOne();
    }
  }


})