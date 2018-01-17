// pages/mine/mine.js
var app = getApp()
var vm = null
var util = require('../../utils/util.js')
Page({
  data: {
    userInfo: [],
    userType: true,
    bg: { img: "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.d029e2f8f631332fc66f31747082f4c1.jpg?imageView2/2/w/750/h/500/interlace/1" }
  },
  onLoad: function (options) {
    vm = this
    var userInfo = app.globalData.userInfo
    if (userInfo.type == 1) {
      vm.setData({
        userType: false
      })
    }
    vm.getUserInfo()
  },
  //跳转收藏页
  jumpcollect: function () {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },
  //从全局变量获取userinfo
  getUserInfo: function () {
    var userInfo = app.globalData.userInfo
    console.log('userInfo' + JSON.stringify(userInfo))
    vm.setData({
      userInfo: userInfo
    })
  },
  //跳转我的资料
  jumpmyMaterial: function () {
    wx.navigateTo({
      url: '/pages/myMaterial/mymaterial',
    })
  },
  //跳转到积分兑换页面
  jumpIntegral: function () {
    wx.navigateTo({
      url: '/pages/integral/integral',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})