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
    imgalist: [],//预览列表   
    dateils: {},//详情页全部数据
    banner: [],//banner数据
    userType:true //用户类型
  },
  onLoad: function (options) {
    util.showLoading("加载详情")
    vm = this
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
    } else {
      paramDate = util.formatTime(new Date);
    }
    vm.setData({
      travelid: travelid,
      paramDate: paramDate
    })
    vm.getSystemInfo()
    vm.userType()
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
  //跳转到回复页面
  reply: function () {
    wx.navigateTo({
      url: '/pages/reply/reply?comment_id' + comment_id,
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
      console.log("用户评论数据返回" + JSON.stringify(res))
      var comment = res.data.ret.lists
      var media = res.data.ret.lists.media
      vm.setData({
        comment: comment
      })
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
    var current = e.target.dataset.src;
    vm.data.imgalist.push(current);
    // console.log("预览图片1" + vm.data.imgalist);      
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: vm.data.imgalist // 需要预览的图片http链接列表  
    })
    vm.setData({
      imgalist: []
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
  //获取旅游详情页数据
  getTourGoodsDetail: function () {
    var travelid = vm.data.travelid
    var paramDate = vm.data.paramDate
    var param = {
      id: travelid,
      date: paramDate,
    }
    util.getTourGoodsDetail(param, function (res) {
      console.log("旅游详情数据" + JSON.stringify(res))
      var dateils = res.data.ret
      var routes = dateils.routes
      var contents = dateils.contents
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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

  onShareAppMessage: function (res) {
    console.log("111111111")
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义分享',
      path: '/page/user?id=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})