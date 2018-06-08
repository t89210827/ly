// pages/writeComment/writeComment.js
var vm = null
var util = require('../../utils/util.js')
const qiniuUploader = require("../../utils/qiniuUploader")
var qnToken = '' //

//上传图片计数
var upload_img_count = 0;
var upload_img_arr = [];

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
    goods_id: '',       //旅游产品id
    intro: '',          //评论
    videos: [],         //视频
    Arraydata: []
  },
  //七牛上传图片
  chooseImage: function (e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 9,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        upload_img_arr = upload_img_arr.concat(res.tempFilePaths);
        vm.uploadImgProcess();
      }
    })
  },
  //进行图片上传
  uploadImgProcess: function () {
    if (upload_img_count > 8) {
      return;
    }
    if (upload_img_count >= upload_img_arr.length) {
      return;
    }
    qiniuUploader.upload(upload_img_arr[upload_img_count], (res) => {
      console.log("res:" + JSON.stringify(res))
      var picture = util.getImgRealUrl(res.key)
      var photoIndex = { 'content': picture, 'type': 1 }
      var files = vm.data.files
      var Arraydata = vm.data.Arraydata
      files.push(picture)
      Arraydata.push(photoIndex)
      vm.setData({
        files: files,
        Arraydata: Arraydata
      })
      upload_img_count++;
      vm.uploadImgProcess();

    }, (error) => {
      console.error('error: ' + JSON.stringify(error));
    })

  },

  //文字评论
  textAreaEventListener: function (e) {
    console.log("55555" + JSON.stringify(e.detail.value))
    vm.setData({
      intro: e.detail.value,
      // 'intro.content': e.detail.value
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
        // setTimeout(function () {
        //   wx.hideLoading()
        // }, 2000)
        //获取七牛上传token
        util.getQiniuToken({}, function (res) {
          console.log(JSON.stringify(res));
          if (res.data.result) {
            qnToken = res.data.ret;
            console.log("qiniu upload token:" + qnToken)
            initQiniu();
            wx.showLoading({
              title: '正在上传',
            })
            //获取token成功后上传图片
            qiniuUploader.upload(tempFilePath, (res) => {
              console.log("qiniuUploader upload res:" + JSON.stringify(res));
              var picture = util.getImgRealUrl(res.key)
              var dataVideos = vm.data.videos                     //视频数组
              var Arraydata = vm.data.Arraydata
              var videos = { 'content': picture, 'type': 2 }
              dataVideos.push(picture)//添加用户上传    视频视频
              Arraydata.push(videos)//添加用户上传视频 到 参数数组
              vm.setData({
                videos: dataVideos,
                Arraydata: Arraydata,
              })
              wx.hideLoading()
              console.log("数据数组2" + JSON.stringify(Arraydata))
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
      media: vm.data.Arraydata//	上传的多媒体数组
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
    initQiniu();
    //获取七牛上传token
    util.getQiniuToken({}, function (res) {
      console.log(JSON.stringify(res));
      if (res.data.result) {
        qnToken = res.data.ret;
        console.log("qiniu upload token:" + qnToken)

      }
    }, null);
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
    var organization_id = getApp().globalData.userInfo.organization_id
    return {
      title: "分享还会获得积分哦！",
      path: '/pages/index/index?share_user=' + user_id + '&organization_id=' + organization_id
    }
  },
})