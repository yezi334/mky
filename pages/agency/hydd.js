//获取应用实例
var tcity = require("../../utils/citys.js");
var app = getApp()
Page({
  data: {
    achie: {
      month: 222,
      all: '0',
      last: '0',
    }
  },

  lower: function() {
    var self = this
    self.data.pageIndex = self.data.pageIndex + 1,
      wx.request({
        url: '',
        data: {},
        method: 'GET',
        success: function(res) {
          self.setData({

          })
        },
      })
  },
  onLoad: function(options) {
    this.initSystemInfo();
    this.setData({
      currentTab: parseInt(options.currentTab),
      isStatus: options.otype,
      pid: options.uid,
      fxlevel:options.fxlevel
    });
    if (options.fxlevel==3){
      wx.setNavigationBarTitle({
        title: '佣金明细'
      })
    }
    this.loadOrderList();
  },
  getOrderStatus: function() {
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
  },
  loadOrderList: function() {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Agency/getdetail',
      method: 'post',
      data: {
        pid: that.data.pid,
        uid:app.d.uid,
        order_type: that.data.isStatus,
        page: that.data.page,
        fxlevel:that.data.fxlevel
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        //--init data        
        var status = res.data.status;
        var achie = res.data.achie;
        var list = res.data.ord;
        var weixin = res.data.weixin;
        var level = res.data.level;

        switch (that.data.currentTab) {
          case 0:
            that.setData({
              orderList0: list,
              achie: achie,
              weixin: weixin,
              level: level
            });
            break;
          case 1:
            that.setData({
              orderList1: list,
            });
            break;
          case 2:
            that.setData({
              orderList2: list,
            });
            break;
          case 3:
            that.setData({
              orderList3: list,
            });
            break;
          case 4:
            that.setData({
              orderList4: list,
            });
            break;
          case 5:
            that.setData({
              orderList5: list,
            });
            break;
          default:
            that.setData({
              orderList0: list,
              achie: achie,
              weixin: weixin,
              level: level
            });
            break;
        }
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  swichNav: function(e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
      });

      //没有数据就进行加载
      switch (that.data.currentTab) {
        case 0:
          that.loadOrderList();
          break;
        case 1:
         that.loadOrderList();
          break;
        case 2:
          that.loadOrderList();
          break;
        case 3:
           that.loadOrderList();
          break;
        case 4:
          that.data.orderList4.length = 0;
          that.loadReturnOrderList();
          break;
      }
    };
  },


  // returnProduct:function(){
  // },
  initSystemInfo: function() {
    var that = this;

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  onShareAppMessage: function (res) {
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