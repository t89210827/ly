// pages/travelDetails/travelDetails.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var util = require('../../utils/util.js');
var vm = null
var offset = 0
Page({
  data: {
    tabs: ["路线详情", "产品特色", "用户点评"],
    activeIndex: 0, //导航默认值
    sliderOffset: 0,
    sliderLeft: 0,
    date: '',//日
    month: '',//月
    year: '',//年
    paramDate: '',//时间
    travelid: '',//旅游id
    surplus: '',//剩余位数
    routes: [],//线路概述
    contents: [],//产品特色
    comment: [],//所有评论  
    dateils: {},//详情页全部数据
    banner: [],//banner数据
    userType: true, //用户类型

    images: [],     //产品特色图片
    money: [],      //价格和余位
  },

  userType: function () {
    var userInfo = getApp().globalData.userInfo
    if (userInfo.type == 1) {
      vm.setData({
        userType: false
      })
    }
    console.log("类型" + vm.data.userType)
  },

  onLoad: function (options) {
    vm = this
    console.log("888888888888" + JSON.stringify(options))

    if (!util.judgeIsAnyNullStr(getApp().globalData.userInfo)) {
      vm.userType()
      vm.load(options)
    } else {
      getApp().login(function (userInfo) {
        // console.log("11111111111" + JSON.stringify(res))
        if (userInfo.type == 1) {
          vm.setData({
            userType: false
          })
        }
        vm.load(options)
      })
    }



  },

  load: function (options) {
    util.showLoading("加载详情")

    var travelid = options.travelid
    var paramDate = ''
    //判断有时间参数（是否从日历页拿数据）
    if (!util.judgeIsAnyNullStr(options.idx)) {
      var date = options.idx
      var month = options.cur_month
      var year = options.cur_year
      vm.setData({
        date: date,
        month: month,
        year: year
      })
      paramDate = [year, month, date].join('-')

      vm.getTourGoodsByGoodsIdAndDate()
    } else {
      paramDate = util.formatTime(new Date);
    }
    vm.setData({
      travelid: travelid,
      paramDate: paramDate
    })
    vm.getSystemInfo()
  },

  showtoast: function () {
    wx.showToast({
      title: '评价审核通过后才能展示出来，请耐心等待',
      icon: 'none',
      duration: 4000
    })
  },
  // 根据旅游产品id获取产品日期
  getTourGoodsByGoodsIdAndDate: function () {
    var param = {
      tour_goods_id: vm.data.travelid,
      date: vm.data.paramDate
    }
    util.getTourGoodsByGoodsIdAndDate(param, function (res) {
      // console.log("-----" + JSON.stringify(res))
      var money = res.data.ret
      if (util.judgeIsAnyNullStr(money)) {
        var obj = []
        var moneyNall = {}
        console.log("-----1" + JSON.stringify(money))
        moneyNall.price = vm.data.dateils.price
        moneyNall.surplus = vm.data.surplus
        obj.push(moneyNall)
        money = obj
      }
      console.log("-----" + JSON.stringify(money))
      vm.setData({ money: money })
    })
  },

  //跳转到回复页面
  jumpReply: function (e) {
    var comment_id = e.currentTarget.dataset.commentid
    wx.navigateTo({
      url: '/pages/reply/reply?comment_id=' + comment_id,
    })
  },
  //获取产品的评论详情
  getGoodsCommentLists: function () {
    var param = {
      goods_id: vm.data.travelid,
      goods_type: 1,
      offset: offset,
      page: 10
    }
    util.getGoodsCommentLists(param, function (res) {
      console.log("用户评论数据返回" + JSON.stringify(res.data.ret))
      var comment = res.data.ret.lists
      var media = res.data.ret.lists.media
      if (util.judgeIsAnyNullStr(comment)) {
        vm.setData({
          comment: "nall"
        })
        console.log("用户评论数据返回1" + JSON.stringify(vm.data.comment))
        return
      }
      for (var i = 0; i < comment.length; i++) {
        if (comment[i].content == null) {
          // console.log("-----" + JSON.stringify(comment[i].content))
          comment[i].content = ""
        }
      }
      vm.setData({
        comment: comment
      })
    })
  },
  //预定
  gotobuy: function () {
    wx.showModal({
      title: '预定',
      content: '确定预定吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var param = {
            goods_id: vm.data.travelid,
            goods_type: 1,
            start_time: vm.data.paramDate,
            price: vm.data.dateils.price
          }
          util.order(param, function (res) {
            console.log("旅游商品下单 ： " + JSON.stringify(res))
            if (res.data.ret.surplus) {
              wx.showToast({
                title: '预订成功',
                icon: 'success',
                duration: 2000
              })
            } else if (!res.data.ret.surplus) {
              wx.showToast({
                title: '剩余位置不足',
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //收藏旅游
  collectTravel: function () {
    console.log("收藏" + vm.data.dateils.collection)
    //判断是否收藏过
    if (vm.data.dateils.collection) {
      wx.showModal({
        title: '收藏失败',
        content: '您曾经收藏过,可以直接在收藏夹中查看',
        showCancel: false,
        confirmColor: "#DF9E2D",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    var param = {
      goods_id: vm.data.travelid,
      goods_type: 1
    }
    util.addCollectionGoods(param, function (res) {
      console.log("收藏" + JSON.stringify(res))
      wx.showModal({
        title: '收藏成功',
        content: '您可以在收藏夹中查看',
        showCancel: false,
        confirmColor: "#DF9E2D",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    })
  },
  // 预览图片  
  previewImage: function (e) {
    var obj = e.target.dataset.srcs;
    var current = e.target.dataset.src;
    var arr = []
    for (var i = 0; i < obj.length; i++) {
      if (obj[i].type == 1) {
        arr.push(obj[i].content)
      }
    }
    console.log("预览图片1" + JSON.stringify(arr));
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: arr // 需要预览的图片http链接列表  
    })
  },
  addComment: function () {
    var goods_id = vm.data.travelid
    wx.navigateTo({
      url: '/pages/writeComment/writeComment?goods_id=' + goods_id,
    })
  },
  //用户点赞
  addConsent: function (e) {
    var commentId = e.currentTarget.dataset.commentid
    var param = {
      comment_id: commentId
    }
    util.addConsent(param, function (res) {
      console.log(JSON.stringify(res))
      vm.getGoodsCommentLists()
    })
  },
  //获取图片的高宽
  imageLoad: function (e) {
    console.log("imageLoad e:" + JSON.stringify(e))
    var imageSize = util.imageUtil(e)
    var index = parseInt(e.currentTarget.id)
    var obj = vm.data.contents
    obj[index].content.imageWidth = imageSize.imageWidth
    obj[index].content.imageHeight = imageSize.imageHeight

    vm.setData({
      contents: obj
    })
  },
  //获取旅游详情页数据
  getTourGoodsDetail: function () {
    var travelid = vm.data.travelid
    var paramDate = vm.data.paramDate
    // var paramDate = "2018-03-29"
    var param = {
      id: travelid,
      date: paramDate,
    }
    util.getTourGoodsDetail(param, function (res) {
      console.log("旅游详情数据" + JSON.stringify(res))
      var dateils = res.data.ret
      var routes = dateils.routes
      var contents = dateils.contents

      for (var i = 0; i < contents.length; i++) {
        if (contents[i].type == 1) {
          var imagesIndex = contents[i].content
          var index = { url: imagesIndex, "imageWidth": 0, "imageHeight": 0 }
          contents[i].content = index
        }
      }
      // console.log("产品特色" + JSON.stringify(contents))
      for (var i = 0; i < routes.length; i++) {
        // routes[i].place = routes[i].place.split("<icon_plan>")
        routes[i].content = routes[i].content.replace(/<_>/ig, "\r\n")
      }
      //转为整数
      dateils.price = parseInt(dateils.price).toFixed(0)
      // surplus
      if (util.judgeIsAnyNullStr(dateils.calendar)) {
        vm.setData({
          surplus: dateils.surplus
        })
        console.log("剩余位数" + dateils.surplus)
      } else {
        vm.setData({
          surplus: dateils.calendar.surplus
        })
      }
      vm.setData({
        dateils: dateils,
        banner: dateils.image_lists,
        routes: routes,
        contents: contents
      })
      vm.getTourGoodsByGoodsIdAndDate()   //根据日期和产品id 获取价格和余位
    })
  },
  //顶部导航栏
  getSystemInfo: function () {
    wx.getSystemInfo({
      success: function (res) {
        vm.setData({
          sliderLeft: (res.windowWidth / vm.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / vm.data.tabs.length * vm.data.activeIndex
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
      url: '/pages/rili/rili?travelid=' + vm.data.travelid
    })
  },

  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    vm.getTourGoodsDetail()
    vm.getGoodsCommentLists()
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
    console.log("1111")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // onShareAppMessage: function (res) {
  //   console.log("111111111")
  //   var user_id = getApp().globalData.userInfo.id
  //   if (res.from === 'button') {
  //     console.log(res.target)
  //   }
  //   return {
  //     title: '分享小程序并且好友进入小程序会获得积分呦',
  //     path: '/pages/index/index?user_id=' + user_id,
  //     success: function (res) {
  //       wx.showToast({
  //         title: '分享成功',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     },
  //     fail: function (res) {
  //     }
  //   }
  // },

  onShareAppMessage: function () {
    var user_id = getApp().globalData.userInfo.id
    console.log("转发" + vm.data.travelid)
    return {
      title: getApp().globalData.userInfo.organization_id,
      path: '/pages/travelDetails/travelDetails?share_user=' + user_id + "&travelid=" + vm.data.travelid
    }
  },

})