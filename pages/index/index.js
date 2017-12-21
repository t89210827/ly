var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
var vm = null
var page = 0
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    systemInfo: [],
    swipers: [{ img: "http://twst.isart.me/o_1bves37st1lek1fu41n3k79m1dd9.jpg" },
    { img: "http://twst.isart.me/o_1bverukoa1fmb1ckm7291jfneae9.jpg" },
    { img: "http://twst.isart.me/o_1bvgql7fribe1ufl1ebk8p71r7t9.png" },],
    // hidden: false
  },

  onLoad: function (options) {
    console.log('onLoad')
    vm = this
    //初始化sysInfo
    app.getSystemInfo(function (res) {
      console.log("getSystemInfo:" + JSON.stringify(res));
      vm.setData({
        systemInfo: res
      })
    })
  },

  jumpTravelList:function(){
    wx.navigateTo({
      url: '/pages/travel/travel',
    })
  },

  jumpSpecial:function(){
    wx.navigateTo({
      url: '/pages/specialTravel/specialTravel',
    })
  },

  jumpTravelDetails:function(){
    wx.navigateTo({
      url: '/pages/travelDetails/travelDetails',
    })
  },

  //加载
  onShow: function () {

  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    // console.log("11")
    // vm.setData({
    //   hidden:true
    // })
  },


});


