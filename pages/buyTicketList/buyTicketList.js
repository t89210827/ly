// pages/buyTicketList/buyTicketList.js
var util = require('../../utils/util.js')
var vm = null
Page({
  data: {
    tickets: [],    //抢票列表数据
  },

  onLoad: function (options) {
    vm = this
    vm.getTicketGoods()
  },

  getTicketGoods: function () {
    var param = {
      offset: 0,
      page: 10
    }
    util.getTicketGoods(param, function (res) {
      console.log("抢票列表 ：" + JSON.stringify(res.data.ret))
      vm.setData({ tickets: res.data.ret })
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