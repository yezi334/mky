var app = getApp();
// pages/order/downline.js
Page({
  data: {
    hasphone: false,
    itemData: {},
    paytype: 'weixin', //0线下1微信
    remark: '',
    disabled: false, //是否可用
    opacity: 0.4, //设置透明
    productData: [],
    total: 0,
    vid: 0,
    openid: wx.getStorageSync('openid'),
  },
  //获取input输入框的值  
  getremarkValue: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  onLoad: function(options) {
    var that = this;
    that.initSystemInfo();
    if (wx.getStorageSync('phone')) {
      this.setData({
        //userInfo: app.globalData.userInfo,
        hasphone: true,
        //height:height
      })
    }

    that.setData({
      productId: options.productId,
      //  height: height
    });
    that.loadProductDetail();
  },
  initSystemInfo: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var winHeight = res.windowHeight;
        var height = (winHeight - 230) / 8;
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          height: height

        });
      }
    });
  },
  onShow: function(options) {
    var that = this;
    // var uid = app.d.userId;
    if (wx.getStorageSync('phone')) {
      that.setData({
        //userInfo: app.globalData.userInfo,
        hasphone: true,
      })
    }
    var uid = app.d.uid;
    var productId = that.data.productId;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/buy_cart',
      method: 'post',
      data: {
        uid: uid,
        pro_id: that.data.productId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {

        //that.initProductData(res.data);
        var pro = res.data.pro;
        var user = res.data.user;
        var needpay = pro.needpay;
        var store = res.data.store;
        that.setData({
          item: pro,
          user: user,
          needpay: needpay,
          store: store
        });

        var productId = that.data.productId;
        //判断是否绑定储存人
        if (!store) {
          wx.showModal({
            content: '你还没完善个人资料请先完善个人资料',
            success(res) {
              if (res.confirm) {
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../info/index?productId=' + productId,
                  });
                }, 2500);
              } else if (res.cancel) {
                wx.showToast({
                  title: "缺少个人资料将无法下单!",
                  duration: 3000,
                  icon: 'none',
                });
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../info/index?productId=' + productId,
                  });
                }, 2500);
              }
            }
          })
       
        }


      },
    });
  },
  loadProductDetail: function() {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/buy_cart',
      method: 'post',
      data: {
        uid: app.d.uid,
        pro_id: that.data.productId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {

        //that.initProductData(res.data);
        var pro = res.data.pro;
        var user = res.data.user;
        var needpay = pro.needpay;
        var store = res.data.store;

        that.setData({
          item: pro,
          user: user,
          needpay: needpay,
          store: store
        });
        var productId = that.data.productId;
        //判断是否绑定储存人

      },
    });
  },
  //积分抵扣 电子发票
  switch1Change: function(e) {
    var on = e.detail.value;
    // console.log('switch2 发生 change 事件，携带值为', e.detail.value);
    // console.log(e);
    var money = e.currentTarget.dataset.money;
    var jifen = e.currentTarget.dataset.jifen;

    if (jifen >= 1000) {
      if (on) {
        var usejf = Math.floor(jifen / 1000);
        var needpay = money - usejf;
        var needpay = Math.floor(needpay * 100) / 100;
        this.setData({
          needpay: needpay,
          jifen: jifen
        });
      } else {
        var needpay = money + Math.floor(jifen / 1000);
        var needpay = Math.floor(needpay * 100) / 100;
        this.setData({
          needpay: needpay,
          jifen: jifen
        });
      }
    } else {
      wx.showToast({
        title: "暂无可用积分!",
        duration: 3000,
        icon: 'none',
      });
    }
  },
  switch2Change: function(e) {
    var that = this;

    if (e.detail.value) {
      that.setData({
        isopen: 1,
      });
    }
  },
  toadd: function(e) {
    var that = this;
    //  var productId = that.data.productId;
    var productId = e.currentTarget.dataset.id;

    //../info/index ? hascard = n
    wx.navigateTo({
      url: '../info/index?productId=' + productId,
    });

    //  wx.navigateTo({
    //    url: '../product/detail?productId=' + productId
    //  })

  },
  //微信支付
  createProductOrderByWX: function(e) {
    this.setData({
      paytype: 'weixin',
      remark: this.data.remark,
      //  productId:e.currentTarget.dataset.productId,
    });

    this.createProductOrder();
  },


  checkbox: function(e) {
    var that = this;

    if (e.detail.value == '') {
      that.setData({
        disabled: true,
        opacity: 0.4
      })
    } else {

      var store = that.data.store
      if (store) {
        that.setData({
          disabled: false,
          opacity: 1
        })
      }

    }
  },
  //确认订单
  createProductOrder: function() {
    //创建订单
    var that = this;
    that.setData({
      disabled: true,
      opacity: 0.4
    })
    var store = that.data.store;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/payment',
      method: 'post',
      data: {
        uid: app.d.uid,
        store_id: store.id,
        productId: that.data.productId,
        type: that.data.paytype,
        remark: that.data.remark, //用户备注
        price: that.data.price, //原价
        needpay: that.data.needpay, //需要支付的金额
        vid: that.data.vid, //优惠券ID
        isopen: that.data.isopen,
        jifen: that.data.jifen,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        that.setData({
          disabled: true,
          opacity: 0.4
        })
        //--init data        
        var order = res.data.order_sn;
        that.wxpay(order);
      },
      fail: function(e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  //调起微信支付
  wxpay: function(order) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        openid: wx.getStorageSync('openid'),
        money: 22,
        order_sn: order,
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
            success: function(res) {
              wx.showToast({
                title: "支付成功!",
                icon: 'none',
                duration: 2000,
              });
              setTimeout(function() {
                wx.redirectTo({
                  url: '../user/dingdan?currentTab=1&otype=20',
              
                });
              }, 2500);
            },
            fail: function(res) {
              wx.showToast({
                title: "支付失败!",
                icon: 'none',
                duration: 3000
              });
              setTimeout(function() {
                wx.redirectTo({
                  url: '../user/dingdan?currentTab=0&otype=10',
                
                });
              }, 2500);
            }
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function() {
        // fail
        wx.showToast({
          icon: 'none',
          title: '网络异常！err:wxpay',
          duration: 2000
        });
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
});