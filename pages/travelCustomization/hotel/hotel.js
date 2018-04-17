// pages/travelCustomization/hotel/hotel.js
var vm = null
var util = require('../../../utils/util.js')
Page({
  data: {
    hotelList: [],   //酒店列表
  },

  onLoad: function (options) {
    vm = this
    vm.getHotel()
  },
  //获取酒店列表
  getHotel: function () {
    var param = {
      offset: 0,
      page: 10,
    }
    util.getHotel(param, function (res) {
      console.log("酒店列表 " + JSON.stringify(res))
      vm.setData({
        hotelList: res.data.ret
      })
    })
  },
  //跳转回旅游定制首页
  clickHotel: function (e) {
    // console.log("酒店 ： "+ JSON.stringify(e))
    wx.setStorage({
      key: 'hotel',
      data: e.currentTarget.dataset.hotel,
    })

    wx.navigateBack({
      delta: 1
    })
    // wx.navigateTo({
    //   url: '../index/index',
    // })
  },
  //下单
  order: function (e) {
    console.log("酒店下单0 ： " + JSON.stringify(e))
    var hotelId = e.currentTarget.dataset.hotelid
    var param = {
      goods_id: hotelId,
      goods_type: 3,
    }
    util.order(param, function (res) {
      console.log("酒店下单 ： " + JSON.stringify(res))
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
    var user_id = getApp().globalData.userInfo.id
    return {
      title: getApp().globalData.userInfo.organization_id,
      path: '/pages/index/index?share_user=' + user_id
    }
  },
})