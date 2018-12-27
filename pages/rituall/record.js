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
  onLoad(options) {
    var that = this;
var cid=options.cid
    wx.request({
      url: app.d.ceshiUrl + '/Api/Voucher/getrecord',
      method: 'post',
      data: {
        uid: app.d.uid,
        cid:cid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        var list = res.data.list;
        //that.initProductData(data);
        that.setData({
          list: list
        });
        //endInitData
      },
      fail(e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },
  
})