// pages/integralDetails/integralDetails.js
var vm = null
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IntegralDetaileLists: []
  },
  onLoad: function (options) {
    vm = this
    vm.getIntegralDetaileLists()
  },

  getIntegralDetaileLists: function () {
    util.getIntegralDetaileLists({}, function (res) {
      console.log("获取积分历史 ：" + JSON.stringify(res))
      vm.setData({
        IntegralDetaileLists: res.data.ret
      })
      console.log("获取积分历史1：" + JSON.stringify(vm.data.IntegralDetaileLists))
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