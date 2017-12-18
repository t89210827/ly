//app.js
//  
//                            _ooOoo_  
//                           o8888888o  
//                           88" . "88  
//                           (| -_- |)  
//                           O\  =  /O  
//                        ____/`---'\____  
//                      .'  \\|     |//  `.  
//                     /  \\|||  :  |||//  \  
//                    /  _||||| -:- |||||-  \  
//                    |   | \\\  -  /// |   |  
//                    | \_|  ''\---/''  |   |  
//                    \  .-\__  `-`  ___/-. /  
//                  ___`. .'  /--.--\  `. . __  
//               ."" '<  `.___\_<|>_/___.'  >'"".  
//              | | :  `- \`.;`\ _ /`;.`/ - ` : | |  
//              \  \ `-.   \_ __\ /__ _/   .-` /  /  
//         ======`-.____`-.___\_____/___.-`____.-'======  
//                            `=---='  
//        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
//                      佛祖保佑       永无BUG  

const util = require('./utils/util.js')
var vm = null
App({
  onLaunch: function () {
    //获取vm
    vm = this
    //获取用户缓存数据
    var userInfo = wx.getStorageSync("userInfo");
    console.log("local storage userInfo:" + JSON.stringify(userInfo));
    //如果没有缓存
    if (userInfo == null || userInfo == undefined || userInfo == "") {
      //调用登录接口
      vm.login(null);
    } else {
      vm.globalData.userInfo = wx.getStorageSync("userInfo");
      console.log("vm.globalData.userInfo:" + JSON.stringify(vm.globalData.userInfo));
    }
  },
  //监听小程序打开
  onShow: function () {

  },
  
  login: function (callBack) {
    // wx.login({
    //   success: function (res) {
    //     console.log("wx.login:" + JSON.stringify(res))
    //     if (res.code) {
    //       util.getOpenId({ code: res.code }, function (ret) {
    //         console.log("getOpenId:" + JSON.stringify(ret))
    //         var openId = ret.data.openid
    //         var param = {
    //           wx_id: openId
    //         }
    //         util.login(param, function (ret) {
    //           console.log("login:" + JSON.stringify(ret));
    //           if (ret.data.code == "200") {
    //             vm.storeUserInfo(ret.data.obj)
    //             vm.updateUserInfo(function (ret) {
    //             })
    //           }
    //         }, null);
    //       }, null);
    //     }
    //   }
    // })
  },
  //更新用户信息
  updateUserInfo: function (callBack) {
    //获取用户基本信息
    wx.getUserInfo({
      //成功
      success: function (res) {
        console.log("wx.getUserInfo success:" + JSON.stringify(res))
        var param = {
          nick_name: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
          phonenum: vm.globalData.userInfo.phonenum,
          gender: res.userInfo.gender,
          // type: vm.globalData.userInfo.type,
        }
        util.updateUserInfo(param, function (ret, err) {
          console.log("updateUserInfo ret:" + JSON.stringify(ret))
          //更新缓存及globalData
          if (ret.data.code == "200") {
            vm.storeUserInfo(ret.data.obj)
          }
        })
        callBack()
      },
      //失败
      fail: function (res) {
        console.log("wx.getUserInfo fail:" + JSON.stringify(res))
        //引导用户授权
        vm.showModal()
      },
      complete: function (res) {
        console.log("wx.getUserInfo complete:" + JSON.stringify(res))
      }
    })
  },
  storeUserInfo: function (obj) {
    console.log("storeUserInfo :" + JSON.stringify(obj));
    wx.setStorage({
      key: "userInfo",
      data: obj
    });
    vm.globalData.userInfo = obj;
  },
  getUserInfo: function (cb) {
    typeof cb == "function" && cb(vm.globalData.userInfo)
  },
  getSystemInfo: function (cb) {

    if (vm.globalData.systemInfo) {
      typeof cb == "function" && cb(vm.globalData.systemInfo)
    } else {
      wx.getSystemInfo({
        success: function (res) {
          vm.globalData.systemInfo = res
          typeof cb == "function" && cb(vm.globalData.systemInfo)
        }
      })
    }
  },
  //引导用户授权
  showModal: function () {
    wx.showModal({
      title: '提示',
      content: '若不授权获取用户信息，则读书有益的部分重要功能将无法使用；请点击【重新授权】——选中【用户信息】和【地理位置】方可使用。',
      showCancel: false,
      confirmText: "重新授权",
      success: function (res) {
        if (res.confirm) {
          vm.openSetting()
        }
      }
    })
  },
  //全局变量
  globalData: {
    userInfo: null,
    systemInfo: null,
  }
})