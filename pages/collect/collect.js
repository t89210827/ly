var app = getApp()
var vm = null
var util = require('../../utils/util.js')
// var initdata = function (that) {
//   var list = that.data.list
//   for (var i = 0; i < list.length; i++) {
//     list[i].txtStyle = ""
//   }
//   that.setData({ list: list })
// }
var initdata = function (that) {
  var collect = vm.data.collect
  for (var i = 0; i < collect.length; i++) {
    collect[i].txtStyle = ""
  }
  that.setData({ collect: collect })
}

Page({
  data: {
    collect: {},
    deleId: [],
    startX: '',

    delBtnWidth: 180,//删除按钮宽度单位（rpx）  
    list: [
      {
        txtStyle: "",
        icon: "/images/qcm.png",
        txt: "指尖快递"
      }
    ]

  },
  onLoad: function (options) {
    vm = this
    var userInfo = app.globalData.userInfo
    vm.getCollectionLists()

    // 页面初始化 options为页面跳转所带来的参数  
    this.initEleWidth();
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var that = this
    initdata(that)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var collect = this.data.collect;
      // console.log("touchM :" + JSON.stringify(e))
      collect[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        collect: collect
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var collect = this.data.collect;
      // console.log("touchE :" + JSON.stringify(index))
      collect[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        collect: collect
      });
    }
  },
  //获取元素自适应后的实际宽度  
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
      // console.log(scale);  
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error  
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  deleteCollectionLists: function (e) {



  },
  //点击删除按钮事件  
  delItem: function (e) {
    console.log("删除" + JSON.stringify(e))
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      success: function (res) {
        if (res.confirm) {

          var id = e.currentTarget.dataset.collectid
          var deleId = vm.data.deleId
          deleId.push(id)
          vm.setData({
            deleId: deleId
          })
          var param = {
            id: vm.data.deleId
          }
          util.deleteCollectionLists(param, function (res) {
            console.log(JSON.stringify(res))
            vm.getCollectionLists()
            vm.setData({
              deleId: []
            })
          })

          //获取列表中要删除项的下标  
          var index = e.target.dataset.index;
          var collect = that.data.collect;
          //移除列表中下标为index的项  
          collect.splice(index, 1);
          //更新列表的状态  
          that.setData({
            collect: collect
          });
        } else {
          initdata(that)
        }
      }
    })

  },


  //跳转商品详情页
  jumpTravelDetails: function (e) {
    console.log("旅游详情" + JSON.stringify(e))
    var travelid = e.currentTarget.dataset.travelid
    wx.navigateTo({
      url: '/pages/travelDetails/travelDetails?travelid=' + travelid,
    })
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

  initcollect: function () {
    var collect = this.data.collect
    for (var i = 0; i < collect.length; i++) {
      collect[i].txtStyle = ""
    }
    that.setData({ collect: collect })
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

  onShareAppMessage: function () {
    var user_id = getApp().globalData.userInfo.id
    var organization_id = getApp().globalData.userInfo.organization_id
    return {
      title: "分享还会获得积分哦！",
      path: '/pages/index/index?share_user=' + user_id + '&organization_id=' + organization_id
    }
  },
  
})