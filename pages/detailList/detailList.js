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
    jsonEdges: '',
    jsonNodes: '',
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
    tempFilePaths: null,
    downloadImage: null,
    remarkVal: '',
    downLoadUrl: urlList.download + '/',
    downLoadToken: '',
    isVideo: false,
    isPreviewVideo: false,
    palyVideoID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      viewId: options.viewId,
      category: this.data.categorys[0].name,
      downLoadToken: '?Authorization=' + app.globalData.tokenParam.token
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
            edges,
            jsonEdges: JSON.stringify(edges),
            jsonNodes: JSON.stringify(nodes),
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
          res.data.data.forEach((item, index) => {
            item.filePath = item.fileName && item.fileName.split('.') ? item.fileName.split('.')[0] : ''
            item.fileType = item.fileName && item.fileName.split('.') ? item.fileName.split('.')[1] : ''
            item.index = index
            // if (item.fileId) {
            //   that.downLoad({
            //     fileId: item.fileId
            //   }, true);
            // }
          });
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
    if (this.data.playVideoID) {
      const preVideo = wx.createVideoContext(`video-${this.data.playVideoID}`);
      preVideo.stop();
    }
    this.setData({
      isShowData: false,
      playVideoID: '',
      datas: []
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
  showUploadPop: function() {
    this.setData({
      uploadPop: true
    });
  },

  hideUploadPop: function() {
    this.setData({
      uploadPop: false,
      images: [],
      isPreviewVideo: false
    });
  },

  //实时获取查询输入框值
  getRemarkVal: function(e) {
    this.setData({
      remarkVal: e.detail.value
    });
  },

  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        // const images = that.data.images.concat(res.tempFilePaths);
        const images = res.tempFilePaths;
        // 限制最多只能留下3张照片
        that.setData({
          images: images.length <= 3 ? images : images.slice(0, 3),
          isVideo: false
        });
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  chooseVideo: function(e) {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res);
        const images = [res.tempFilePath];
        that.setData({
          images: images,
          isVideo: true
        });
      }
    })
  },
  hideVideo() {
    this.setData({
      isPreviewVideo: false
    });
  },
  removeImage(e) {
    const idx = e.target.dataset.idx;
    this.data.images.splice(idx, 1);
    this.setData({
      images: this.data.images,
      isVideo: false,
      isPreviewVideo: false
    });
  },
  handleVideoPreview(e) {
    const id = e.target.dataset.id
    this.setData({
      isPreviewVideo: true
    });
    setTimeout(() => {
      const videoContext = wx.createVideoContext(id);
      videoContext.requestFullScreen({
        direction: 0
      });
      videoContext.play();
    }, 0);

    // videoContext.requestFullScreen(0);
  },
  playVideo(e) {
    const id = e.target.dataset.id
    if (id === this.data.playVideoID) {
      // empty
    } else {
      const preVideo = wx.createVideoContext(`video-${this.data.playVideoID}`);
      preVideo.stop();
      const video = wx.createVideoContext(`video-${id}`);
      video.play();
      this.setData({
        playVideoID: id
      });
    }
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
    var that = this;
    const uploadTask = wx.uploadFile({
      url: urlList.upload,
      filePath: this.data.images[0],
      name: 'file',
      header: {
        'Authorization': app.globalData.tokenParam.token
      },
      formData: {
        'from': '',
        'to': '',
        'remark': this.data.remarkVal,
        'type': this.data.isVideo ? 1 : 0,
        'file': this.data.images[0],
        'userId': this.data.view.userId,
        'viewId': this.data.view.viewId
      },
      success(res) {
        if (res && res.data) {
          wx.showToast({
            title: '上传成功',
            icon: 'success'
          });
          that.setData({
            remark: '',
            images: [],
            uploadPop: false
          });
        } else {
          wx.showToast({
            title: 'upLoad fail',
            icon: 'error'
          });
        }
        //do something
      }
    });
    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度', res.progress)
      console.log('已经上传的数据长度', res.totalBytesSent)
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })
  },
  downLoad(e) {
    // 接口返回后直接预览和点击预览
    const fileId = e.currentTarget.dataset.fileId
    const idx = e.currentTarget.dataset.idx
    var that = this;
    wx.downloadFile({
      url: urlList.download + '/' + fileId,
      header: {
        'Authorization': app.globalData.tokenParam.token
      },
      success(res) {
        if (res.tempFilePath) {
          item.image = res.tempFilePath;
          that.changeItemInArray(item);
          // that.setData({
          //   downloadImage: res.tempFilePath
          // });
        } else {
          // wx.showToast({
          //   title: 'request fail',
          //   icon: 'error'
          // });
        }
      }
    });
  },
  changeItemInArray: function(item) {

    // 提前准备好对象
    var dataItem = this.data.datas[item.index];
    dataItem.image = item.image;
    // 依旧是根据index获取数组中的对象
    var key = "datas[" + item.index + "]"

    this.setData({
      // 这里使用键值对方式赋值
      key: dataItem
    })
    console.log(this.data.datas);
  },
  errorTip(e) {
    console.log(e);
  }

})