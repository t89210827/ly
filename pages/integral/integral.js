var util = require('../../utils/util.js')
var vm = null
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["礼品兑换", "兑换的礼品", "活动规则"],
    goods_info: [],//积分商品列表
    IntegralHistoryLists:[],//积分兑换历史
    activeIndex: 0,//默认导航
    sliderOffset: 0,
    sliderLeft: 0,
    isChecked: true//点击样式
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
    vm.getIntegralHistoryListsForUser()
  },

  //【游客端】获取积分兑换历史
  getIntegralHistoryListsForUser: function () {
    util.getIntegralHistoryListsForUser({},function(res){
      console.log("积分兑换历史" + JSON.stringify(res))
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
    var integral = e.currentTarget.dataset.integral
    var name = e.currentTarget.dataset.name
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
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  jumpConvert: function () {
    vm.setData({
      isChecked: true
    })
    // console.log("111111111" + JSON.stringify(vm.data.isChecked))
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