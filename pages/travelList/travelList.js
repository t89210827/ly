// pages/travelList/travelList.js
var util = require('../../utils/util.js')
var app = getApp();
var vm = null
var offset = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // inputShowed: false,
    // inputVal: "",
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    tour_category_id: '',//目录id
    travel: [],//全部旅游数据
    // expertList: [{ 
    //   img: "avatar.png",
    //   name: "欢顔",
    //   tag: "知名情感博主",
    //   answer: 134,
    //   listen: 2234
    // }]
  },

  jumpTravelDetails: function (e) {
    var travelid = e.currentTarget.dataset.travelid
    console.log("jumpTravelDetails is : " + JSON.stringify(travelid))
    wx.navigateTo({
      url: '/pages/travelDetails/travelDetails?travelid=' + travelid,
    })
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    console.log(e.detail.current)
    var tour_category_id = ''//目的地id
    var currentTab = e.detail.current  //指针
    if (currentTab == 1) {
      tour_category_id = 2
    } else if (currentTab == 2) {
      tour_category_id = 3
    } else if (currentTab == 3) {
      tour_category_id = 4
    } else if (currentTab == 0) {
      tour_category_id = 0
    } else if (currentTab == 4) {
      tour_category_id = 5
    }
    vm.setData({
      tour_category_id: tour_category_id,
      currentTab: currentTab
    })

    vm.getTourGoodsLists()

    // this.setData({
    //   currentTab: e.detail.current
    // });
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
  onLoad: function (options) {
    vm = this
    // console.log("8888888888" + JSON.stringify(options))
    var tour_category_id = options.scrollLeft//目的地id
    var currentTab = ''  //指针
    if (tour_category_id == 2) {
      currentTab = 1
    } else if (tour_category_id == 3) {
      currentTab = 2
    } else if (tour_category_id == 4) {
      currentTab = 3
    } else if (tour_category_id == 5) {
      currentTab = 4
    }
    vm.setData({
      tour_category_id: tour_category_id,
      currentTab: currentTab
    })
    
    console.log("分啊方法" + vm.data.currentTab)

    var that = this;
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
        that.setData({
          winHeight: calc
        });
      }
    });
    vm.getTourGoodsLists()
  },

  getTourGoodsLists: function () {
    util.showLoading("加载列表")
    var param = {
      offset: offset,//开始位置
      page: 20,  //输出的条数
      tour_category_id: vm.data.tour_category_id//目的地编号
    }
    util.getTourGoodsLists(param, function (res) {
      vm.setData({
        travel: res.data.ret
      })
      console.log("旅游数据" + JSON.stringify(vm.data.travel))
    })
  },

  footerTap: app.footerTap,

  // showInput: function () {
  //   this.setData({
  //     inputShowed: true
  //   });
  // },
  // hideInput: function () {
  //   this.setData({
  //     inputVal: "",
  //     inputShowed: false
  //   });
  // },
  // clearInput: function () {
  //   this.setData({
  //     inputVal: ""
  //   });
  // },
  // inputTyping: function (e) {
  //   this.setData({
  //     inputVal: e.detail.value
  //   });
  // },
})