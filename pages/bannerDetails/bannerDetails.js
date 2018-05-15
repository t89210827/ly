// pages/bannerDetails/bannerDetails.js
var util = require('../../utils/util.js')
var vm = this
//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    details: []
  },

  onLoad: function (options) {
    vm = this
    var bannerid = options.bannerid
    // console.log("banner: " + JSON.stringify(options))
    var param = {
      id: bannerid
    }
    util.getBannerDetail(param, function (res) {
      console.log("bannerId: " + JSON.stringify(res))
      var details = res.data.ret.details
      vm.setData({
        details: details
      })
    })
  },

  //获取图片的高宽
  imageLoad: function (e) {
    console.log("imageLoad e:" + JSON.stringify(e))
    var imageSize = util.imageUtil(e)
    var index = parseInt(e.currentTarget.id)
    var obj = vm.data.details
    console.log("imageLoad e1:" + JSON.stringify(obj))
    obj[index].imageWidth = imageSize.imageWidth
    obj[index].imageHeight = imageSize.imageHeight

    vm.setData({
      details: obj
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