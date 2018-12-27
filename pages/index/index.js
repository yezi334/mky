// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    // types: null,
    typeTree: {}, // 数据缓存
    currType: 1,
    // 当前类型
    "types": [],
    typeTree: [],
    indicatorDots: true,
    imgUrls: [],
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    productData: [],
    page: '',
    // tab切换  
    currentTab: 0,
    isStatus: '10', //10待付款，20待发货，30待收货 40、50已完成
    refundpage: 0,
    phone: app.d.phone,
    userid: wx.getStorageSync('userid'),
  },
  onLoad(options) {
    var that = this;
    //二维码参数获取
    //  let recommendId = options.scene.split('&')[1];
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      //&是我们定义的参数链接方式
      let pid = scene.split("=")[0];
      wx.setStorageSync('pid', pid);
      // console.log("scene is ", pid);
    }
    if (options.pid) {
      var pid = options.pid;
      wx.setStorageSync('pid', pid);
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/index',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        var ggtop = res.data.ggtop;
        var typeTree = res.data.prolist;
        var list = res.data.list;
        //that.initProductData(data);
        that.setData({
          imgUrls: ggtop,
          typeTree: typeTree,
          types: list,
          page: 2

        });
        //endInitData
      },
      fail(e) {
        wx.showToast({
          title: '网络异常！',
          icon: 'none',
          duration: 2000
        });
      },
    })

    this.initSystemInfo();
    this.setData({
      currentTab: parseInt(options.currentTab),
      // isStatus: options.otype
    });

  },
  getpid(e) {
    var weid = wx.getStorageSync('weid');
    wx.request({
      url: app.d.ceshiUrl + '/Api/Agency/getpid',
      method: 'post',
      data: {
        pid: e,
        weid: weid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {

        //endInitData
      },
      fail(e) {
        wx.showToast({
          title: '网络异常！',
          icon: 'none',
          duration: 2000
        });
      },
    })
  },

  getOrderStatus() {
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
  },
  //轮播
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },

  tapType(e) {
    var that = this;
    const currType = e.currentTarget.dataset.typeId;

    that.setData({
      currType: currType
    });
    console.log(currType);
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/getcat',
      method: 'post',
      data: {
        cat_id: currType
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        var status = res.data.status;
        if (status == 1) {
          var catList = res.data.catList;
          that.setData({
            typeTree: catList,
            page: 2
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
            icon: 'none'
          });
        }
      },
      error(e) {
        wx.showToast({
          title: '网络异常！',
          icon: 'none',
          duration: 2000,
        });
      }
    });
  },



  tobuy(e) {
    var that = this;
    var productId = e.currentTarget.dataset.pid;
    var uid = wx.getStorageSync('uid');
    if (wx.getStorageSync('phone')) {
      //判断是否登录手机号码

      wx.navigateTo({
        url: '../order/pay?productId=' + productId + '&uid=' + uid
      })
      this.setData({
        phone: wx.getStorageSync('phone'),
        hasphone: true,
      })

    } else {
      wx.showToast({
        icon: 'none',
        title: '请先绑定手机号码！',
        duration: 2000
      });
    }


  },
  //了解详情
  todetail(e) {
    var that = this;
    var productId = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '../product/detail?productId=' + productId
    })
  },
  initSystemInfo() {
    var that = this;

    wx.getSystemInfo({
      success(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  bindChange(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },


  onReachBottom() {　
    var that = this;
    var page = that.data.page;
    var currType = that.data.currType;
    // console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    　　 wx.request({
      url: app.d.ceshiUrl + '/Api/Index/get_more',
      data: {
        page: page,
        catid: currType
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success(res) {
        var prolist = res.data.prolist;
        //that.initProductData(data);
        that.setData({
          page: page + 1,
          typeTree: that.data.typeTree.concat(prolist)
        });
      },
      fail() {
        // fail
      },
      complete() {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  // 分享链接
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var uid = app.d.uid;
    return {
      title: '美科',
      desc: '美科健康!',
      path: '/pages/index/index?pid=' + uid
    }
    wx.showShareMenu({
      withShareTicket: true
    })
  },
})