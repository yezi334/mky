// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();

Page({
  data: {
    ispay:'',
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    isStatus: '10', //10待付款，20待发货，30待收货 40、50已完成
    page: 0,
    currentTab: 0,
    refundpage: 0,
    orderList0: [],
    orderList1: [],
    orderList2: [],
    orderList3: [],
    orderList4: [],
    phone: app.d.phone,

  },
  onLoad: function(options) {
    this.initSystemInfo();
    var currentTab = options.currentTab;
    if (currentTab){
      this.setData({
        currentTab: parseInt(options.currentTab),
        isStatus: options.otype
      });
    }
    if (options.ispay) {
      this.setData({
        ispay: options.ispay
      });
    }
    this.loadOrderList();
  },
  getOrderStatus() {
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
  },
  //取消订单
  removeOrder(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定要取消订单吗？',
      success(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/orders_edit',
          method: 'post',
          data: {
            id: orderId,
            type: 'cancel',
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            //--init data
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: '操作成功！',
                icon: 'none',
                duration: 2000
              });
              setTimeout(function () {
                wx.redirectTo({
                  url: '../user/dingdan?currentTab=3&otype=40',
                });
              }, 2500);
              // that.loadOrderList();
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
              icon: 'none',
              duration: 2000
            });
          }
        });

      }
    });
  },
  //确认订单
  confirm(e) {
    var that = this;
    var order = e.currentTarget.dataset.order;
    wx.showModal({
      title: '提示',
      content: '您确认订单已经完成？',
      success(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/orders_edit',
          method: 'post',
          data: {
            id: order,
            type: 'confirm',
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            //--init data
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: '操作成功！',
                icon: 'none',
                duration: 2000
              });
              setTimeout(function () {
                wx.redirectTo({
                  url: '../user/dingdan?currentTab=3&otype=40',
                });
              }, 2500);
              //that.loadOrderList();
            } else {
              wx.showToast({
                title: res.data.err,
                icon: 'none',
                duration: 2000
              });
            }
          },
          fail() {
            // fail
            wx.showToast({
              title: '网络异常！',
              icon: 'none',
              duration: 2000
            });
          }
        });

      }
    });


  },
  //确认收货
  recOrder(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定已收到宝贝吗？',
      success(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/orders_edit',
          method: 'post',
          data: {
            id: orderId,
            type: 'receive',
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            //--init data
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: '操作成功！',
                duration: 2000,
                icon: 'none'
              });
              that.loadOrderList();
            } else {
              wx.showToast({
                title: res.data.err,
                duration: 2000
              });
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

      }
    });
  },

  loadOrderList() {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/index',
      method: 'post',
      data: {
        uid: app.d.uid,
        order_type: that.data.isStatus,
        page: that.data.page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        //--init data        
        var status = res.data.status;
        var list = res.data.ord;
        switch (that.data.currentTab) {
          case 0:
            that.setData({
              orderList0: list,
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
            });
            break;
        }
      },
      fail() {
        // fail
        wx.showToast({
          title: '网络异常！',
          icon: 'none',
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
      var offsetW = e.currentTarget.offsetLeft;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
        slideOffset:offsetW
      });

      console.log(that.data.currentTab);
      //没有数据就进行加载
      switch (that.data.currentTab) {
        case 0:
          !that.data.orderList0.length && that.loadOrderList();
          break;
        case 1:
          !that.data.orderList1.length && that.loadOrderList();
          break;
        case 2:
          !that.data.orderList2.length && that.loadOrderList();
          break;
        case 3:
          !that.data.orderList3.length && that.loadOrderList();
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
  wxpay(e) {
    var that = this;
    var order = e.currentTarget.dataset.order;
    if (!order) {
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
        icon: 'none'
      });
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        openid: app.d.openid,
        order_sn: order,
        uid: app.d.uid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success(res) {
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
                icon: 'none'
              });

              setTimeout(function() {
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=1&otype=20',
                });
              }, 3000);
            },
            fail(res) {
              wx.showToast({
                title: "支付失败!",
                duration: 3000,
                icon: 'none'
              });

            }
          })
        } else {
          wx.showToast({
            title: "支付失败!",
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail() {
        // fail
        wx.showToast({
          title: '网络异常！err:wxpay',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },

  onReachBottom() {
    var that = this;
    var page = that.data.page;
    // console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.request({
      url: app.d.ceshiUrl + '/Api/order/get_more',
      data: {
        page: page,
        uid: app.d.uid,
        order_type: that.data.isStatus,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success (res) {
        var orders = res.data.list;
        //that.initProductData(data);
       // that.setData({
      //    page: page + 1,
        //  list: that.data.list.concat(orders)
       // });
      },
      fail () {
        // fail
      },
      complete () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  // 分享链接
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
  //返回页面固定页面
  onUnload () {
    var that = this;
    var ispay = that.data.ispay;
    if (ispay == 1) {
      wx.reLaunch({
        url: '../user/user'
      })
    }

  }
})