//获取应用实例
var tcity = require("../../utils/comm.js");
var app = getApp()
Page({
  data: {
    ispay:'',
    user:[],
    comm: [{
      not: 0,
      all: 0,
      alreadyl: 0
    }, ],
  },

  toteam: function() {
    var that = this;
    var user = that.data.user;
    //console.log(user)
    wx.navigateTo({
      url: '../agency/team'
    })
  //  var level = user.level;
   // if (level == 0) {
    //  wx.showToast({
      //  title: "您还不是会员!",
      //  duration: 3000,
     //   icon: 'none',
    //  });

  //  } else {
  
    //}
  }, 
  tohydd () {
    var that = this;
    var user = that.data.user;
    //console.log(user)
      var level = user.level;
    if (level == 0) {
        wx.showToast({
        title: "您还不是会员!",
        duration: 3000,
        icon: 'none',
      });
      } else {
      wx.navigateTo({
        url: '../agency/hydd?fxlevel=3'
        })
    }
  },
  //获推荐吗
  tocode: function() {
    var that = this;
    var phone = that.data.hasphone;
    var user = that.data.user;

    var level = user.level;
    wx.navigateTo({
      url: '../code/intro'
    })
  },
  //判断是否登录
  // 加载
  onLoad: function (options) {
    var that = this;
  
    //更新数据
    wx.request({
      url: app.d.ceshiUrl + '/Api/Agency/getagency',
      method: 'post',
      data: {
        uid: app.d.uid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var user = res.data.user;
        var comm = res.data.comm;
        var pid = res.data.pid;
        //that.initProductData(data);
        that.setData({
          user: user,
          pid: pid,
          comm: comm
        });
        //endInitData
      },
      fail: function(e) {
        wx.showToast({
          title: '网络异常！',
          icon: 'none',
          duration: 2000
        });
      },
    })
    if (options.ispay) {
      this.setData({
        ispay: options.ispay
      });
    }
    that.setData({
      hasphone: false,
      hasdist: false
    })
    if (wx.getStorageSync('phone')) {
      this.setData({
        //userInfo: app.globalData.userInfo,
        hasphone: true
      })
    }
    //判断是否是分销商


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
  //返回页面固定页面
  onUnload() {
    var that = this;
    var ispay = that.data.ispay;
    if (ispay == 1) {
      wx.reLaunch({
        url: '../user/user'
      })
    }
  }
})