// pages/address/user-address/user-address.js
var tcity = require("../../utils/comm.js");
var app = getApp()
Page({
  data: {
    address: [],
    radioindex: '',
    pro_id:0,
    num:0,
    cartId:0
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      productId: options.productId,
    });
    // 页面初始化 options为页面跳转所带来的参数
    //var uid = wx.getStorageSync('uid');
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/getsore',
      data: {
        uid: app.d.uid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        // success
        var adds = res.data.adds;
        //console.log(adds); 
        that.setData({
          adds: adds,

        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  setDefault: function (e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
 
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/setsore',
      data: {
        uid: app.d.uid,
        addr_id: addrId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        // success
        var status = res.data.status;
        var productId = that.data.productId;
        if (status == 1) {

        wx.redirectTo({
         // url: '../order/pay?productId=' + productId,
          url: '../order/pay?productId=' + productId + '&store=' + addrId,
          });


        } else {
          wx.showToast({
            title: "网络错误！",
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
    
  },
  onShow: function () {
    var that = this;
   var productId = that.data.productId;
    // 页面初始化 options为页面跳转所带来的参数
    //var uid = wx.getStorageSync('uid');
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/getsore',
      data: {
        uid: app.d.uid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        // success
        var adds = res.data.adds;
        //console.log(adds); 
        that.setData({
          adds: adds,

        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  del: function (e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/User/delstore',
          data: {
            //uid: wx.getStorageSync('userid'),
            id_arr:addrId
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {// 设置请求的 header
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          
          success: function (res) {
            // success
            var status = res.data.status;
            if(status==1){
              that.onShow();
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });
      }
    });

  },
  edit: function (e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    var productId = that.data.productId;
    wx.navigateTo({
    //  url: '../info/info?productId=' + productId + '&id=' + addrId,
      url: '../user/info?type=2&id=' + addrId,
    })
  }, 
  //分享链接
  onShareAppMessage: function (res) {
    comm.share(res);
  },
})