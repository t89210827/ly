// pages/mine/mine.js
var app = getApp()
var vm = null
var util = require('../../utils/util.js')
Page({
  data: {
    userInfo: [],//用户信息
    userType: true,//用户类型
    bg: { img: "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.d029e2f8f631332fc66f31747082f4c1.jpg?imageView2/2/w/750/h/500/interlace/1" },//背景
    animation: ''//执行动画
  },
  onLoad: function (options) {
    vm = this
    //创建一个动画实例animation
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1000,
      timingFunction: "ease",
      delay: 100
    })
  },
  //跳转到积分详情页
  jumpIntegralDetails: function () {
    wx.navigateTo({
      url: '/pages/integralDetails/integralDetails',
    })
  },
  //签到
  signIn: function () {
    this.animation.translateY(10).step()
    this.setData({
      //输出动画
      animation: this.animation.export()
    })
    if (app.globalData.userInfo.sign.status) {
      wx.showToast({
        title: '已经签到过了',
        icon: 'none',
        duration: 2000
      })
      // wx.showModal({
      //   title: '提醒',
      //   content: '您已经签到过了',
      //   showCancel: false,
      //   confirmColor: "#DF9E2D",
      //   success: function (res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
    } else {
      util.addSign({}, function (res) {
        console.log("签到" + JSON.stringify(res))
        app.globalData.userInfo.integral = res.data.ret.integral
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration: 2000
        })
        // wx.showModal({
        //   title: '成功',
        //   content: '签到+10',
        //   showCancel: false,
        //   confirmColor: "#DF9E2D",
        //   success: function (res) {
        //     if (res.confirm) {
        //       console.log('用户点击确定')
        //     } else if (res.cancel) {
        //       console.log('用户点击取消')
        //     }
        //   }
        // })
        wx.setStorage({
          key: "userInfo",
          data: app.globalData.userInfo
        });
        vm.setData({
          userInfo: app.globalData.userInfo
        })
      })
    }
  },
  //跳转收藏页
  jumpcollect: function () {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },
  //跳转我的资料
  jumpmyMaterial: function () {
    wx.navigateTo({
      url: '/pages/myMaterial/mymaterial',
    })
  },
  //跳转到积分兑换页面
  jumpIntegral: function () {
    wx.navigateTo({
      url: '/pages/integral/integral',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var userInfo = app.globalData.userInfo
    // var userInfo = wx.getStorageSync("userInfo")
    if (userInfo.type == 1) {
      vm.setData({
        userType: false
      })
    }
    console.log("mine js userInfo : " + JSON.stringify(userInfo))
    vm.setData({
      userInfo: userInfo
    })
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