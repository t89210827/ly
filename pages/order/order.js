var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var util = require('../../utils/util.js')
var vm = null

var initdata = function (vm) {
  var ordersList = vm.data.ordersList
  for (var i = 0; i < ordersList.length; i++) {
    ordersList[i].txtStyle = ""
  }
  vm.setData({ ordersList: ordersList })
}

Page({
  data: {
    tabs: ["旅游", "机票", "酒店", "车导", "抢票"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    ordersList: [],   //订单列表
    startX: '',       //触摸起始点水平方向位置  
    delBtnWidth: 180, //删除按钮宽度单位（rpx）  
  },
  onLoad: function () {
    vm = this;
    wx.getSystemInfo({
      success: function (res) {
        vm.setData({
          sliderLeft: (res.windowWidth / vm.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / vm.data.tabs.length * vm.data.activeIndex
        });
      }
    });
    vm.getTourOrder()   //获取全部订单
  },
  //获取全部订单
  getTourOrder: function () {
    console.log("索引 ： " + JSON.stringify(vm.data.activeIndex))
    var param = {
      goods_type: parseInt(vm.data.activeIndex) + 1
    }
    // util.getTourOrder(param, function (res) {
    util.getOrders(param, function (res) {
      console.log("全部订单 ： " + JSON.stringify(res))
      vm.setData({
        ordersList: res.data.ret
      })
    })
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var vm = this
    initdata(vm)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var ordersList = this.data.ordersList;
      console.log("touchM :" + JSON.stringify(e))
      ordersList[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        ordersList: ordersList
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var ordersList = this.data.ordersList;
      console.log("touchE :" + JSON.stringify(e))
      ordersList[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        ordersList: ordersList
      });
    }
  },
  //获取元素自适应后的实际宽度  
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
      // console.log(scale);  
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error  
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //点击删除按钮事件  
  delItem: function (e) {
    console.log("删除" + JSON.stringify(e))
    var vm = this
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      success: function (res) {
        if (res.confirm) {
          var id = e.currentTarget.dataset.orderid
          console.log("id : " + JSON.stringify(id))
          var param = {
            id: id
          }
          util.deleteTourOrder(param, function (res) {
            console.log(JSON.stringify(res))
            vm.getTourOrder()
          })

          //获取列表中要删除项的下标  
          var index = e.target.dataset.index;
          var ordersList = vm.data.ordersList;
          //移除列表中下标为index的项  
          ordersList.splice(index, 1);
          //更新列表的状态  
          vm.setData({
            ordersList: ordersList
          });
        } else {
          initdata(vm)
        }
      }
    })

  },

  // 顶部导航
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    vm.getTourOrder()   //获取全部订单
  },

  onShareAppMessage: function () {
    var user_id = getApp().globalData.userInfo.id
    if (app.globalData.userInfo.organization_id) {

      return {
        title: app.globalData.userInfo.organization_id,
        path: '/pages/index/index?share_user=' + user_id
      }
    }

  }

});