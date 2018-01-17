var util = require('../../utils/util.js')
var vm = null
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["礼品兑换", "兑换的礼品","活动规则"],
    goods_info:[],
    activeIndex: 0,//默认导航
    sliderOffset: 0,
    sliderLeft: 0
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
  },

  getgoodlist:function(){
    util.getGoods({},function(res){
      console.log("积分商品" + JSON.stringify(res.data.ret))
      vm.setData({
        goods_info:res.data.ret
      })
    },null)
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});