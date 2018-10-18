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
    uploadPop: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    viewId: null,
    nodes: {},
    view: {},
    edges: [],
    categorys: [{
      type: 0,
      name: '标签'
    }, {
      type: 1,
      name: '企业'
    }, {
      type: 2,
      name: '人才'
    }],
    category: '',
    isShowData: false,
    datas: [],
    images: [],
    tempFilePaths: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      viewId: options.viewId,
      category: this.data.categorys[0].name
    });
    // 加载用户视图
    var that = this;
    wx.request({
      url: urlList.userView + '/' + this.data.viewId,
      method: 'GET',
      // data: {
      //   userId: 1 || that.data.userId
      // },
      header: {
        'Authorization': app.globalData.tokenParam.token
        // 'Authorization': that.data.token
      },
      success: res => {
        if (res && res.data && res.data.code === 0 && res.data.data) {
          const {
            view,
            nodes,
            edges
          } = res.data.data;
          let node;
          const categorys = that.data.categorys;
          let categoryNodes = {};
          for (let node of nodes) {
            let index = categorys.findIndex((item) => {
              return item.type === node.type;
            });
            if (index > -1) {
              if (categoryNodes[categorys[index].name]) {
                categoryNodes[categorys[index].name].push(node);
              } else {
                categoryNodes[categorys[index].name] = [node];
              }
            }
          }
          that.setData({
            view,
            nodes: categoryNodes,
            edges
          });
        }
      }
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   });
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   });
    // }
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
  tapName(e) {
    this.setData({
      category: e.currentTarget.dataset.name
    });
  },
  showData() {
    var that = this;
    this.setData({
      isShowData: true
    });
    wx.request({
      url: urlList.viewData,
      method: 'GET',
      header: {
        'Authorization': app.globalData.tokenParam.token
      },
      data: {
        from: '',
        to: '',
        userId: this.data.view.userId,
        viewId: this.data.view.viewId
      },
      success: res => {
        if (res.data && res.data.code === 0 && res.data.data) {
          this.setData({
            datas: res.data.data
          });
        } else {
          wx.showToast({
            title: 'request fail',
            icon: 'error'
          });
        }
      }
    });
  },
  hideData() {
    this.setData({
      isShowData: false
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

  },
  /**
   * 用户点击上传
   */
  toggleUploadPop: function() {
    this.setData({
      uploadPop: !this.data.uploadPop
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
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  upLoad() {
    wx.uploadFile({
      url: urlList.upload,
      filePath: this.data.images[0],
      name: 'file',
      header: {
        'Authorization': app.globalData.tokenParam.token
      },
      formData: {
        'from': '',
        'to': '',
        'remark': '	备注',
        'type': 0,
        'file': this.data.images[0],
        'userId': this.data.view.userId,
        'viewId': this.data.view.viewId
      },
      success(res) {
        const data = res.data
        //do something
      }
    })
  },
  downLoad(e) {
    const fileId = e.currentTarget.dataset.fileId
    wx.request({
      url: urlList.download +'/' +fileId,
      method: 'GET',
      header: {
        'Authorization': app.globalData.tokenParam.token
      },
      // data: {
      // },
      success: res => {
        if (res.data && res.data.code === 0 && res.data.data) {
        } else {
          wx.showToast({
            title: 'request fail',
            icon: 'error'
          });
        }
      }
    });
  },

})