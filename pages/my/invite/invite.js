// pages/my/invite/invite.js
var util = require('../../../utils/util.js')
var vm = null
Page({
  data: {
    invite: ''
  },
  //我的邀请
  getMyInvitation: function () {
    util.getMyInvitation({}, function (res) {
      console.log("获取我的邀请 ： " + JSON.stringify(res))
      vm.setData({
        invite: res.data.ret
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this
    vm.getMyInvitation()
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