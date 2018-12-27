var app = getApp();
// pages/order/detail.js
Page({
  data:{
    orderId:0,
    orderData:{},
    proData:[],
  },
  onLoad:function(options){
    this.setData({
      orderId: options.id,
    })
    this.loadProductDetail();
  },
  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/order_details',
      method:'post',
      data: {
        order_id: that.data.orderId,
        //order_id: 1,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var status = res.data.status;
        if(status==1){
          var pro = res.data.pro;
          var ord = res.data.ord;
          var store = res.data.store;
          that.setData({
            orderData: ord,
            proData:pro,
            store:store
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000,
            icon:'none'
          });
        }
      },
      fail: function () {
          // fail
          wx.showToast({
            icon: 'none',
            title: '网络异常！',
            duration: 2000
          });
      }
    });
  },
  remove: function (e) {
    //取消订单

      var that = this;
      var id = e.currentTarget.dataset.id;
      wx.showModal({
        title: '提示',
        content: '你确定要取消订单吗？',
        success: function (res) {
          res.confirm && wx.request({
            url: app.d.ceshiUrl + '/Api/Order/orders_edit',
            method: 'post',
            data: {
              id: id,
              type: 'cancel',
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              //--init data
              var status = res.data.status;
              if (status == 1) {
                wx.showToast({
                  title: '操作成功！',
                  icon:'none',
                  duration: 2000
                });
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../user/dingdan?currentTab=0&otype=10',
                  });
                }, 2500);
                // that.loadOrderList();
              } else {
                wx.showToast({
                  icon: 'none',
                  title: res.data.err,
                  duration: 2000
                });
              }
            },
            fail: function () {
              // fail
              wx.showToast({
                icon: 'none',
                title: '网络异常！',
                duration: 2000
              });
            }
          });

        }
      });
    },
  
  wxpay: function (e) {
    var that = this;

    var order = e.currentTarget.dataset.order;

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
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
                icon: 'none'
              });
              //推荐上级上上级获得奖励


              // setTimeout(function () {
              //  wx.navigateTo({
              //   url: '../user/member',
              // });
              //}, 2500);
            },
            fail: function (res) {
              wx.showToast({
                icon: 'none',
                title: "支付失败!",
                duration: 3000
              });

            }
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: "支付失败!",
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          icon: 'none',
          title: '网络异常！err:wxpay',
          duration: 2000
        });
      }
    })
  },
  //点击拨号
  phoneCall: function (e) {

    wx.makePhoneCall({

      phoneNumber: "13480119619",

      success: function () {

       // console.log("成功拨打电话")

      },

    })

  },
  //确认订单
  confirm(e) {
    var that = this;
    var order = e.currentTarget.dataset.order;
    wx.showModal({
      title: '提示',
      content: '您确认订单已经完成？',
      success: function (res) {
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
          success: function (res) {
            //--init data
            var status = res.data.status;
            if (status == 1) {
            
                wx.showToast({
                  title: '操作成功！',
                  icon: 'none',
                  duration: 2000
                });
                setTimeout(function () {
                  wx.redirecTo({
                    url: '../user/dingdan?currentTab=3&otype=40',
                  });
                }, 2500);
          
            } else {
              wx.showToast({
                title: res.data.err,
                icon: 'none',
                duration: 2000
              });
            }
          },
          fail: function () {
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
})