var app = getApp();
// pages/order/downline.js
Page({
  data: {
    hasphone: false,
    
  },
 
  onLoad: function (options) {
    var that = this;

    that.setData({
      level: options.level,
    });
  
  },
  cityNameClick: function (event) {
    var cityName = "2222";
    console.log(cityName);

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      cityName: cityName
    })

    wx.navigateBack();
  },
  onShow: function () {
  },
 
});