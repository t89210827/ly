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
var share_user = null
var travelid = null
// var organization_id = "南洋风情"
App({
  onLaunch: function (e) {
    console.log("onLaunch  ---------" + JSON.stringify(e))

    if (!util.judgeIsAnyNullStr(e.query.share_user)) {
      share_user = e.query.share_user
      // organization_id = e.query.organization_id
      console.log("分享人  ---------" + share_user)
    }

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
      // vm.login(null);
      vm.globalData.userInfo = wx.getStorageSync("userInfo");
      console.log("vm.globalData.userInfo:" + JSON.stringify(vm.globalData.userInfo));
    }
  },
  //监听小程序打开
  onShow: function () {

  },
  login: function (userInfoCallback) {
    // console.log("登陆接口")
    wx.login({
      success: function (res) {
        console.log("登陆接口:" + JSON.stringify(res))
        if (res.code) {
          var code = res.code

          //获取用户信息
          wx.getUserInfo({
            success: function (res) {
              console.log('用户信息 : ' + JSON.stringify(res))
              var userInfo = res.userInfo;

              util.getOpenId({ code: code }, function (ret) {
                console.log("openid:" + JSON.stringify(ret.data.ret.openid))
                var openId = ret.data.ret.openid
                // vm.updateUserInfo()
                if (share_user == null) {
                  var param = {
                    account_type: 'xcx',
                    open_id: openId,

                    gender: userInfo.gender,
                    nick_name: userInfo.nickName,
                    avatar: userInfo.avatarUrl,
                  }
                } else {
                  var param = {
                    account_type: 'xcx',
                    open_id: openId,
                    share_user: share_user,

                    // organization_id: organization_id,
                    nick_name: userInfo.nickName,
                    avatar: userInfo.avatarUrl,
                    gender: userInfo.gender,
                  }
                }
                util.login(param, function (ret) {
                  console.log("登陆接口参数:" + JSON.stringify(param));
                  console.log("登陆接口返回参数:" + JSON.stringify(ret));
                  if (ret.data.code == "200") {
                    vm.storeUserInfo(ret.data.ret)

                    typeof userInfoCallback == "function" && userInfoCallback(vm.globalData.userInfo)

                    if (util.judgeIsAnyNullStr(ret.data.ret.nick_name)) {
                      vm.updateUserInfo(function (ret) { })
                    }
                  }
                }, null);
              }, null);

            },
            fail: function (res) {
              console.log('getUserInfo fail res is:' + JSON.stringify(res));
              vm.showModal();
            }
          })

        }
      }
    })

  },
  //存数据到缓存
  storeUserInfo: function (obj) {
    console.log("storeUserInfo :" + JSON.stringify(obj));
    wx.setStorage({
      key: "userInfo",
      data: obj
    });
    vm.globalData.userInfo = obj;
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
          gender: res.userInfo.gender,
          avatar: res.userInfo.avatarUrl,
        }
        util.updateUserInfo(param, function (ret, err) {
          console.log("updateUserInfo ret:" + JSON.stringify(ret))
          //更新缓存及globalData
          if (ret.data.code == "200") {
            vm.storeUserInfo(ret.data.ret)
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
      content: '若不授权获取用户信息，则小程序的部分重要功能将无法使用；请点击【重新授权',
      showCancel: false,
      confirmText: "重新授权",
      success: function (res) {
        if (res.confirm) {
          // vm.openSetting()
          wx.openSetting({
            success: (res) => {
              console.log("重新授权 ： " + JSON.stringify(res))
            }
          })
        }
      }
    })
  },
  //全局变量
  globalData: {
    baseUrl: 'https://api.it120.cc/jy02149522',
    userInfo: null,
    systemInfo: null,
  }
})