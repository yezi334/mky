//index.js
//获取应用实例
var tcity = require("../../utils/comm.js");
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    hasphone: false,
    hasdist: false,
    cate_id: 11,
    uid: wx.getStorageSync('uid'),
    phone: wx.getStorageSync('phone'),
    weid: wx.getStorageSync('weid'),
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //跳转绑定手机号页面
  tocode: function() {
    // var userInfo = this.data.userInfo;
    wx.navigateTo({
      url: '../code/index'
    })
  },
  //跳转绑定手机号页面


  todis: function() {
    // wx.navigateTo({
    //  url: '../distributor/distributor'
    //  })
    //if (wx.getStorageSync('phone')) {
    // wx.navigateTo({
    //  url: '../distributor/distributor'
    //})
    //  } else {
    // wx.showToast({
    // title: "请先绑定手机号!",
    //  icon: 'none',
    //  duration: 3000
    // });
    // }

  },


  toinfo: function() {
    var that = this;
    var uid = app.d.uid;
    //if (uid) {
    wx.navigateTo({
      url: '../user/info',
    })
    //} else {
    // wx.showToast({
    //  title: "请先绑定手机号!",
    //  icon: 'none',
    // duration: 3000
    //});
    //}
  },
  tomember: function() {
    var that = this;
    //var uid = app.d.uid;
    //if (uid) {
    wx.navigateTo({
      url: '../user/member',
    })
    // } else {
    // wx.showToast({
    // title: "请先绑定手机号!",
    // duration: 3000,
    //  icon: 'none',
    // });
    //}

  },

  onLoad: function(options) {
    var that = this;
    that.initSystemInfo();
    var phone = wx.getStorageSync('phone');
    if (phone) {
      that.setData({
        hasphone: true,
      })
    } else {
      that.setData({
        hasphone: false,
      })
    }
    that.getset();
    //跳转登陆按钮去除
    //var hasphone2= 2;
    //var phone = app.globalData.phone;
    //var uid = (wx.getStorageSync('userid'));
    //  wx.removeStorageSync('userid');
    // wx.removeStorageSync('phone');
    //var getAppInfo = app.globalData.openid;
    // console.log(getAppInfo)
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    // 查看是否授权
    wx.getUserInfo({
      success: function(res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl;
        console.log(avatarUrl);
        that.setData({
          nickName: nickName,
          avatarUrl: avatarUrl,
        })
        that.adduser(userInfo);
      }
    })
    that.getuser();


  },
  onShow: function () {
    var that = this
    var phone = wx.getStorageSync('phone');
    //  console.log(phone);
    if (phone) {
      that.setData({
        hasphone: true,
      })
    } else {
      that.setData({
        hasphone: false,
      })
    }

    that.getset();
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              var userInfo = res.userInfo;
              //  wx.setStorageSync('userInfo');
              var userInfo = res.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl;
              that.setData({
                nickName: nickName,
                avatarUrl: avatarUrl,
              })
              console.log("uuu");
              //将头像信息写入数据库
              that.adduser(userInfo);
            }
          })
        }
      }
    })
    that.getuser();

  },
  bindGetUserInfo(e) {
    //console.log(e.detail.userInfo)
  },
  adduser: function(userInfo) {
    var nickName = userInfo.nickName;
    var avatarUrl = userInfo.avatarUrl;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Login/adduser',
      method: 'post',
      data: {
        weid: app.d.weid,
        nickName: nickName,
        avatarUrl: avatarUrl
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {

      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  getuser: function() {
    var that = this;
   // console.log("yy");
    var uid = app.d.uid;
    if (uid) {
      wx.request({
        url: app.d.ceshiUrl + '/Api/User/getuser',
        method: 'post',
        data: {
          uid: app.d.uid,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          //--init data        
          var status = res.data.status;
          var user = res.data.user;
          that.setData({
            user: user,
          });

        },
        fail: function() {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        }
      });


    }


  },
  getset: function() {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Web/web',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        //--init data        
        var status = res.data.status;
        var open = res.data.open;
        that.setData({
          open: open,
        });
      },
    });
  },
  toagency: function() {
    var that = this;
    var uid = app.d.uid;
    
    if (!uid) {
      wx.showToast({
     title: "请先绑定手机号!",
     duration: 3000,
        icon: 'none'
     });
    //} else {
      //var user = that.data.user;
      //console.log(user)
      // var level = user.level;
      // if (level == 0) {
      // wx.showToast({
      //  title: "您还不是会员!",
      //   duration: 3000
      // });

      } else {
      wx.navigateTo({
        url: '../agency/index',
     })
     }
    
  },

  remove: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '你确定退出吗',
      success: function(res) {
        res.confirm &&
         wx.removeStorageSync('weid');
        wx.removeStorageSync('uid');
        wx.removeStorageSync('phone');
        //wx.removeStorageSync('weid');
        that.setData({
          hasphone: false,
        })
        that.onShow();
        //  var  app.globalData.hasphone = false;
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
  //分享链接
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