Page({
  data: {
    navLeftItems: [],
    navRightItems: [],
    curNav: 1,
    curIndex: 0,

    //搜索
    inputShowed: false,
    inputVal: "",
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  onLoad: function () {
    // 加载的使用进行网络访问，把需要的数据设置到data数据对象  
    var that = this
    wx.request({
      url: 'http://huanqiuxiaozhen.com/wemall/goodstype/typebrandList',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          navLeftItems: res.data,
          navRightItems: res.data
        })
      }
    })
  },

  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },

  onShareAppMessage: function () {
    var user_id = getApp().globalData.userInfo.id
    return {
      title: getApp().globalData.userInfo.organization_id,
      path: '/pages/index/index?share_user=' + user_id
    }
  },

})  