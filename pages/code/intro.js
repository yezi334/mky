var app = getApp();
var comm = require('../../utils/comm.js');
Page({
  /** 
   * 页面的初始数据 
   */
  data: {},

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function(options) {

    var that = this;
    that.initSystemInfo();
    var uid = app.d.uid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Agency/getintro',
      method: 'post',
      data: {
        uid: uid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var recomm = res.data.recomm;
        // console.log(url);
        that.setData({
          recomm: recomm,

        });
      },

    })

  },

  copy: function() {
    var that = this;
    var comm = that.data.recomm;
    wx.setClipboardData({
      data: comm,
      success: function(res) {
        var msg = '复制成功！';
        comm.toastSuccess(msg);
      }
    })

  },

  initSystemInfo: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  /** 
   * 生命周期函数--监听页面隐藏 
   */
  onHide: function() {

  },

  /** 
   * 生命周期函数--监听页面卸载 
   */
  onUnload: function() {

  },

  /** 
   * 页面相关事件处理函数--监听用户下拉动作 
   */
  onPullDownRefresh: function() {

  },

  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function() {

  },

  /** 
   * 用户点击右上角分享 
   */
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