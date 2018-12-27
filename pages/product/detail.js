//index.js  
//获取应用实例  
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({
  firstIndex: -1,
  data:{
    bannerApp:true,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0, //tab切换  
    productId:0,
    itemData:{},
    bannerItem:[],
    buynum:1,
    // 产品图片轮播
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    // 属性选择
    firstIndex: -1,
    //准备数据
    //数据结构：以一组一组来进行设定
     commodityAttr:[],
     attrValueList: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 传值
  onLoad (option) {     
    this.initNavHeight();
  //  this.initSystemInfo();
    var that = this;
    that.setData({
      productId: option.productId,
    });
    wx.getUserInfo({
      success (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        that.setData({
          nickName: nickName,
          avatarUrl: avatarUrl,
        })
        that.adduser(userInfo);
      }
    })
    that.loadProductDetail();

  },

  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
// 商品详情数据获取
  loadProductDetail(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/index',
      method:'post',
      data: {
        pro_id: that.data.productId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var status = res.data.status;
        if(status==1) {   
          var pro = res.data.pro;
          var content=pro.content;
          var services = pro.services;
          //that.initProductData(data);
          WxParse.wxParse('content', 'html', content, that, 3);
          WxParse.wxParse('services', 'html', services, that, 3);
          that.setData({
            itemData:pro,
            bannerItem:pro.img_arr,
           // commodityAttr:res.data.commodityAttr,
           // attrValueList:res.data.attrValueList,
          });
        } else {
          wx.showToast({
            title:res.data.err,
            duration:2000,
          });
        }
      },
      error(e){
        wx.showToast({
          title:'网络异常！',
          duration:2000,
        });
      },
    });
  },
// 属性选择
  onShow () {
    var that = this;
    that.setData({
      productId: that.data.productId,
    });
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success (res) {
              var userInfo = res.userInfo;
              that.adduser(userInfo);
            }
             
          })
        }
      }
    })
    that.loadProductDetail();
  },
  adduser (userInfo) {
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
      success (res) {

      },
      fail () {
        // fail
        wx.showToast({
          title: '网络异常！',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  initProductData(data){
    data["LunBoProductImageUrl"] = [];

    var imgs = data.LunBoProductImage.split(';');
    for(let url of imgs){
      url && data["LunBoProductImageUrl"].push(app.d.hostImg + url);
    }

    data.Price = data.Price/100;
    data.VedioImagePath = app.d.hostVideo + '/' +data.VedioImagePath;
    data.videoPath = app.d.hostVideo + '/' +data.videoPath;
  },


  //立刻购买
  tobuy (option) { 
    var that = this;
    var productId=that.data.productId;

    if (wx.getStorageSync('phone')) {
      //判断是否登录手机号码
  
      wx.navigateTo({
        url: '../order/pay?productId=' + productId 
      })
      this.setData({
        phone: wx.getStorageSync('phone'),
        hasphone: true,
      })

    }else{
      wx.navigateTo({
        url: '../code/index?productId=' + productId
      })
    }
   
    
  },
  //立刻购买
  scroll() {
    var that = this;
   
console.log('q34');


  },
  addShopCart(e){ //添加到购物车
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/add',
      method:'post',
      data: {
        uid: app.d.userId,
        pid: that.data.productId,
        num: that.data.buynum,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // //--init data        
        var data = res.data;
        if(data.status == 1){
          var ptype = e.currentTarget.dataset.type;
          if(ptype == 'buynow'){
            wx.redirectTo({
              url: '../order/pay?cartId='+data.cart_id
            });
            return;
          }else{
            wx.showToast({
                title: '加入购物车成功',
                icon: 'success',
                duration: 2000
            });
          }     
        }else{
          wx.showToast({
                title: data.err,
                duration: 2000
            });
        }
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  //整个页面滚动时候
  onPageScroll (e) {
    console.log("124324");//{scrollTop:99}
  },
  bindChange: function (e) {//滑动切换tab 
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  initNavHeight:function(){////获取系统信息
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
  bannerClosed:function(){
    this.setData({
      bannerApp:false,
    })
  },
  swichNav: function (e) {//点击tab切换
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //分享链接
  onShareAppMessage: function (res) {
    comm.share(res);
  },


});
