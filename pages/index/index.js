var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
var vm = null
var offset = 0
Page({
  data: {
    inputShowed: false,// 搜索
    inputVal: "",// 搜索
    Ads: [],//轮播图
    menus: [],//首页菜单
    travel: [],//最新产品
    SpecialGoods: [],//特价优惠routes
    navigate_type: '',//分类类型，是否包含二级分类
    slideWidth: '',//滑块宽
    slideLeft: 0,//滑块位置
    totalLength: '',//当前滚动列表总长
    slideShow: false,
    slideRatio: ''
  },
  onLoad: function (options) {
    console.log("------------" + JSON.stringify(options))

    vm = this
    util.showLoading("加载首页")

    vm.getAds()//获取banner
    vm.getIndexMenus()//获取首页菜单
    vm.getNewGoods()//获取首页最新产品
    vm.getSpecialGoods()//获取首页特价产品   
    vm.getUserInfo()    //获取当前用户信息 
    vm.getBarTitle()
  },

  //加载
  onShow: function () {
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
      var travel = res.data.ret
      for (var i = 0; i < travel.length; i++) {
        travel[i].price = parseInt(travel[i].price).toFixed(0)
        travel[i].image = util.qiniuUrlTool(travel[i].image, "travel_title")
      }
      console.log("最新产品2" + JSON.stringify(travel))
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
      // console.log("特价优惠" + JSON.stringify(res.data.ret))
      console.log("特价优惠" + JSON.stringify(res))
      var SpecialGoods = res.data.ret

      for (var i = 0; i < SpecialGoods.length; i++) {
        SpecialGoods[i].goods_id.image = util.qiniuUrlTool(SpecialGoods[i].goods_id.image, "travel_title")
      }
      console.log("特价优惠2" + JSON.stringify(SpecialGoods))

      vm.setData({
        SpecialGoods: SpecialGoods
      })
    }, null)
    offset = offset + 3
  },
  //设置首页标题
  getBarTitle: function () {
    if (!util.judgeIsAnyNullStr(getApp().globalData.userInfo)) {
      var organization_id = getApp().globalData.userInfo.organization_id
      console.log("根据旅行社id获取旅行社信息" + JSON.stringify(organization_id))

      // var title = "北方国际旅游平台"
      if (organization_id != 0) {
        console.log("旅行社id不为0")
        var param = {
          id: organization_id
        }
        //根据旅行社id获取旅行社信息
        util.getOrganizations(param, function (res) {
          var title = res.data.ret.name
          console.log("根据旅行社id获取旅行社信息" + JSON.stringify(title))
          wx.setNavigationBarTitle({
            title: title //页面标题为路由参数
          })
        })
      }

    }
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
    var pointer = e.currentTarget.dataset.pointer
    if (pointer == 0) {
      // wx.showToast({
      //   title: '模块正在开发中 敬请期待',
      //   icon: 'none',
      //   duration: 2000
      // })
      wx.navigateTo({
        url: '/pages/travelCustomization/index/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/travelList/travelList?scrollLeft=' + scrollLeft + "&pointer=" + pointer,
      })
    }
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

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    console.log("11")
    vm.getNewGoods()
    wx.stopPullDownRefresh()
  },

  onShareAppMessage: function () {
    var user_id = getApp().globalData.userInfo.id
    var organization_id = getApp().globalData.userInfo.organization_id
    return {
      title: "分享还会获得积分哦！",
      path: '/pages/index/index?share_user=' + user_id + '&organization_id=' + organization_id
    }
  },
  //更新当前用户信息
  getUserInfo: function () {
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            var simpleUser = res.userInfo;
            console.log("---" + JSON.stringify(simpleUser))
            var param = {
              gender: simpleUser.gender,
              avatar: simpleUser.avatarUrl,
              nick_name: simpleUser.nickName
            }
            util.updateUserInfo(param, function (res) {
              console.log("更新用户信息:" + JSON.stringify(res))
            })
          }
        });
      }
    });
  }

});
