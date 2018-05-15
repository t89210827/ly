// pages/travelCustomization/oneDayTour/oneDayTour.js
var util = require('../../../utils/util.js')
var vm = null

Page({
  data: {
    TourGoods: [],   //一日游产品
  },

  onLoad: function (options) {
    vm = this
    vm.getTourGoods()
  },
  //跳转到旅游详情页
  jumpTravelDetails: function (e) {
    console.log("-----" + JSON.stringify(e))
    var travelid = e.currentTarget.dataset.travelid
    wx.navigateTo({
      url: '/pages/travelDetails/travelDetails?travelid=' + travelid,
    })
    // e.travelId
  },
  //根据type获取旅游产品
  getTourGoods: function () {
    var param = {
      type: 1,
      offset: 0,
      page: 10
    }
    util.getTourGoods(param, function (res) {
      console.log("根据type获取旅游产品" + JSON.stringify(res.data.ret))
      vm.setData({ TourGoods: res.data.ret })
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
    var user_id = getApp().globalData.userInfo.id
    var organization_id = getApp().globalData.userInfo.organization_id
    return {
      title: "分享还会获得积分哦！",
      path: '/pages/index/index?share_user=' + user_id + '&organization_id=' + organization_id
    }
  },
})