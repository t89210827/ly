var app = getApp()
var vm = null
var util = require('../../utils/util.js')
Page({
  data: {
    collect: {},
    deleId:[]
  },
  onLoad: function (options) {
    vm = this
    var userInfo = app.globalData.userInfo

    vm.getCollectionLists()
  },
  //获取收藏夹内容
  getCollectionLists: function () {
    util.getCollectionLists({}, function (res) {
      console.log("收藏夹" + JSON.stringify(res))
      vm.setData({
        collect: res.data.ret.collections
      })
    })
  },
  deleteCollectionLists:function(e){
    console.log("删除" + JSON.stringify(e))    
    var id = e.currentTarget.dataset.collectid
    var deleId = vm.data.deleId
    deleId.push(id)
    vm.setData({
      deleId: deleId
    })
    var param = {
      id: vm.data.deleId
    }
    util.deleteCollectionLists(param,function(res){
      console.log(JSON.stringify(res))
      vm.getCollectionLists()
      vm.setData({
        deleId:[]
      })
    })

  },
  //跳转收藏页
  jumpcollect: function () {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },
  //从全局变量获取userinfo
  getUserInfo: function () {
    var userInfo = app.globalData.userInfo
    console.log('userInfo' + JSON.stringify(userInfo))
    vm.setData({
      userInfo: userInfo
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