// pages/getUserInfo/getUserInfo.js
Page({

  data: {

  },

  //点击获取用户信息接口返回信息
  getUserInfo: function (e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      // var userInfo = e.detail.userInfo
      getApp().login()
    } else if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      getApp().showModal()
    }
    console.log("用户信息" + JSON.stringify(e))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

})