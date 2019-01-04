var app = getApp();
// pages/order/downline.js
Page({
  data: {
    hasphone: false,
    itemData: {},
    paytype: 'weixin', //0线下1微信
    remark: '',
    disabled: true, //是否可用
    opacity: 0.4, //设置透明
    productData: [],
    total: 0,
    vid: 0,
    openid: wx.getStorageSync('openid'),
  },
  //获取input输入框的值  
  getremarkValue(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  onLoad(options) {
    var that = this;
    //判断用户是否绑定个人信息
    //that.getuser();
    that.setData({
      level: options.level,
    });
    that.getpro();
  },
  getuser() {
    var that = this;
    var uid = app.d.uid;
    if (uid) {
      wx.request({
        url: app.d.ceshiUrl + '/Api/User/getuser',
        method: 'post',
        data: {
          uid: app.d.uid,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          //--init data        
          var status = res.data.status;
          var info = res.data.user.info;
          that.setData({
            info: info,
          });
          if (!info) {
            //    console.log("333");
            wx.showModal({
              content: '你还没补充个人资料请先补充个人资料',
              success(res) {
                if (res.confirm) {
                  setTimeout(function() {
                    wx.navigateTo({
                      url: '../user/info',
                    });
                  }, 2500);
                } else if (res.cancel) {
                  wx.showToast({
                    title: "缺少个人资料将无法下单!",
                    duration: 3000,
                    icon: 'none',
                  });
                  setTimeout(function() {
                    wx.navigateTo({
                      url: '../user/info',
                    });
                  }, 2500);
                }
              }
            })

          } else {
            that.setData({
              disabled: false,
              opacity: 1
            })
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
  },
  onShow() {
    var that = this;
    that.getuser();
  },
  //获取产品信息 
  getpro() {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/buy_level',
      method: 'post',
      data: {
        uid: app.d.uid,
        level: that.data.level,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        //that.initProductData(res.data);
        var pro = res.data.pro;
        var user = res.data.user;
        var needpay = pro.needpay;
        // var store = res.data.store;
        that.setData({
          item: pro,
          user: user,
          needpay: needpay,
          //  store: store
        });
        //endInitData
      },
    });
  },
  //积分抵扣 电子发票
  switch1Change(e) {
    var that = this;
    var on = e.detail.value;
    // console.log('switch2 发生 change 事件，携带值为', e.detail.value);
    // 
    var money = e.currentTarget.dataset.money;
    var jifen = e.currentTarget.dataset.jifen;
    console.log(money);
    if (jifen >= 1000) {
      if (on) {
        var usejf = Math.floor(jifen / 1000);
        var needpay = money - usejf;

        var needpay = Math.floor(needpay * 100) / 100;
        console.log(needpay);
        that.setData({
          needpay: needpay,
          jifen: jifen
        });
      } else {
        var needpay = money + Math.floor(jifen / 1000);
        var needpay = Math.floor(needpay * 100) / 100;
        that.setData({
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
  switch2Change(e) {
    var that = this;
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value) {
      that.setData({
        isopen: 1,
      });
    }
  },
  //微信支付
  createProductOrderByWX(e) {
    var formId = e.detail.formId;
    this.setData({
      paytype: 'weixin',
      remark: this.data.remark,
      formId: formId
      //  productId:e.currentTarget.dataset.productId,
    });

    this.createProductOrder();
  },

  //提交订单
  getFormID(e) {
  //  e.preventDefault();
    var formId = e.detail.formId;
    this.setData({
      formId: e.detail.formId,
      paytype: 'weixin',
      remark: this.data.remark,
      formId: formId
    })
    this.createProductOrder();
  },
  //确认订单
  createProductOrder() {

    //创建订单
    var that = this;
    that.setData({
      disabled: true,
      opacity: 0.4
    })

    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/paylevel',
      method: 'post',
      data: {
        uid: app.d.uid,
        level: that.data.level,
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
        //--init data        
        var order = res.data.order_sn;
        var status = res.data.status;
        if (status == 1) {
          that.wxpay(order);
        } else {
          var msg = res.data.msg;
          wx.showToast({
            icon: 'none',
            title: msg,
            duration: 2000
          });
        }

      },
      fail(e) {
        wx.showToast({
          btnDisabled: false,
          icon: 'none',
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },
  //调起微信支付
  wxpay(order_sn) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay2',
      data: {
        openid: wx.getStorageSync('openid'),
        money: 22,
        order_sn: order_sn,
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
            formId: that.data.formId,
            success(res) {
              wx.showToast({
                icon: 'none',
                title: "支付成功!",
                duration: 2000,
              });

              //发送模板消息
              that.sendTemplatePaySuccess(order_sn);
              var level = that.data.level;
              setTimeout(function() {
                wx.switchTab({
                  url: '../user/member?ispay=1',

                })
              }, 2500);
            },
            fail(res) {
              wx.showToast({
                icon: 'none',
                title: "支付失败!",
                duration: 3000
              });
              setTimeout(function() {
                wx.redirectTo({
                  url: '../user/member?ispay=1',
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
      fail() {
        // fail
        wx.showToast({
          icon: 'none',
          title: '网络异常！err:wxpay',
          duration: 2000
        });
      }
    })
  },


  sendTemplatePaySuccess(order_sn) {
    var that = this;
    var formId = that.data.formId;

    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/send',
      data: {
        openid: wx.getStorageSync('openid'),
        formId: formId,
        order_sn: order_sn

      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success(res) {
        if (res.data.status == 1) {

        } else {
          // wx.showToast({
          // icon: 'none',
          // title:  '发送成功',
          // duration: 2000
          // });
        }
      },
      fail() {
        // fail
        wx.showToast({
          icon: 'none',
          title: '网络异常！',
          duration: 2000
        });
      }
    })

  }
});