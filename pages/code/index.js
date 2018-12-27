var app = getApp();
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    name: '', //姓名  
    phone: '', //手机号  
    code: '', //验证码  
    haslogin: false,
    disabled:false,
    able: false,
    iscode: null, //用于存放验证码接口里获取到的code  
    codename: '获取验证码',
    weid: wx.getStorageSync('weid'),
    intro: '',
    // userid: wx.getStorageSync('userid'),

  },
  //获取input输入框的值  
  getNameValue(e) {
    this.setData({
      name: e.detail.value
    })
  },
  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad(options) {
    var that = this;
    var productId = options.productId;
    var haslogin = options.haslogin;
    if (haslogin) {
      that.setData({
        haslogin: true,
      })
    }
    if (productId) {
      that.setData({
        productId: productId,
      })
    }
    var weid = wx.getStorageSync('weid');
    //判断是否存在推荐码
    wx.request({
      data: {
        weid: weid
      },
      'url': app.d.ceshiUrl + '/Api/Code/getintro',
      success(res) {
        var intro = res.data.intro
        if (intro) {
          that.setData({
            intro: intro,
            able: true,
          })
        }
      }
    })
  },
  //获取验证码  
  getVerificationCode() {
    this.getCode();
    // wx.removeStorageSync('userid');

    //var userInfo = this.data.userInfo;

  },
  //跳转注册
  tologin(e) {
    var that = this;
    wx.navigateTo({
      url: '../code/index?haslogin=true'
    })
  },
  getPhoneValue(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue(e) {
    this.setData({
      code: e.detail.value
    })
  },
  getintroValue(e) {
    this.setData({
      intro: e.detail.value
    })
  },
  getCode() {
    var _this = this;
    var phone = this.data.phone;
    var code = this.data.code;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      var _this = this
      _this.setData({
        disabled: true
      });
      wx.request({
        data: {
          phone: phone
        },
        'url': app.d.ceshiUrl + '/Api/Code/index',
        success(res) {
          var data = res.data;
          var status = res.data.status;

          //if (status == 0) {
          // var msg = res.data.msg;
          // wx.showToast({
          //   title: msg,
          //  icon: 'none',
          //  duration: 1000
          // })
          // }else{
          _this.setData({
            iscode: data.code
          })

          console.log(data.code);

          var num = 61;
          var timer = setInterval(function() {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              _this.setData({
                codename: '重新发送',
                disabled: false
              })

            } else {
              _this.setData({
                codename: num + "s"
              })
            }
          }, 1000)

        }

        // }
      })

    }


  },
  //验证验证码

  //var phone = wx.getStorageSync('phone');
  //   var code = wx.getStorageSync('code');

  
  //提交表单信息  
  save(e) {
    var that = this;
    var phone = that.data.phone;
    //var userInfo = this.data.userInfo;
    var productId = that.data.productId;
    var iscode = that.data.iscode;
    //  var code = this.data.code;
    //var userInfo = wx.getStorageSync('userInfo');
    var recomm = that.data.recomm;
    var code = that.data.code;
    var intro = that.data.intro;
    var haslogin = that.data.haslogin;
    var weid = wx.getStorageSync('weid');
    if (code == iscode) {
      wx.request({
        //判断推荐码
        data: {
          haslogin: haslogin,
          phone: phone,
          weid: weid,
          intro: intro,
          //nickName: userInfo.nickName,
          //avatarUrl: userInfo.avatarUrl,
        },
        'url': app.d.ceshiUrl + '/Api/User/adduser',
        success(res) {
          //保存登录状态
          //判断推荐码
          var status = res.data.status;
          var msg = res.data.msg;
          var uid = res.data.uid;
          if (status == 1) {
            // wx.clearStorage();
            // app.globalData.hasphone = true;
            // var userid = res.data.userid;
            wx.removeStorageSync('uid');
            wx.removeStorageSync('phone');
            wx.setStorageSync('uid', uid);
            wx.setStorageSync('phone', phone);
            app.d.uid = uid;
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 1000
            })
            // console.log(uid);
            // app.globalData.uid = uid;
            if (productId) {
              setTimeout(function() {
                wx.redirectTo({
                  url: '../product/detail?productId=' + productId
                })
              }, 2000);
            } else {
              setTimeout(function() {
                wx.switchTab({
                  url: '../user/user',
                })
              }, 2000);
            }
          } else {
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 1000
            })
          }
          //app.globalData.hasphone = true;
          //wx.setStorageSync('hasphone', true);
        }
      })
    } else {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 1000
      })
    }
  },
})