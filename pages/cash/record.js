// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
var common = require("../../utils/comm.js");
Page({
  data: {
    // types: null,
    phone: app.d.phone,
    uid: app.d.uid,
    list: [],
  },
  onLoad: function() {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Cash/getrecord',
      method: 'post',
      data: {
        uid: app.d.uid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var list = res.data.list;
        //that.initProductData(data);
        that.setData({
          list: list
        });
        //endInitData
      },
      fail: function(e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },
  //返回页面固定页面
 
})