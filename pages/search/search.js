// pages/search/search.js
var util = require('../../utils/util.js')
var vm = null
var offset = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    serachResult: [],
    aaa: 10000.00,
    isNall: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this
    console.log(JSON.stringify(options))
    vm.setData({
      search: options.input
    })
    vm.search()
  },

  search: function () {
    var param = {
      offset: offset, // 开始位置
      page: 8,  //输出的条数
      search_name: vm.data.search//关键字
    }
    util.search(param, function (res) {
      // console.log(JSON.stringify(res))
      var serachResult = vm.data.serachResult
      var newSerachResult = res.data.ret
      for (var i = 0; i < newSerachResult.length; i++) {
        newSerachResult[i].goods_id.price = parseInt(newSerachResult[i].goods_id.price).toFixed()
      }
      // console.log("dewd" + JSON.stringify(serachResult))
      vm.setData({
        serachResult: serachResult.concat(newSerachResult)
        // serachResult: serachResult
      })
      if (util.judgeIsAnyNullStr(vm.data.serachResult)) {
        vm.setData({
          isNall: true
        })
      }
      // console.log("isNall" + JSON.stringify(vm.data.isNall))
    })
    offset = offset + 8
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
    offset = 0
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
    // console.log("33333333")
    vm.search()
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