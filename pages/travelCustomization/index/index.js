// pages/travelCustomization/index/index.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var vm = null
var util = require("../../../utils/util.js")
Page({
  data: {
    tabs: ["自定义套餐", "成型套餐"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    items: [
      { name: '机票', src: '../airplaneTicket/airplaneTicket', value: '', },
      { name: '酒店', src: '../hotel/hotel', value: '', },
      { name: '车导', src: '../car/car', value: '', },
      // { name: '一日游套餐', src: '../oneDayTour/oneDayTour', value: '', },
    ],
    items_two: [
      { name: '成型套餐A', src: '../airplaneTicket/airplaneTicket', value: '', },
      { name: '成型套餐B', src: '../hotel/hotel', value: '', },
      { name: '成型套餐C', src: '../car/car', value: '', },
      { name: '成型套餐D', src: '../car/car', value: '', },
    ],
    isClick: [],         //选中数组
    airplane: {},        //飞机票
    hotel: {},           //酒店
    car: {},             //车导
    price: '',           //总价格
    customization: [],   //成型套餐列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this
    wx.getSystemInfo({
      success: function (res) {
        vm.setData({
          sliderLeft: (res.windowWidth / vm.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / vm.data.tabs.length * vm.data.activeIndex
        });
      }
    });
    vm.getCustomization()
  },

  getCustomization: function () {
    var param = {
      offset: 0,
      page: 10
    }
    util.getCustomization(param, function (res) {
      console.log("成型套餐 ： " + JSON.stringify(res))
      vm.setData({
        customization: res.data.ret
      })
    })
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', JSON.stringify(e.detail.value))
    vm.setData({
      isClick: e.detail.value
    })
    vm.getStorage()
  },

  //获取缓存
  getStorage: function () {
    var airplane = wx.getStorageSync('airplane')
    var hotel = wx.getStorageSync('hotel')
    var car = wx.getStorageSync('car')
    var price = 0
    for (var index in vm.data.isClick) {
      var isClick = vm.data.isClick
      if (isClick[index] == 0 && !isNaN(airplane.price)) {
        price = parseInt(airplane.price) + price
      }
      if (isClick[index] == 1 && !isNaN(hotel.price)) {
        price = parseInt(hotel.price) + price
      }
      if (isClick[index] == 2 && !isNaN(car.price)) {
        price = parseInt(car.price) + price
      }
    }
    console.log("获取总价格 ： " + price)
    vm.setData({
      airplane: airplane,
      hotel: hotel,
      car: car,
      price: price
    })
  },
  //省略小数点
  toFixed: function () {
    dateils.price = parseInt(vm.data.airplane.price).toFixed(0)
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  affirm: function () {
    wx.showModal({
      title: '确认',
      content: '您确认要下单吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          vm.order()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //下单
  order: function () {
    var airplane = wx.getStorageSync('airplane')
    var hotel = wx.getStorageSync('hotel')
    var car = wx.getStorageSync('car')
    for (var index in vm.data.isClick) {
      var isClick = vm.data.isClick
      if (isClick[index] == 0 && !isNaN(airplane.price)) {
        var param = {
          goods_id: airplane.id,
          goods_type: 2
        }
        util.order(param, function (res) {
          console.log("机票下单成功 ： " + JSON.stringify(res))
        })
      }
      if (isClick[index] == 1 && !isNaN(hotel.price)) {
        var param = {
          goods_id: hotel.id,
          goods_type: 3
        }
        util.order(param, function (res) {
          console.log("酒店下单成功 ： " + JSON.stringify(res))
        })
      }
      if (isClick[index] == 2 && !isNaN(car.price)) {
        var param = {
          goods_id: car.id,
          goods_type: 4
        }
        util.order(param, function (res) {
          console.log("车导下单成功 ： " + JSON.stringify(res))
        })
      }
    }
    wx.showModal({
      title: '提示',
      content: '下单成功',
      confirmText: '看订单',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '/pages/order/order',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
    vm.getStorage()
    console.log("总价格 ： " + vm.data.price)
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
    wx.removeStorage({
      key: 'airplane',
      success: function (res) {
        console.log("删除机票缓存" + JSON.stringify(res.data))
      }
    })
    wx.removeStorage({
      key: 'hotel',
      success: function (res) {
        console.log("删除酒店缓存" + JSON.stringify(res.data))
      }
    })
    wx.removeStorage({
      key: 'car',
      success: function (res) {
        console.log("删除车导缓存" + JSON.stringify(res.data))
      }
    })
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
    return {
      title: getApp().globalData.userInfo.organization_id,
      path: '/pages/index/index?share_user=' + user_id
    }
  },
})