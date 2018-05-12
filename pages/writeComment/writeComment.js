// pages/writeComment/writeComment.js
var vm = null
var util = require('../../utils/util.js')
const qiniuUploader = require("../../utils/qiniuUploader")
var qnToken = ''
var Arraydata = [] //
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
    files: [],          //图片数组
    goods_id: '',//旅游产品id
    intro: '',//评论
    videos: []//视频
  },
  textAreaEventListener: function (e) {
    console.log("55555" + JSON.stringify(e.detail.value))
    vm.setData({
      intro: e.detail.value,
      // 'intro.content': e.detail.value
    })
  },
  //七牛上传图片
  chooseImage: function (e) {
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

            var files = vm.data.files
            //获取token成功后上传图片
            // for (var i = 0; i < tempFilePaths.length; i++) {
            for (var i = 0; i < 8; i++) {
              var tempFilePath = tempFilePaths[i]
              qiniuUploader.upload(tempFilePath, (res) => {
                var picture = util.getImgRealUrl(res.key)
                console.log("七牛云上传返回:" + JSON.stringify(picture));
                var photoIndex = { 'content': picture, 'type': 1 }
                Arraydata.push(photoIndex)
                files.push(picture)
                vm.setData({
                  // photo: Arraydata,
                  files: files
                })
                console.log("数据数组" + JSON.stringify(files))
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              })
            }

          }
        }, null);
      }
    })
  },

  //预览图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  //七牛上传视频
  bindButtonTap: function () {
    var vm = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log("tempFilePaths:" + JSON.stringify(res.tempFilePath))
        var tempFilePath = res.tempFilePath
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
            qiniuUploader.upload(tempFilePath, (res) => {
              console.log("qiniuUploader upload res:" + JSON.stringify(res));
              var picture = util.getImgRealUrl(res.key)
              var dataVideos = vm.data.videos                     //视频数组

              var videos = { 'content': picture, 'type': 2 }
              dataVideos.push(picture)//添加用户上传    视频视频
              Arraydata.push(videos)//添加用户上传视频 到 参数数组
              vm.setData({
                // photo: Arraydata,
                videos: dataVideos,
                // src: res.tempFilePath
              })
              console.log("数据数组" + JSON.stringify(dataVideos))
            }, (error) => {
              console.error('error: ' + JSON.stringify(error));
            })
          }
        }, null);
      }
    })
  },

  affirm: function () {
    wx.showModal({
      title: '确定',
      content: '确定要提交评论吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          vm.addComment()

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //发布评论
  addComment: function () {
    console.log("555555555555")
    var param = {
      content: vm.data.intro,//评论的文本内容
      goods_id: vm.data.goods_id,//产品编号
      goods_type: 1,//产品类型（备注）
      // media: vm.data.photo//	上传的多媒体数组
      media: Arraydata//	上传的多媒体数组
    }
    util.addComment(param, function (res) {
      console.log("用户点评" + JSON.stringify(res))
      wx.navigateBack({
        delta: 1
      })
      var pages = getCurrentPages()
      var page = pages[pages.length - 2]
      page.showtoast()
      // wx.showToast({
      //   title: '评价审核通过后才能展示出来，请耐心等待',
      //   icon: 'none',
      //   duration: 4000
      // })
    })
  },

  onLoad: function (options) {
    vm = this
    console.log(options.goods_id)
    vm.setData({
      goods_id: options.goods_id
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
    var user_id = getApp().globalData.userInfo.id
    return {
      title: getApp().globalData.userInfo.organization_id,
      path: '/pages/index/index?share_user=' + user_id
    }
  },
})