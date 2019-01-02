// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
var comm = require('../../utils/comm.js');

Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    isStatus: '10',//10待付款，20待发货，30待收货 40、50已完成
    page: 0,
    refundpage: 0,
    orderList0: [],
    orderList1: [],
    orderList2: [],
    slideOffset:64,
   
  },
  onLoad (options) {
    this.initSystemInfo();
    if (options.otype){
      this.setData({
        currentTab: parseInt(options.currentTab),
        isStatus: options.otype
      });
    }
    this.loadOrderList();
  },
  getOrderStatus () {
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
  },
  loadOrderList () {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Voucher/index',
      method: 'post',
      data: {
        uid: app.d.uid,
        order_type: that.data.isStatus,
        page: that.data.page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        //--init data        
        var status = res.data.status;
        var list = res.data.vou;
        switch (that.data.currentTab) {
          case 0:
            that.setData({
              orderList0: list,
            });
            break;
          case 1:
            that.setData({
              orderList1: list,
            });
            break;
          case 2:
            that.setData({
              orderList2: list,
            });
            break;
          default:
            that.setData({
              orderList0: list,
            });
            break;
        }
      },
      fail () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

  swichNav (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var current = e.target.dataset.current;
      var offsetW = e.currentTarget.offsetLeft;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
        slideOffset: offsetW
      });

      //没有数据就进行加载
      switch (that.data.currentTab) {
        case 0:
          !that.data.orderList0.length && that.loadOrderList();
          break;
        case 1:
          !that.data.orderList1.length && that.loadOrderList();
          break;
        case 2:
          !that.data.orderList2.length && that.loadOrderList();
          break;
          that.loadReturnOrderList();
          break;
      }
    };
  },


  //点击加载更多
  getMore (e) {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/get_more',
      method: 'post',
      data: {
        page: page,
        userid: wx.getStorageSync('userid'),
        ptype: that.data.ptype,
        cat_id: that.data.catId,

      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        var status = res.data.status;
        var list = res.data.ord;
        if (list == '') {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }

        //that.initProductData(data);
        that.setData({
          page: page + 1,

        });
        //endInitData
      },
      fail (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  // returnProduct:function(){
  // },
  initSystemInfo () {
    var that = this;
    wx.getSystemInfo({
      success (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  bindChange (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

//跳转到卡券记录页面
  torecord(e) {
var cid= e.currentTarget.dataset.cid;
console.log(cid);
    wx.navigateTo({
     // url: '../cash/addcard',
       url: '../rituall/record?cid='+cid,
    });
  },

})