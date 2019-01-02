var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xy: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var xy = options.xy;
    if (options.xy == 4) {
      wx.setNavigationBarTitle({
        title: '满三返佣'
      })
    } else if(options.xy == 3){
      wx.setNavigationBarTitle({
        title: '会员协议'
      })
    } else if (options.xy == 2) {
      wx.setNavigationBarTitle({
        title: '细胞储存服务协议'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '美科云'
      })
    }
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Web/xbxy',
      method: 'post',
      data: {
        id: 2,
        xy: xy
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        //--init data 
        var status = res.data.status;
        if (status == 1) {
          var content = res.data.content;
          //var content = pro.content;

          //that.initProductData(data);
          WxParse.wxParse('content', 'html', content, that, 3);
        }
      },
      error: function(e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
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