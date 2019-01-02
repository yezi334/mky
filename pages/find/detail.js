//index.js  
//获取应用实例  
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({
  firstIndex: -1,
  data: {
    winHeight:app.d.winHeight,
  },
  // 传值
  onLoad: function (options) {
    //this.initNavHeight();
    var that = this;
    var winHeight = app.d.winHeight;
    that.setData({
      productId: options.productId,
      winHeight: winHeight
    });
  
    that.loadProductDetail();

  },
  // 商品详情数据获取
  loadProductDetail: function () {
    var that = this;

    
    wx.request({
      url: app.d.ceshiUrl + '/Api/Ggao/details',
      method: 'post',
      data: {
        pro_id: that.data.productId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var status = res.data.status;
        if (status == 1) {
          var pro = res.data.pro;
          var content = pro.content;
          WxParse.wxParse('content', 'html', content, that, 3);
        } else {
          wx.showToast({
            title: "网络错误",
            duration: 2000,
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },
  // 属性选择

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
   //   console.log(res.target)
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
