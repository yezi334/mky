var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      sex: 1
    },
    {
      txt: '女',
      sex: 2

    },
    {
      txt: '其他',
      sex: 3
    },
    ],
    menu: ''

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      productId: options.productId,
    });
    var infoid = options.id;
    if (infoid) {
      wx.request({
        url: app.d.ceshiUrl + '/Api/User/info',
        method: 'post',
        data: {
          uid: app.d.uid,
          infoid: infoid,
          type: 2,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.status == 1) {
            var user = res.data.user;
            that.setData({
              userinfo: user,

            });
          }
        },
        error: function(e) {
          wx.showToast({
            title: '网络异常！',
            duration: 30000
          });
        },
      })

    }

    //获取省级城市
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/get_province',
      data: {},
      method: 'POST',
      success: function(res) {
        var status = res.data.status;
        var province = res.data.list;
        var sArr = [];
        var sId = [];
        sArr.push('请选择');
        sId.push('0');
        for (var i = 0; i < province.length; i++) {
          sArr.push(province[i].name);
          sId.push(province[i].id);
        }
        that.setData({
          shengArr: sArr,
          shengId: sId
        })
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })





  },
  reg: function(e) {
    var that = this;
    //  var rztype = that.data.rztype;
    console.log(e.detail.value);
    var fdata = e.detail.value;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/user_edit',
      method: 'post',

      data: {
        uid: app.d.uid,
        //uid: app.globalData.userInfo.id,
        name: fdata.name,
        sex: fdata.sex,
        tel: fdata.tel,
        id_num: fdata.id_num,
        area: fdata.area,
        address: fdata.address,
        card: fdata.card,
        blank: fdata.blank,
        sheng: that.data.sheng,
        city: that.data.city,
        quyu: that.data.area,

        code: that.data.code,
        type: 2,
        //  subbranch: fdata.subbranch,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var err = res.data.err;
        var status = res.data.status;
        wx.showToast({
          title: err,
        })
        var productId = that.data.productId;
        if (status == 1) {
          setTimeout(function() {
            wx.redirectTo({
              url: '../order/pay?productId=' + productId,
            });
          }, 2500);
        }
      

      },
      error: function(e) {
        wx.showToast({
          title: '网络异常！',
          duration: 30000
        });
      },
    })
  },

  save: function(e) {
    var that = this;
    //  var rztype = that.data.rztype;
    console.log(e.detail.value);
    var fdata = e.detail.value;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/user_edit',
      method: 'post',

      data: {
        uid: app.d.uid,
        //uid: app.globalData.userInfo.id,
        name: fdata.name,
        sex: fdata.sex,
        tel: fdata.tel,
        id_num: fdata.id_num,
        area: fdata.area,
        address: fdata.address,
        card: fdata.card,
        blank: fdata.blank,
        type: 2,
        //  subbranch: fdata.subbranch,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var err = res.data.err;
        wx.showToast({
          title: err,
        })
        if (res.data.status == 1) {

          //  var addrId = e.currentTarget.dataset.id;
          var productId = that.data.productId;
          wx.navigateTo({
            url: '../order/pay?productId=' + productId,
            // url: '../user/dingdan?currentTab=1&otype=20',
          })

        }
      },
      error: function(e) {
        wx.showToast({
          title: '网络异常！',
          duration: 30000
        });
      },
    })
  },




  bindPickerChangeshengArr: function(e) {
    this.setData({
      shengIndex: e.detail.value,
      shiArr: [],
      shiId: [],
      quArr: [],
      quiId: []
    });
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/get_city',
      data: {
        sheng: e.detail.value
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { // 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        // success
        var status = res.data.status;
        var city = res.data.city_list;

        var hArr = [];
        var hId = [];
        hArr.push('请选择');
        hId.push('0');
        for (var i = 0; i < city.length; i++) {
          hArr.push(city[i].name);
          hId.push(city[i].id);
        }
        that.setData({
          sheng: res.data.sheng,
          shiArr: hArr,
          shiId: hId
        })
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },

    })
  },
  bindPickerChangeshiArr: function(e) {
    this.setData({
      shiIndex: e.detail.value,
      quArr: [],
      quiId: []
    })
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/get_area',
      data: {
        city: e.detail.value,
        sheng: this.data.sheng
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { // 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var status = res.data.status;
        var area = res.data.area_list;

        var qArr = [];
        var qId = [];
        qArr.push('请选择');
        qId.push('0');
        for (var i = 0; i < area.length; i++) {
          qArr.push(area[i].name)
          qId.push(area[i].id)
        }
        that.setData({
          city: res.data.city,
          quArr: qArr,
          quiId: qId
        })
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  bindPickerChangequArr: function(e) {
    console.log(this.data.city)
    this.setData({
      quIndex: e.detail.value
    });
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/get_code',
      data: {
        quyu: e.detail.value,
        city: this.data.city
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { // 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        that.setData({
          area: res.data.area,
          code: res.data.code
        })
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  onShareAppMessage: function() {

  }
})