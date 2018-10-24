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
    nodeId: null,
    view: {},
    edgeNodes: [],
    categorys: [{
      type: 0,
      name: '基本信息'
    }, {
      type: 1,
      name: '连接节点'
    }],
    isVideo: false,
    category: '',
    isShowData: false,
    datas: [],
    images: [],
    tempFilePaths: null,
    remarkVal: '',
    downLoadUrl: urlList.download + '/',
    downLoadToken: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      viewId: options.viewId,
      nodeId: options.id,
      category: this.data.categorys[0].name,
      downLoadToken: `?Authorization=${app.globalData.tokenParam.token}`
    });
    // 加载用户视图
    var that = this;
    wx.request({
      url: urlList.nodeDetail + `/${options.viewId}/${options.type}/${options.id}`,
      method: 'GET',
      header: {
        'Authorization': app.globalData.tokenParam.token
      },
      success: res => {
        if (res && res.data && res.data.code === 0 && res.data.data) {
          that.setData({
            view: res.data.data
          });
        }
      }
    });
    const edges = JSON.parse(options.jsonEdges);
    const nodes = JSON.parse(options.jsonNodes);
    this.getEdgeNodes(options.id, edges, nodes);
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
  getEdgeNodes: function(nodeId, edges, nodes) {
    // id==from，就用to=nodes.id去查节点
    // id == to，就用from = nodes.id去查节点
    var edgeNodes = [];
    var edgeNode;
    for (let edge of edges) {
      if (nodeId === edge.from) {
        edgeNode = this.getNodes(edge.to, nodes);
        if (edgeNode) {
          edgeNodes.push(edgeNode);
        }
      }

      if (nodeId === edge.to) {
        edgeNode = this.getNodes(edge.from, nodes);
        if (edgeNode) {
          edgeNodes.push(edgeNode);
        }
      }
    }
    this.setData({
      edgeNodes
    });

  },
  getNodes: function(id, nodes) {
    let node;
    for (let item of nodes) {
      if (id === item.id) {
        node = item;
        break;
      }
    }
    return node;
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
        from: this.data.nodeId,
        to: '',
        userId: app.globalData.tokenParam.userId,
        viewId: this.data.viewId
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
  showUploadPop: function () {
    this.setData({
      uploadPop: true
    });
  },

  hideUploadPop: function () {
    this.setData({
      uploadPop: false,
      images: []
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

  removeImage(e) {
    const idx = e.target.dataset.idx;
    this.data.images.splice(idx, 1);
    this.setData({
      images: this.data.images
    });
  },

  handleVideoPreview(e) {
    // const id = e.target.dataset.id
    // const videoContext = wx.createVideoContext(id,e);
    // videoContext.requestFullScreen(0);
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
        'from': this.data.nodeId,
        'to': '',
        'remark': this.data.remarkVal,
        'type': this.data.isVideo ? 1 : 0,
        'file': this.data.images[0],
        'userId': app.globalData.tokenParam.userId,
        'viewId': this.data.viewId
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
          wx.openDocument({
            filePath: res.tempFilePath,
            success: function(res) {
              console.log('打开文档成功')
            }
          })
          // item.image = res.tempFilePath;
          // that.changeItemInArray(item);
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
  }

})