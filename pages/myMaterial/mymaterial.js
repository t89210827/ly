// pages/myMaterial/mymaterial.js
var app = getApp()
var vm = null
var util = require('../../utils/util.js')
const qiniuUploader = require("../../utils/qiniuUploader");
var qnToken = ""
// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'ECN', // 华东区
    uptoken: qnToken
  };
  console.log("initQiniu options:" + JSON.stringify(options))
  qiniuUploader.init(options);
}

Page({
  data: {
    userInfo: [],
  },
  open: function () {
    wx.showActionSheet({
      itemList: ['男', '女'],
      success: function (res) {
        // console.log("11111" + JSON.stringify(res))
        if (!res.cancel) {
          console.log(res.tapIndex)
          vm.setData({
            'userInfo.gender': res.tapIndex + 1
          })
          // console.log("11111" + JSON.stringify(vm.data.userInfo.gender))
        }
      }
    });
  },
  //上传图片
  chooseImage: function (e) {
    // var count = 4 - vm.data.files.length
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log("tempFilePaths:" + JSON.stringify(tempFilePaths))
        wx.showLoading({
          title: '正在上传',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        //获取七牛上传token
        util.getQiniuToken({}, function (res) {
          console.log(JSON.stringify(res));
          if (res.data.result) {
            qnToken = res.data.ret;
            console.log("qiniu upload token:" + qnToken)
            initQiniu();
            //获取token成功后上传图片
            for (var i = 0; i < tempFilePaths.length; i++) {
              var tempFilePath = tempFilePaths[i]
              qiniuUploader.upload(tempFilePath, (res) => {
                console.log("qiniuUploader upload res:" + JSON.stringify(res));
                var picture = util.getImgRealUrl(res.key)
                app.globalData.userInfo.avatar = picture
                vm.setData({
                  'userInfo.avatar': picture
                })
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              })
            }
          }
        }, null);
      }
    })
  },
  onLoad: function (options) {
    vm = this
    var userInfo = app.globalData.userInfo
    console.log('userInfo' + JSON.stringify(userInfo))
    vm.setData({
      userInfo: userInfo
    })
  },

  nick_name: function (e) {
    vm.setData({
      'userInfo.nick_name': e.detail.value
    })
  },
  telephone: function (e) {
    vm.setData({
      'userInfo.telephone': e.detail.value
    })
    console.log("1111" + vm.data.userInfo.telephone)
  },
  email: function (e) {
    vm.setData({
      'userInfo.email': e.detail.value
    })
  },
  passport: function (e) {
    vm.setData({
      'userInfo.passport': e.detail.value
    })
  },
  saveUserInfo: function () {
    var param = {
      gender: vm.data.userInfo.gender,//姓名
      avatar: vm.data.userInfo.avatar,//头像
      telephone: vm.data.userInfo.telephone,//电话
      id_card: vm.data.userInfo.id_card,//身份证号
      email: vm.data.userInfo.email,//电子邮箱
      passport: vm.data.userInfo.passport,//护照
      sign: '',//签到天数
      background: ''//个人中心背景样式
    }
    util.updateUserInfo(param, function (res) {
      console.log("更新用户信息：" + JSON.stringify(res))
      getApp().login()
      // wx.setStorage({
      //   key: "userInfo",
      //   data: res.data.ret
      // });
      // app.globalData.userInfo = res.data.ret;
      wx.showModal({
        title: '成功',
        content: '资料修改成功',
        confirmColor: "#DF9E2D",
        showCancel: false,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var vm = this
    var userInfo = app.globalData.userInfo
    console.log("userInfo" + JSON.stringify(userInfo))
    vm.setData({
      userInfo: userInfo
    })
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