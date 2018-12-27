var app = getApp();

var tcity = require("../../utils/citys.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    able: false,
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    actionSheetHidden: true,
    actionSheetItems: [{
        txt: '男',
        sex: '男'
      },
      {
        txt: '女',
        sex: '女',

      },
      {
        txt: '保密',
        sex: '保密',
      },
    ],
    menu: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var type = options.type;
    var id = options.id;
    that.setData({
      type: options.type,
      id: options.id,
      productId: options.productId,
    });

    if (!type) {
      wx.request({
        url: app.d.ceshiUrl + '/Api/User/info',
        method: 'post',
        data: {
          uid: app.d.uid,
          //uid: app.globalData.userInfo.id,
          type: 1,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.status == 1) {
            var user = res.data.user;
            // var sex = user.sex;
            console.log(user);
            if (user) {
              that.setData({
                userinfo: user,
                province: user.province,
                city: user.city,
                county: user.county,
                sex: user.sex
              });
            }
          }
        },
        error: function(e) {
          wx.showToast({
            title: '网络异常！',
            icon: 'none',
            duration: 30000
          });
        },
      })
    } else {

      wx.request({
        url: app.d.ceshiUrl + '/Api/User/info',
        method: 'post',
        data: {
          id: id,
          //uid: app.globalData.userInfo.id,
          type: 2,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.status == 1) {
            var user = res.data.user;
            // var sex = user.sex;
            console.log(user);
            if (user) {
              that.setData({
                userinfo: user,
                province: user.province,
                city: user.city,
                county: user.county,
                sex: user.sex
              });
            }

          }
        },
        error: function(e) {
          wx.showToast({
            title: '网络异常！',
            icon: 'none',
            duration: 30000
          });
        },
      })
    }

    console.log("onLoad");
    var that = this;
    tcity.init(that);
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];
    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    // console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    //  console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
    //console.log('初始化完成');


  },



  bindChange: function(e) {
    console.log(1111);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }
      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0],

      })
      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }
      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0],

      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val,

      })
      return;
    }


  },
  open: function() {
    var that = this;
    //console.log(222);
    //console.log(that.data.condition);
    if (that.data.condition) {
      //console.log(2334);
      that.setData({
        able: false,
        disabled: false,
        opacity: 1
      })
    } else {
      console.log(2334);
      that.setData({
        able: true,
        disabled: true,
        opacity: 0.4
      })
    }
    that.setData({
      condition: !that.data.condition,
      //  disabled: true,
      // opacity: 0.4
    })
  },


  reg: function(e) {
    var that = this;
    var fdata = e.detail.value;
    that.check(fdata);

  },
  check: function(e) {
    //console.log(e);
    var warn = "";
    var that = this;
    var sex = that.data.sex;
    var provinces = that.data.provinces;
    //console.log(provinces);
    var flag = false;
    if (e.name == "") {
      warn = "请填写您的姓名！";
    } else if (e.tel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.tel))) {
      warn = "手机号格式不正确";
    } else if (e.id_num == '') {
      warn = "请输入您的身份证号码";
    } else if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(e.id_num))) {
      warn = "身份证号码错误";
    } else if (provinces == "") {
      warn = "请选择您的区域";
    } else if (e.address == '') {
      warn = "请输入您的详细地址";
    } else if (!sex) {
      warn = "请输入您的性别";
    } else {
      flag = true;
      that.setData({
        disabled: false,
        opacity: 1
      })
      console.log('form发生了submit事件，携带数据为：', e)
      wx.request({
        url: app.d.ceshiUrl + '/Api/User/user_edit',
        method: 'post',

        data: {
          uid: app.d.uid,
          //uid: app.globalData.userInfo.id,
          name: e.name,
          sex: that.data.sex,
          type: that.data.type,
          id: that.data.id,
          tel: e.tel,
          id_num: e.id_num,
          province: that.data.province,
          city: that.data.city,
          county: that.data.county,
          address: e.address,
          //   card: e.card,
          //  blank: e.blank,

          //  subbranch: fdata.subbranch,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          var infoid = res.data.id
          wx.showToast({
            title: res.data.err,
            icon: 'none',
          })
          var productId = that.data.productId;
          var type = that.data.type
          if (type == 2) {
            if (res.data.status == 1) {
              //   wx.navigateBack({ changed: true });//返回上一页
              wx.redirectTo({
                url: '../order/pay?productId=' + productId + '&store=' + infoid,
                // url: '../user/dingdan?currentTab=1&otype=20',
              });
            }
          } else {
            if (res.data.status == 1) {
              //   wx.navigateBack({ changed: true });//返回上一页
              wx.navigateBack({
                info: infoid // 返回上一级页面。
              })
            }
          }

        },
        error: function(e) {
          wx.showToast({
            title: '网络异常！',
            icon: 'none',
            duration: 30000
          });
        },
      })
    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }

  },
  sub: function(e) {
    var that = this;

    wx.request({
      url: app.d.ceshiUrl + '/Api/User/user_edit',
      method: 'post',

      data: {
        uid: app.d.uid,
        //uid: app.globalData.userInfo.id,
        name: e.name,
        sex: e.val,
        tel: e.tel,
        id_num: e.id_num,
        sheng: e.area,
        address: e.address,
        //   card: e.card,
        //  blank: e.blank,

        //  subbranch: fdata.subbranch,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.showToast({
          title: res.data.err,
        })
        if (res.data.status == 1) {
          var user = res.data.user;
          wx.switchTab({
            url: '../user/user',
          })
        }


      },
      error: function(e) {
        wx.showToast({
          title: '网络异常！',
          icon: 'none',
          duration: 30000
        });
      },
    })
  },
  actionSheetTap: function() {
    var that = this;
    console.log('223322');
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function() {
    var that = this;
    console.log('2222');
    console.log(that.data.actionSheetHidden);
    that.setData({
      actionSheetHidden: that.data.actionSheetHidden
    })
  },
  //升级钻石 会员
  bindsex: function(e) {
    var that = this;
    var sex = e.currentTarget.dataset.sex;
    //console.log(that.data.actionSheetHidden);
    that.setData({
      sex: sex,
      actionSheetHidden: that.data.actionSheetHidden
    })

  },

})