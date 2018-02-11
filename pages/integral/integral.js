var util = require('../../utils/util.js')
var vm = null
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["礼品兑换", "兑换的礼品", "活动规则"],
    goods_info: [],//积分商品列表
    IntegralHistoryLists: [],//积分兑换历史
    activeIndex: 0,//默认导航
    sliderOffset: 0,
    sliderLeft: 0,
    userType:''
  },
  onLoad: function () {
    var that = this;
    vm = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    vm.getgoodlist()
    vm.getIntegralHistory()
  },
  //根据用户类型调用兑换的礼品接口
  getIntegralHistory: function () {
    //获取用户类型
    var userType = getApp().globalData.userInfo.type
    vm.setData({
      userType: userType
    })
    if (userType == 1) {
      vm.getIntegralHistoryListsForOrganization()
    } else {
      vm.getIntegralHistoryListsForUser()
    }
  },
  //修改登陆状态
  updateStatus: function (e) {
    console.log("修改登陆状态")
    util.showModal("确定", "确定修改兑换状态吗？（确定后不可更改）", function (res){
      var historyid = e.currentTarget.dataset.historyid
      var param = {
        id: historyid
      }
      util.updateIntegralStatusById(param, function (res) {
        console.log("旅行社修改登陆状态 ： " + JSON.stringify(res))
        vm.getIntegralHistory()
      })
    })
  },

  //【旅行社端】获取积分兑换历史
  getIntegralHistoryListsForOrganization: function () {
    util.getIntegralHistoryListsForOrganization({}, function (res) {
      console.log("旅行社端积分兑换历史" + JSON.stringify(res))
      var IntegralHistoryLists = res.data.ret
      vm.setData({
        IntegralHistoryLists: IntegralHistoryLists
      })
    })
    console.log("22222" + JSON.stringify(vm.data.IntegralHistoryLists))
  },

  //【游客端】获取积分兑换历史
  getIntegralHistoryListsForUser: function () {
    util.getIntegralHistoryListsForUser({}, function (res) {
      console.log("游客端积分兑换历史" + JSON.stringify(res))
      var IntegralHistoryLists = res.data.ret
      vm.setData({
        IntegralHistoryLists: IntegralHistoryLists
      })
    })
    console.log("22222" + JSON.stringify(vm.data.IntegralHistoryLists))
  },
  //兑换积分商品
  addIntegralHistory: function (e) {
    // console.log("积分id: " + JSON.stringify(e.currentTarget.dataset.integral))
    var globalDataIntegral = getApp().globalData.userInfo.integral
    var integral = e.currentTarget.dataset.integral
    var name = e.currentTarget.dataset.name
    var price = e.currentTarget.dataset.price
    console.log("积分id: " + JSON.stringify(globalDataIntegral + '和' + price))
    if (globalDataIntegral <= price) {
      wx.showToast({
        title: '您的积分不足,快去分享赚积分吧！！！',
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.showModal({
      title: '兑换',
      content: '确定兑换' + name + '?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var param = {
            goods_id: integral
          }
          util.addIntegralHistory(param, function (res) {
            console.log("兑换商品 " + JSON.stringify(res))
            var integral = res.data.ret.user.integral
            getApp().globalData.userInfo.integral
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //获取积分商品列表
  getgoodlist: function () {
    util.getIntegralLists({}, function (res) {
      vm.setData({
        goods_info: res.data.ret
      })
      console.log("积分商品列表" + JSON.stringify(vm.data.goods_info))
    })
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});