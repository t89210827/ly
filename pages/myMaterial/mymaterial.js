// pages/myMaterial/mymaterial.js
var app = getApp()
var vm = null
var util = require('../../utils/util.js')
Page({
  data: {
    userInfo: [],
  },
  open: function () {
    wx.showActionSheet({
      itemList: ['男', '女'],
      success: function (res) {
        // console.log("11111" + JSON.stringify(res))
        if (!res.cancel) {
          console.log(res.tapIndex)
          vm.setData({
            'userInfo.gender': res.tapIndex + 1
          })
          // console.log("11111" + JSON.stringify(vm.data.userInfo.gender))
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this
    var userInfo = app.globalData.userInfo
    console.log('userInfo' + JSON.stringify(userInfo))
    vm.setData({
      userInfo: userInfo
    })
  },

  nick_name: function (e) {
    vm.setData({
      'userInfo.nick_name': e.detail.value
    })
  },
  telephone: function (e) {
    vm.setData({
      'userInfo.telephone': e.detail.value
    })
    console.log("1111" + vm.data.userInfo.telephone)
  },
  email: function (e) {
    vm.setData({
      'userInfo.email': e.detail.value
    })
  },
  passport: function (e) {
    vm.setData({
      'userInfo.passport': e.detail.value
    })
  },

  saveUserInfo: function () {
    var param = {
      gender: vm.data.userInfo.gender,//姓名
      avatar: vm.data.userInfo.avatar,//头像
      telephone: vm.data.userInfo.telephone,//电话
      id_card: vm.data.userInfo.id_card,//身份证号
      email: vm.data.userInfo.email,//电子邮箱
      passport: vm.data.userInfo.passport,//护照
      sign: '',//签到天数
      background: ''//个人中心背景样式
    }
    util.updateUserInfo(param, function (res) {
      console.log("更新用户信息：" + JSON.stringify(res))

      wx.setStorage({
        key: "userInfo",
        data: res.data.ret
      });
      app.globalData.userInfo = res.data.ret;

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
    var vm = this
    var userInfo = app.globalData.userInfo
    console.log("userInfo" + JSON.stringify(userInfo))
    vm.setData({
      userInfo: userInfo
    })
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