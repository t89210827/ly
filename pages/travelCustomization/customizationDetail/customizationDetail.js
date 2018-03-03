// pages/travelCustomization/customizationDetail/customizationDetail.js
var util = require('../../../utils/util.js')
var vm = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'' ,                //成型套餐id
    customizationData:[],  //套餐数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this
    console.log(options)
    vm.setData({
      id:options.id
    })
    vm.getByIdCustomization()
  },

  getByIdCustomization: function () {
    var param = {
      id: vm.data.id
    }
    util.getByIdCustomization(param, function (res) {
      console.log("根据id获取成型套餐 ：" + JSON.stringify(res))
      vm.setData({
        customizationData:res.data.ret
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

  }
})