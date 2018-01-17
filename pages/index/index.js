var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
var vm = null
var offset = 0
Page({
  data: {
    inputShowed: false,// 搜索
    inputVal: "",// 搜索
    systemInfo: [],//用户手机信息
    Ads: [],//轮播图
    menus: [],//首页菜单
    travel: [],//最新产品
    SpecialGoods: [],//特价优惠
    navigate_type: '',//分类类型，是否包含二级分类
    slideWidth: '',//滑块宽
    slideLeft: 0,//滑块位置
    totalLength: '',//当前滚动列表总长
    slideShow: false,
    slideRatio: ''
  },
  onLoad: function (options) {
    util.showLoading("加载首页")
    // console.log("88888888888888" + 100.00.toFixed(0))
    console.log("分享携带的参数" + JSON.stringify(options))
    console.log('onLoad')
    vm = this
    //初始化sysInfo
    app.getSystemInfo(function (res) {
      console.log("getSystemInfo:" + JSON.stringify(res));
      vm.setData({
        systemInfo: res
      })
    })
    vm.getAds()//获取banner
    vm.getIndexMenus()//获取首页菜单
    vm.getNewGoods()//获取首页最新产品
    vm.getSpecialGoods()//获取首页特价产品    
  },
  //跳转商品详情页
  jumpTravelDetails: function (e) {
    console.log("旅游详情" + JSON.stringify(e))
    var travelid = e.currentTarget.dataset.travelid
    wx.navigateTo({
      url: '/pages/travelDetails/travelDetails?travelid=' + travelid,
    })
  },
  //跳转banner详情页
  jumpDetails: function (e) {
    // console.log("banner: " + JSON.stringify(e.currentTarget.dataset.bannerid))
    var bannerid = e.currentTarget.dataset.bannerid
    wx.navigateTo({
      url: '/pages/bannerDetails/bannerDetails?bannerid=' + bannerid,
    })
  },
  //获取首页动态菜单
  getIndexMenus: function () {
    util.getIndexMenus({}, function (res) {
      console.log("首页菜单" + JSON.stringify(res.data.ret))
      vm.setData({
        menus: res.data.ret
      })
    }, null)
  },
  //获取最新产品
  getNewGoods: function () {
    var param = {
      offset: 0,
      page: 5
    }
    util.getNewGoods(param, function (res) {
      console.log("最新产品" + JSON.stringify(res.data.ret))
      // var travel = vm.data.travel
      // var newTravel = res.data.ret
      var travel = res.data.ret
      vm.setData({
        // travel: travel.concat(newTravel)
        travel: travel
      })
    }, null)
    // offset = offset + 5
  },
  //获取首页特价优惠
  getSpecialGoods: function () {
    var param = {
      offset: offset,
      page: 3
    }
    util.getSpecialGoods(param, function (res) {
      console.log("特价优惠" + JSON.stringify(res.data.ret))
      var SpecialGoods = res.data.ret
      vm.setData({
        SpecialGoods: SpecialGoods
      })
    }, null)
    offset = offset + 3
  },
  //获取轮播图
  getAds: function () {
    util.getAds({}, function (res) {
      console.log("轮播图" + JSON.stringify(res.data.ret))
      vm.setData({
        Ads: res.data.ret
      })
    }, null)
  },
  // 跳转到旅游列表页
  jumpTravelList: function (e) {
    // console.log(JSON.stringify(e))
    var scrollLeft = e.currentTarget.dataset.scrollleft
    wx.navigateTo({
      url: '/pages/travelList/travelList?scrollLeft=' + scrollLeft,
    })
  },
  //weui搜索JS
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  complete: function () {
    wx.navigateTo({
      url: '/pages/search/search?input=' + vm.data.inputVal,
    })
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  // clearInput: function () {
  //   this.setData({
  //     inputVal: ""
  //   });
  // },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //加载
  onShow: function () {
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    // console.log("11")
  },

  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    // console.log("1111111111")
    // vm.getNewGoods()
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    // var article_id = wx.getStorageSync('current_article_id');
    // var path = '/pages/article/article?article_id=' + article_id + '';
    return {
      title: '来自Acker的分享',
      path: '/pages/article/article?article_id=123'
    }
  }
});

  // 跳转
  // jumpSpecial: function () {
  //   wx.navigateTo({
  //     url: '/pages/specialTravel/specialTravel',
  //   })
  // },

