// pages/travelCustomization/airplaneTicket/airplaneTicket.js
var util = require("../../../utils/util.js")
var vm = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    airplant: []  //飞机票列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this
    vm.getTicket()
  },

  getTicket: function () {
    var param = {
      offset: 0,
      page: 10
    }
    util.getTicket(param, function (res) {
      console.log("机票列表" + JSON.stringify(res.data.ret))
      vm.setData({
        airplant: res.data.ret
      })
    })
  },
  //跳转回旅游定制首页
  clickAirplane: function (e) {
    wx.setStorage({
      key: "airplane",
      data: e.currentTarget.dataset.airplane
    })

    wx.navigateTo({
      url: '../index/index',
    })
  },

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