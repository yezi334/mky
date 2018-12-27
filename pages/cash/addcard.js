var util = require('../../utils/bank.js');
var comm = require('../../utils/comm.js');
var app = getApp();
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    opacity: 0.4, //设置透明
    disabled: true,
  },
  reg: function(e) {
    var that = this;
    var fdata = e.detail.value;
    console.log(fdata);
    that.save(fdata);
  },
  //提交表单信息  
  save: function(e) {
    var that = this;
    //var fdata = e.detail.value;
    console.log(e);
    //判断推荐码
    wx.request({
      data: {
        card: e.card,
        uid: app.d.uid,
        num: e.num,
        subbranch: e.subbranch
      },
      'url': app.d.ceshiUrl + '/Api/Card/addcard',
      success(res) {
        //保存登录状态
        //判断推荐码
        var status = res.data.status;
        var msg = res.data.msg;
        var uid = res.data.uid;
        var cardid=res.data.cardid;
      //  wx.showToast({
        ///  title: msg,
        //  icon: 'none',
        //  duration: 1000
       // })
        var cityName ="22222";
          console.log(cityName);

          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];  //当前页面
          var prevPage = pages[pages.length - 2]; //上一个页面

          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            cardid: cardid
          })

          wx.navigateBack();
       
    //    wx.redirectTo({
        //  url: '../cash/index?cardid=' + cardid,
          // url: '../user/dingdan?currentTab=1&otype=20',
     //   });

      }
    })

  },


  /** 
   * 生命周期函数--监听页面加载 
   *   var productId = options.productId;
    var haslogin = options.haslogin;
    if (haslogin) {
      this.setData({
        haslogin: true,

      })
    }
    this.setData({
      productId: productId,

    })
   */
  onLoad: function(options) {


  },
  //银行卡号
  getUserIdCardNumber: function(e) {
    this.setData({
      bankNumber: e.detail.value
    })
    var temp = util.bankCardAttribution(e.detail.value)
    console.log(temp)
    if (temp == Error) {
      temp.bankName = '';
      temp.cardTypeName = '';
      var msg = '银行卡号错误！';
      comm.toastSuccess(msg);

    } else {
      this.setData({
        cardType: temp.bankName,
      })
    }
  },
  //银行卡号
 
  getsubbranch: function (e) {
  //  console.log('sss');
    var that=this;
     var cardtype=that.data.cardType;
    var cardnum = that.data.bankNumber;
      if(cardtype && cardnum){
        that.setData({
          disabled: false,
          opacity: 1,
         //subbranch: subbranch
        })
      }
   
    }
  
})