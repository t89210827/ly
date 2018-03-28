// pages/buyTickets/buyTickets.js
var util = require('../../utils/util.js')
var vm = null
Page({
  data: {
    tickets: [],       //抢票列表
    index: 0
  },
  onLoad: function (options) {
    vm = this
    vm.getTicketGoods()
  },

  nextTicket: function () {
    var index = vm.data.index
    if (index == vm.data.tickets.length - 1) {
      console.log("从头再来")
      index = 0
    } else {
      index++
    }
    vm.setData({ index: index })
  },
  //抢票模块
  buyTickets: function () {
    wx.showModal({
      title: '抢票',
      content: '只有一次机会,您确定抢票吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          vm.ticketOrder()

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //抢票接口
  ticketOrder: function () {
    var param = {
      goods_type: 5,
      goods_id: vm.data.index
    }
    util.order(param, function (res) {
      console.log("抢票订单信息 ：" + JSON.stringify(res))
      wx.showToast({
        title: '抢票成功',
        icon: 'none',
        duration: 2000
      })
    })
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