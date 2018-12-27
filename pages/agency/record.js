// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
var comm = require('../../utils/comm.js');
Page({
  data: {
    // disabled: true, //是否可用
    // opacity: 0.4, //设置透明
    // types: null,
    currentTab: 0,
    phone: app.d.phone,
    userid: wx.getStorageSync('userid'),
    fxlevel: 0,
    money: 0,
    jifen: [],
    jf: 0,
    list: [],

  },
  onLoad: function(options) {
    var that = this;
    that.getjf();
    that.gethyjf();

    // 获取系统信息 
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  //获取积分记录
  gethyjf: function() {
    var that = this;
    var fxlevel = that.data.fxlevel;

    wx.request({
      url: app.d.ceshiUrl + '/Api/Vipjf/gethyjf',
      method: 'post',
      data: {
        uid: app.d.uid,
        fxlevel: fxlevel
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var list = res.data.list;
        var jifen = res.data.jifen;
        //that.initProductData(data);
        if (res.data.status == 1) {
          that.setData({
            listt: list,
            jifen: jifen,
            pagae: 1
          });
        }

        //if(leg==3){
        ///  that.setData({
        ///
        //   disabled: false,
        //   opacity: 1
        / /
        // })
        // }
        //console.log(leg);
        //endInitData
      },
      fail: function(e) {
        comm.toastSuccess('网络异常！');
      },
    })
  },
  exchange2: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var fxlevel = e.currentTarget.dataset.fxlevel;
    var list = that.data.listt;
    var list1 = list[index];
    console.log(list1)
    var leg = list1.length;
  },
  exchange: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var fxlevel = e.currentTarget.dataset.fxlevel;
    var list = that.data.listt;
    var list1 = list[index];
    console.log(list1)
    var leg = list1.length;
    if (leg == 3) {
      wx.showModal({
        content: '确认兑换？',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.d.ceshiUrl + '/Api/Vipjf/exchange',
              method: 'post',
              data: {
                uid: app.d.uid,
                index: index,
                fxlevel: fxlevel
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function(res) {
                var status = res.data.status;
                if (status == 1) {
                  comm.toastSuccess('兑换成功');
                  wx.redirectTo({
                    url: '../agency/index?fxlevel=3',
                  });
                } else {
                  comm.toastSuccess('网络异常！');
                }
              },
              fail: function(e) {
                comm.toastSuccess('网络异常！');
              },
            })
          } else if (res.cancel) {
            wx.showToast({
              title: "取消兑换!",
              duration: 3000,
              icon: 'none',
            });
          }
        }
      })
    } else {
      comm.toastSuccess('未满三个不能兑换！');
    }


  },
  //获取积分记录
  getjf: function() {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/getjifen',
      method: 'post',
      data: {
        uid: app.d.uid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var jifen = res.data.jifen;
        var list = res.data.list;
        //that.initProductData(data);
        that.setData({
          jf: jifen,
          list: list
        });

        //endInitData
      },
      fail: function(e) {
        comm.toastSuccess('网络异常！');
      },
    })
  },
  // 滑动切换tab 
  bindChange: function(e) {
    var that = this;
    //  console.log(e.detail.current);
    that.setData({
      currentTab: e.detail.current
    });
  },
  // 点击tab切换 
  swichNav2: function(e) {
    var that = this;
    var fxlevel = e.target.dataset.fxlevel;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        fxlevel: fxlevel
      })
    }
    that.gethyjf();

  },
  // 点击tab切换 
  swichNav: function(e) {
    var that = this;
    // console.log(e.target.dataset.current);
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  toxy: function() {
    var that = this;
    wx.navigateTo({
      url: '../order/xbxy?xy=4',
    });


  },

  onReachBottom() {
    var that = this;
    var page = that.data.page;
    var currentTab = that.data.currentTab;

    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.request({
      url: app.d.ceshiUrl + '/Api/Vipjf/get_more',
      data: {
        page: page,
        currentTab: currentTab,
        uid: app.d.uid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res) {
        var more = res.data.morelist;
        //that.initProductData(data);
        //   that.setData({
        //  page: page + 1,
        // listt: that.data.listt.concat(more)
        //});
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  onShareAppMessage: function(res) {
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
  //返回页面固定页面
  onUnload() {
    wx.reLaunch({
      url: '../user/user'
    })
  }

})