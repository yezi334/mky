var app = getApp();
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    imgiUrl: 'https://xcx.szdzyba.com/Data/UploadFiles/code/',
    phone:wx.getStorageSync('phone'),//手机号  

  },
 
  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    this.initSystemInfo();
    var that = this;
    var uid = app.d.uid; 
    wx.request({
      url: app.d.ceshiUrl + '/Api/Agency/getimg',
      method: 'post',
      data: {uid:uid},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var url = app.d.ceshiUrl+'/Data/UploadFiles/code/'+uid+'.jpg';
    //  var imgurl=url
      console.log(url);
        that.setData({
         imgurl: url,
        });
      },  
    })

    that.getuser();
  },

  initSystemInfo: function () {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
getuser:function(){
  var that = this;
  // 必须是在用户已经授权的情况下调用
  wx.getUserInfo({
    success: function (res) {
      var userInfo = res.userInfo
      var nickName = userInfo.nickName
      var avatarUrl = userInfo.avatarUrl
      that.setData({
        nickName: nickName,
        avatarUrl: avatarUrl,
      })

    }
  })
},


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