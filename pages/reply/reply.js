// pages/reply/reply.js
var vm = null
var util = require('../../utils/util.js')
Page({
  data: {
    intro: '',//评论
    comment_id: '' //评论id
  },
  onLoad: function (options) {
    vm = this
    vm.setData({
      comment_id: options.comment_id
    })
  },
  //评论
  textAreaEventListener: function (e) {
    vm.setData({
      intro: e.detail.value,
    })
  },

  //发布评论
  addReply: function () {
    var param = {
      content: vm.data.intro,//评论的文本内容
      comment_id: vm.data.comment_id,//评论编号
    }
    util.addCommentReplie(param, function (res) {
      console.log("旅行社回复 " + JSON.stringify(res))
      wx.navigateBack({
        delta: 1
      })
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
    if (app.globalData.userInfo.organization_id) {

      return {
        title: app.globalData.userInfo.organization_id,
        path: '/pages/index/index?share_user=' + user_id
      }
    }

  }
})