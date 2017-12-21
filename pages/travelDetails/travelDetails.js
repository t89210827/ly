// pages/travelDetails/travelDetails.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var util = require('../../utils/util.js');
Page({
  data: {
    tabs: ["路线详情", "产品特色", "用户点评"],
    activeIndex: 0, //导航默认值
    sliderOffset: 0,
    sliderLeft: 0,
    date: '',
    month: '',

    swipers: [{ img: "http://twst.isart.me/o_1bves37st1lek1fu41n3k79m1dd9.jpg" },
    { img: "http://twst.isart.me/o_1bverukoa1fmb1ckm7291jfneae9.jpg" },
    { img: "http://twst.isart.me/o_1bvgql7fribe1ufl1ebk8p71r7t9.png" },]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("1111" + JSON.stringify(options))
    if (!util.judgeIsAnyNullStr(options.idx)) {
      this.setData({
        date: options.idx,
        month: options.cur_month
      })
    }
    console.log(this.data.month)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  jumpCalendar: function () {
    wx.navigateTo({
      url: '/pages/rili/rili'
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