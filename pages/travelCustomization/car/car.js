// pages/travelCustomization/car/car.js
var vm = null
var util = require('../../../utils/util.js')
Page({
  data: {
    carList: [],   //酒店列表
  },

  onLoad: function (options) {
    vm = this
    vm.getCar()
  },
  //跳转回旅游定制首页
  clickAirplane: function (e) {
    wx.setStorage({
      key: 'car',
      data: e.currentTarget.dataset.car,
    })
    wx.navigateBack({
      delta: 1
    })
    // wx.navigateTo({
    //   url: '../index/index',
    // })
  },
  //获取车导列表
  getCar: function () {
    var param = {
      offset: 0,
      page: 10,
    }
    util.getCar(param, function (res) {
      console.log("车导列表 " + JSON.stringify(res))
      vm.setData({
        carList: res.data.ret
      })
    })
  },

  order: function (e) {
    // console.log("车导下单 ： " + JSON.stringify(e))
    var carId = e.currentTarget.dataset.carid
    var param = {
      goods_id: carId,
      goods_type: 4,
    }
    util.order(param, function (res) {
      console.log("车导下单 ： " + JSON.stringify(res))
    })
  },

  onReady: function () {

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
    var user_id = getApp().globalData.userInfo.id
    if (app.globalData.userInfo.organization_id) {

      return {
        title: app.globalData.userInfo.organization_id,
        path: '/pages/index/index?share_user=' + user_id
      }
    }

  }
})