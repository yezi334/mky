// app.js
App({
  d: {
    hostUrl: 'https://cs.meikeyun.net',
    //  hostUrl: 'https://xcx.meikeyun.net/index.php',
    hostImg: 'http://img.ynjmzb.net',
    hostVideo: 'https://zhubaotong-file.oss-cn-beijing.aliyuncs.com',
    appId: "wx61d5961c97331c38",
    appKey: "01d7147276550a0cb6b1333a64ac7fa0",
    ceshiUrl: 'https://xcx.meikeyun.net',
    phone: wx.getStorageSync('phone'),
    uid: wx.getStorageSync('uid'),
    weid: wx.getStorageSync('weid'),
    openid: wx.getStorageSync('openid'),
    winWidth: wx.getStorageSync('winWidth'),
    winHeight: wx.getStorageSync('winHeight'),
  },
  globalData: {
    userInfo: {
      NickName: "",
      avatarUrl: "",
    }
  },
  onLaunch: function(options) {
    var that = this;
    //分享链接uid
    //二维码参数
    //var scene = decodeURIComponent(options.scene);
    //调用API从本地缓存中获取数据
    console.log('app');
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 也就是发送到后端,后端通过接口发送到前端，前端接收用户信息等....
        var code = res.code;
        that.getUserSessionKey(code);
      }
    })
    this.initSystemInfo();
  },
  initSystemInfo: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var winHeight = res.windowHeight;
        var winWidth = res.winWidth;
        wx.setStorageSync('winHeight', winHeight);
        wx.setStorageSync('winWidth', winWidth);
      }
    });
  },
  onShow: function(options) {
    var that = this;

    //分享链接uid
    var inuid = options.uid;
    //二维码参数
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

  },
  getUserSessionKey: function(code) {
    //获取openid
    var that = this;
    //var inuid = wx.getStorageSync('inuid');
    var pid = wx.getStorageSync('pid');
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/getsessionkey',
      method: 'post',
      data: {
        code: code,
        pid: pid,

      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var data = res.data.arr;
        var weid = res.data.weid;
        var openid = res.data.arr.openid;
        // console.log(weid);
        // wx.removeStorageSync('weid');
        wx.setStorageSync('weid', weid);
        wx.setStorageSync('openid', openid);
        //  wx.setStorageSync('uid', uid);
        //  that.globalData.ww= 222;

      },
      fail: function(e) {
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          icon: 'none',
          duration: 2000
        });
      },
    });
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
});