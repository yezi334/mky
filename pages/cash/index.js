var app = getApp();
var comm = require('../../utils/comm.js');
Page({
  data: {
    opacity: 0.4, //设置透明
    cardid: '',
    cityName: "深圳",
    disabled: true,
    actionSheetHidden: true,
    fuhao: '>'
    // actionSheetItems: ['item1', 'item2', 'item3']

  },
  onLoad: function(options) {
    var that = this;
    // var card = that.data.card;
    // var cardnum = that.data.cardnum;
    that.getuser();
  },
  onShow() {
    var that = this;
    var cardid = that.data.cardid;
    console.log(cardid);
    var actionSheetHidden = that.data.actionSheetHidden
    console.log(actionSheetHidden);
    if (cardid) {
      that.getsetcard(cardid);
      that.setData({
        actionSheetHidden: !that.data.actionSheetHidden
      })
    }
  },
  getsetcard(cardid) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/card/getsetcard',
      method: 'post',
      data: {
        cardid: cardid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        //--init data        
        var msg = res.data.msg;
        var status = res.data.status;
        var cardinfo = res.data.cardinfo;
        that.setData({
          cardnum: cardinfo.number,
          card: cardinfo.card,
        })
      },
      fail() {
        // fail
        var msg = '网络异常！';
        comm.toastSuccess(msg);
      }
    });
  },
  listenerButton() {
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden
    });
    this.getcard();
  },
  //选择银行卡
  check(e) {
    var that = this;
   // console.log('eee');
    var cardid = e.currentTarget.dataset.cardid;
    var card = e.currentTarget.dataset.card;
    var cardnum = e.currentTarget.dataset.cardnum;
    // console.log(cardid);
    //  console.log(cardnum);
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden,
      cardid: cardid,
      card: card,
      cardnum: cardnum
    })
    var money=that.data.money;
    if( cardid && money){
      that.setData({
        disabled: false,
        opacity: 1,
 
      })
    }
  },
  listenerActionSheet() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //获取所有银行卡信息
  getcard() {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: app.d.ceshiUrl + '/Api/Card/getcard',
      data: {
        uid: app.d.uid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { // 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        // success
        var adds = res.data.adds;
        //console.log(adds); 
        that.setData({
          actionSheetItems: adds,
        })
      },
      fail() {
        // fail
        var msg = '网络异常！';
        comm.toastSuccess(msg);
      }
    })
  },
  //全部提现
  allmoney() {
    var that = this
    var money = that.data.allmoney;
    that.setData({
      money: money,
    })
    var cardid = that.data.cardid;
    if (cardid) {
      that.setData({
        disabled: false,
        opacity: 1
      })
    }
  },

  //监听文本输入
  inputNum(e) {
    this.checkInputText(e.detail.value);
  }, //检查输入文本，限制只能为数字并且数字最多带2位小数
  checkInputText(text) {
    var that = this;
    //   var reg = /^[1-9]+([.]{1}[0-9]{1,2})?$/g;
    var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
    if (reg.test(text)) { //正则匹配通过，提取有效文本
      text = text.replace(reg, '$2$3$4');
      // text = text.replace(reg);
      //判断支付金额不能小于50元
      if (text == '0.00') {
        text = '';
        that.setData({
          disabled: true,
          opacity: 0.4
        })
      } else {
        var cardid = that.data.cardid;
        if (cardid) {
          that.setData({
            disabled: false,
            opacity: 1,
            money: text
          })
        }

      }
    } else { //正则匹配不通过，直接清空
      text = '';
      that.setData({
        disabled: true,
        opacity: 0.4
      })
    }
    that.setData({
      text: text
    })
    // return text; //返回符合要求的文本（为数字且最多有带2位小数）
  },

  getuser() {
    var that = this;
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
            allmoney: user.money,
          })
        },
        fail: function() {
          // fail
          var msg = '网络异常！';
          comm.toastSuccess(msg);
        }
      });
    }
  },
 
  save() {
    var that = this;
    var uid = app.d.uid;
    var money = that.data.money;
    var allmoney = that.data.allmoney;
    var limit = money - allmoney
    if (limit>0) {
      var msg = '提现金额不能大于可提现金额';
      comm.toastSuccess(msg);
    } else {
      if (money < 50) {
        var msg = '提现金额不能小于50元';
        comm.toastSuccess(msg);
        return false
        console.log(123)
      } else {
          wx.request({
            url: app.d.ceshiUrl + '/Api/cash/cash',
            method: 'post',
            data: {
              uid: app.d.uid,
              money: that.data.money,
              cardid: that.data.cardid
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              console.log(1243)
              if (res.data.status == 1) {
                //  var addrId = e.currentTarget.dataset.id;
                var msg = res.data.msg;
                comm.toastSuccess(msg);
                wx.redirectTo({
                  url: '../cash/record'
                })
              }else{
                var msg = res.data.msg;
                comm.toastSuccess(msg);
              }
              that.setData({
                disabled: false,
                opacity: 0.4
              })
            },
            fail: function() {
              // fail
              var msg = '网络异常！';
              comm.toastSuccess(msg);

            }
          });

      }
    }
  },
  addcard() {
    wx.navigateTo({
      url: '../cash/addcard',
      // url: '../user/dingdan?currentTab=1&otype=20',
    });
  },
  toedit(e) {
    var carid = 1;
    wx.redirectTo({
      url: '../cash/addcard?id=' + cardid,
      // url: '../user/dingdan?currentTab=1&otype=20',
    });
  },

})