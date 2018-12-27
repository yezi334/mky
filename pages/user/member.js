// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();

Page({
  data: {
    money: 2980,
    level: 1,
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    isStatus: '10', //10vip会员，20白金会员，30钻石会员
    // text:"这是一个页面"
    actionSheetHidden: true,
    actionSheetItems: [{
        bindtap: 'Menu1',
        txt: '钻石会员',
        level: 3
      },
      {
        bindtap: 'Menu2',
        txt: '白金会员',
        level: 2
      },

    ],
    menu: ''
  },
  onLoad(options) {

    this.initSystemInfo();
    if (options.otype) {
      this.setData({
        currentTab: parseInt(options.currentTab),
        isStatus: options.otype
      });

    }
    this.loadOrderList();
    this.getpro();
  },

  getOrderStatus() {
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
  },
  getpro() {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Voucher/getpro',
      method: 'post',
      data: {
        uid: app.d.uid,
        order_type: that.data.isStatus,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        //--init data        
        var status = res.data.status;
        var vou = res.data.vou;
        that.setData({
          vou: vou,
        });
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  //获取会员等级
  loadOrderList() {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/getuser',
      method: 'post',
      data: {
        uid: app.d.uid,
        order_type: that.data.isStatus,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        //--init data        
        var status = res.data.status;
        var user = res.data.user;
        that.setData({
          user: user,
        });
      },
      fail() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  swichNav(e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
      });
    };
  },
  wxpay(e) {
    var level = e.currentTarget.dataset.level;
    if (wx.getStorageSync('phone')) {
      wx.navigateTo({
        url: '../user/pay?level=' + level
      })
    } else {
      wx.showToast({
        title: "请先绑定手机号!",
        icon: 'none',
        duration: 3000
      });
    }
  },
  //调起微信支付
  wxpay2(e) {
    var that = this;
    if (e.currentTarget.dataset.level) {
      var level = e.currentTarget.dataset.level;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/pay',
      data: {
        openid: app.d.openid,
        level: level,
        uid: app.d.uid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function(res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success(res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              //page.onLoad();
              //推荐上级上上级获得奖
              setTimeout(function() {
                wx.navigateTo({
                  url: '../user/member',
                });
              }, 2500);
            },
            fail(res) {
              wx.showToast({
                title: "支付失败!",
                duration: 3000
              });
              setTimeout(function() {
                wx.navigateTo({
                  url: '../user/member',
                });
              }, 2500);
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  // returnProduct:function(){
  // },
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
    var currentTab = e.detail.current;
    var vou = that.data.vou;
    that.setData({
      currentTab: e.detail.current
    });
    switch (that.data.currentTab) {
      case 0:
        that.setData({
          money: vou['0'].money,
          level: 1
        });
        break;
      case 1:
        that.setData({
          money: vou['1'].money,
          level: 2
        });
        break;
      case 2:
        that.setData({
          money: vou['2'].money,
          level: 3
        });
        break;
      default:
        that.setData({
          money: vou['0'].money,
          level: 1
        });
        break;
    }
  },
  //升级会员
  actionSheetTap() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //升级钻石 会员
  bindMenu1(e) {
    var that = this;
    this.setData({
      menu: 1,
      level: 3,
      actionSheetHidden: !this.data.actionSheetHidden
    })

    that.wxpay(e);


  },
  //升级白金会员
  bindMenu2(e) {
    var that = this;
    this.setData({
      menu: 2,
      level: 2,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    that.wxpay(e);
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
  //返回页面固定页面
  onUnload() {
    wx.reLaunch({
      url: '../user/user'
    })
  }
})