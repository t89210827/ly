// pages/travelList/travelList.js
var util = require('../../utils/util.js')
var app = getApp();
var vm = null
var offset = 0
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    tour_category_id: '',//目录id
    travel: [],//全部旅游数据
    menus: '',  //分类
    menus_length: ''  //分类长度
  },
  onLoad: function (options) {
    console.log("333333333" + JSON.stringify(options))
    vm = this
    var tour_category_id = options.scrollLeft// 类别id
    var currentTab = options.pointer - 1// 指针   
    vm.setData({
      tour_category_id: tour_category_id,
      currentTab: currentTab
    })
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        console.log("11111111111" + JSON.stringify(res))
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        // var calc = clientHeight * rpxR - 180;
        var calc = clientHeight * rpxR;
        console.log(calc)
        vm.setData({
          winHeight: calc
        });
      }
    });
    vm.getTourGoodsLists()
    vm.getIndexMenus()
  },
  //获取旅游类别
  getIndexMenus: function () {
    util.getIndexMenus({}, function (res) {
      var menus = res.data.ret
      menus.shift()
      console.log("首页菜单" + JSON.stringify(menus))
      vm.setData({
        menus: menus,
        menus_length: menus.length
      })
    }, null)
  },
  //跳转到商品详情页
  jumpTravelDetails: function (e) {
    var travelid = e.currentTarget.dataset.travelid
    console.log("jumpTravelDetails is : " + JSON.stringify(travelid))
    wx.navigateTo({
      url: '/pages/travelDetails/travelDetails?travelid=' + travelid,
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    var currentTab = e.detail.current  //指针
    var tour_category_id = vm.data.menus[currentTab].id//类别id
    vm.setData({
      tour_category_id: tour_category_id,
      currentTab: currentTab
    })
    vm.getTourGoodsLists()
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  //加载列表
  getTourGoodsLists: function () {
    util.showLoading("加载列表")
    var param = {
      offset: offset,//开始位置
      page: 20,  //输出的条数
      tour_category_id: vm.data.tour_category_id//目的地编号
    }
    util.getTourGoodsLists(param, function (res) {
      var travel = res.data.ret
      for (var i = 0; i < travel.length; i++) {
        travel[i].image = util.qiniuUrlTool(travel[i].image, "travel_title")
      }
      vm.setData({
        travel: travel
      })
      console.log("旅游数据" + JSON.stringify(res))
    })
  },

  onShareAppMessage: function () {
    var user_id = getApp().globalData.userInfo.id
    if (app.globalData.userInfo.organization_id) {

      return {
        title: app.globalData.userInfo.organization_id,
        path: '/pages/index/index?share_user=' + user_id
      }
    }

  },

  footerTap: app.footerTap,
})