 //获取应用实例  
 var app = getApp();
 Page({
   data: {
     winWidth: 0,
     winHeight: 0,
     // tab切换  
     currentTab: 0,
     isStatus: 'pay', //10待付款，20待发货，30待收货 40、50已完成
     page: 0,
     refundpage: 0,
     orderList0: [],
     orderList1: [],
     slideOffset:'',
   },
   onLoad(options) {
     this.initSystemInfo();
     if (this.data.currentTab == 4) {
       this.loadReturnOrderList();
     } else {
       this.loadOrderList();
     }
     this.getuser();
   },
   getuser() {
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
         success(res) {
           //--init data        
           var status = res.data.status;
           var user = res.data.user;
           that.setData({
             user: user,
           });
         },
         fail() {
           // fail
           wx.showToast({
             title: '网络异常！',
             duration: 2000
           });
         }
       });
     }
   },
   getOrderStatus() {
     return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
   },
   loadOrderList() {
     var that = this;
     wx.request({
       url: app.d.ceshiUrl + '/Api/Agency/getteam',
       method: 'post',
       data: {
         uid: app.d.uid,
         phone: app.d.phone,
         type: that.data.isStatus,
         page: that.data.page,
       },
       header: {
         'Content-Type': 'application/x-www-form-urlencoded'
       },
       success(res) {
         //--init data        
         var status = res.data.status;
         var list = res.data.ord;
         var count = res.data.count;
         switch (that.data.currentTab) {
           case 0:
             that.setData({
               orderList0: list,
               count0: count,
             });
             break;
           case 1:
             that.setData({
               orderList1: list,
               count1: count,
             });
             break;
           default:
             that.setData({
               orderList0: list,
               count0: count,
             });
             break;
         }
       },
       fail() {
         // fail
         wx.showToast({
           title: '网络异常！',
           duration: 2000
         });
       }
     });
   },
   tohy(e) {
     var that=this;
     var user=that.data.user;
     var uid = e.currentTarget.dataset.uid;
     var fxlevel = e.currentTarget.dataset.fxlevel;
     var level = user.level;
       if (level == 0) {
       wx.showToast({
        title: "您还不是会员!",
        duration: 3000,
        icon:'none'
       });
       }else{
         wx.navigateTo({
           url: '../agency/hydd?uid=' + uid + '&fxlevel=' + fxlevel,
         })
       }
 

   },
   initSystemInfo() {
     var that = this;
     wx.getSystemInfo({
       success(res) {
         var winWidth = res.windowWidth;
         var slideOffset = winWidth * 0.2;
         that.setData({
           winWidth: res.windowWidth,
           winHeight: res.windowHeight,
           slideOffset: slideOffset
         });
       }
     });
   },
   swichNav(e) {
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
       }
     };
   },
   onShareAppMessage(res) {
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