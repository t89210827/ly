var TESTMODE = false;
//服务器地址
var SERVER_URL = "https://nyfq.isart.me/api";
var DEBUG_URL = "http://localhost:5555/api";
var SERVER_URL = (TESTMODE) ? DEBUG_URL : SERVER_URL;

///////七牛相关///////////////////////////////////
//根据key值获取图片真实链接
function getImgRealUrl(key_v) {
  return "http://dsyy.isart.me/" + key_v;
}

//获取七牛URL，进行图片剪裁
function qiniuUrlTool(img_url, type) {
  if ((img_url == undefined || img_url == null) && type == "head_icon") {
    return "../../images/jiazai.png";
  }
  if (img_url == undefined || img_url == null) {
    return "";
  }
  var pos = img_url.indexOf("?");
  //alert(pos);
  if (pos != -1) {
    img_url = img_url.substr(0, pos);
  }
  var qn_img_url;
  switch (type) {
    case "travel_title":      //广告图片
      qn_img_url = img_url + "?imageView2/2/w/300/h/400/interlace/1";
      break;
    case "top_ad":      //广告图片
      qn_img_url = img_url + "?imageView2/2/w/640/h/330/interlace/1";
      break;
    case "folder_index":        //首页图片
      qn_img_url = img_url + "?imageView2/2/w/450/q/75/interlace/1";
      break;
    case "message_hi":        //首页图片
      qn_img_url = img_url + "?imageView2/2/w/710/h/360/interlace/1";
      break;
    case "work_step":           //编辑的画夹步骤
      qn_img_url = img_url + "?imageView2/2/w/750/interlace/1";
      break;
    case "user_hi":  //头像
      qn_img_url = img_url + "?imageView2/1/w/200/h/200/interlac12e/1";
    case "bar_detail":  //书吧详情页
      qn_img_url = img_url + "?imageView2/1/w/750/h/384/interlace/1";
    case "user_bg":  //我的背景
      qn_img_url = img_url + "?imageView2/1/w/750/interlace/1";
      break;
  }
  return qn_img_url;
}

//获取真实的七牛云存储链接
function getRealImgUrl(img_url) {
  //如果img_url为空
  if (judgeIsAnyNullStr(img_url)) {
    return img_url
  }
  var pos = img_url.indexOf("?");
  return img_url.substring(0, pos)
}

//是否还有本地图片
function isLocalImg(img) {
  if (judgeIsAnyNullStr(img)) {
    return false;
  }
  if (img.indexOf("wxfile") >= 0) {
    return true;
  }
  return false;
}

// 获取头像
function getHeadIconA(dir, hi) {
  // console.log(hi);
  if (hi == undefined || hi.length < 15) {
    if (dir == "html") {
      return "../image/default_head_logo.png";
    } else {
      return "../image/default_head_logo.png";
    }
  }
  if (hi.indexOf('7xku37.com') < 0) {
    return hi;
  }
  return qiniuUrlTool(hi, "head_icon");
}

///接口调用相关方法///////////////////////////////////////////

//进行接口调用的基本方法
function wxRequest(url, param, method, successCallback, errorCallback) {
  console.log("wxRequest url:" + JSON.stringify(url) + " param:" + JSON.stringify(param));
  // console.log("globalData userInfo:" + JSON.stringify(getApp().globalData.userInfo))
  if (!judgeIsAnyNullStr(getApp().globalData.userInfo)) {
    //user_id未设置
    if (judgeIsAnyNullStr(param.user_id)) {
      param.user_id = getApp().globalData.userInfo.id;
      // console.log("user_id" + getApp().globalData.userInfo.id);
    }
    param.token = getApp().globalData.userInfo.token;
  }
  console.log("param：" + JSON.stringify(param))
  wx.request({
    url: url,
    data: param,
    header: {
      "Content-Type": "application/json"
    },
    method: method,
    success: function (res) {
      successCallback(res)
      hideLoading()
    },
    fail: function (err) {
      console.log("wxRequest fail:" + JSON.stringify(err))
      errorCallback(err)
      hideLoading()
    }
  });
}

function test(param) {
  console.log(JSON.stringify("11"));
}

//http://localhost/nyfq/public/api/order/getOrders

//根据user_id和goods_type获取订单信息
function getOrders(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/order/getOrders', param, "GET", successCallback, errorCallback);
}

//获取抢票接口
function getTicketGoods(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/ticket/getTicketGoods', param, "GET", successCallback, errorCallback);
}

//根据id获取成型套餐
function getByIdCustomization(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/Customization/getByIdCustomization', param, "GET", successCallback, errorCallback);
}

//获取成型套餐列表
function getCustomization(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/Customization/getCustomization', param, "GET", successCallback, errorCallback);
}

//获取机票列表
function getTicket(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/airplane/getTicket', param, "GET", successCallback, errorCallback);
}

//获取酒店列表
function getHotel(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/hotel/getHotel', param, "GET", successCallback, errorCallback);
}

//获取车导列表
function getCar(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/car/getCar', param, "GET", successCallback, errorCallback);
}

//【旅行社端】修改兑换状态
function updateIntegralStatusById(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/integral/updateIntegralStatusById', param, "POST", successCallback, errorCallback);
}

//【旅行社端】获取积分兑换历史
function getIntegralHistoryListsForOrganization(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/integral/getIntegralHistoryListsForOrganization', param, "GET", successCallback, errorCallback);
}

//邀请朋友
function addInvitation(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/center/addInvitation', param, "GET", successCallback, errorCallback);
}

//我的邀请
function getMyInvitation(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/center/getMyInvitation', param, "GET", successCallback, errorCallback);
}

//添加评论回复
function addCommentReplie(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/comment/addCommentReplie', param, "POST", successCallback, errorCallback);
}

//删除订单
function deleteTourOrder(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/order/deleteTourOrder', param, "GET", successCallback, errorCallback);
}

//所有产品下单接口
function order(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/order/order', param, "POST", successCallback, errorCallback);
}

//查询所有订单
function getTourOrder(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/order/getTourOrder', param, "GET", successCallback, errorCallback);
}

//获取用户积分明细列表
function getIntegralDetaileLists(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/integral/getIntegralDetaileLists', param, "GET", successCallback, errorCallback);
}

//【游客端】获取积分兑换历史
function getIntegralHistoryListsForUser(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/integral/getIntegralHistoryListsForUser', param, "GET", successCallback, errorCallback);
}

//【游客端】兑换积分商品
function addIntegralHistory(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/integral/addIntegralHistory', param, "POST", successCallback, errorCallback);
}

//获取积分商城列表
function getIntegralLists(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/integral/getIntegralLists', param, "GET", successCallback, errorCallback);
}

//签到
function addSign(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/center/addSign', param, "POST", successCallback, errorCallback);
}

//删除收藏夹里的产品
function deleteCollectionLists(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/center/deleteCollectionLists', param, "POST", successCallback, errorCallback);
}

//根据用户id获取收藏夹列表
function getCollectionLists(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/center/getCollectionLists', param, "GET", successCallback, errorCallback);
}

//添加到收藏夹
function addCollectionGoods(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/center/addCollectionGoods', param, "POST", successCallback, errorCallback);
}

//获取旅游产品列表
function getTourGoodsLists(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/tour/getTourGoodsLists', param, "GET", successCallback, errorCallback);
}

//搜索
function search(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/index/search', param, "GET", successCallback, errorCallback);
}

//获取七牛Token
function getQiniuToken(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/getQiniuToken', param, "GET", successCallback, errorCallback);
}

//签到
function addSign(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/center/addSign', param, "POST", successCallback, errorCallback);
}

//添加评论
function addComment(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/comment/addComment', param, "POST", successCallback, errorCallback);
}

//产品点赞
function addConsent(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/comment/addConsent', param, "POST", successCallback, errorCallback);
}

//获取产品的评论详情
function getGoodsCommentLists(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/comment/getGoodsCommentLists', param, "GET", successCallback, errorCallback);
}

//获取旅游详情
function getTourGoodsDetail(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/tour/getTourGoodsDetail', param, "GET", successCallback, errorCallback);
}

//获取首页特价产品
function getSpecialGoods(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/index/getSpecialGoods', param, "GET", successCallback, errorCallback);
}

//根据id获取轮播图的详细信息
function getBannerDetail(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/index/getBannerDetail', param, "GET", successCallback, errorCallback);
}

//根据code获取openid
function getOpenId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/getXCXOpenId', param, "GET", successCallback, errorCallback);
}

//小程序登录
function login(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/login', param, "POST", successCallback, errorCallback);
}

//更新用户信息
function updateUserInfo(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/updateById', param, "POST", successCallback, errorCallback);
}

//获取首页轮播图
function getAds(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/index/getBanners', param, "GET", successCallback, errorCallback);
}

//获取首页的菜单信息
function getIndexMenus(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/index/getIndexMenus', param, "GET", successCallback, errorCallback);
}

//获取首页的最新产品列表
function getNewGoods(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/index/getNewGoods', param, "GET", successCallback, errorCallback);
}

//获取积分商品
function getGoods(param, successCallback, errorCallback) {
  wxRequest('https://zygw.isart.me/api/goods/getGoods', param, "GET", successCallback, errorCallback);
}

//根据type获取旅游产品
function getTourGoods(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/tour/getTourGoods', param, "GET", successCallback, errorCallback);
}

// http://localhost/nyfq/public/api/tour/getTourGoods

//返回
function navigateBack(delta) {
  wx.navigateBack({
    delta: delta
  })
}
//判断是否有空字符串
function judgeIsAnyNullStr() {
  if (arguments.length > 0) {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] == null || arguments[i] == "" || arguments[i] == undefined || arguments[i] == "undefined" || arguments[i] == "未设置") {
        return true;
      }
    }
  }
  return false;
}

//获取日期 2017-06-13
function getDateStr(str) {
  if (judgeIsAnyNullStr(str)) {
    return str
  }
  var pos = str.indexOf(' ');
  if (pos < 0) {
    return str
  }
  return str.substr(0, pos)
}
//格式化日期时间
// function formatTime(date) {
//   var year = date.getFullYear()
//   var month = date.getMonth() + 1
//   var day = date.getDate()
//   var hour = date.getHours()
//   var minute = date.getMinutes()
//   var second = date.getSeconds()
//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

//格式化日期时间
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//展示toast
function showToast(msg, img) {
  console.log(img);
  if (judgeIsAnyNullStr(img)) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 1500,
    })
  } else {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 1500,
      image: img
    })
  }
}
//展示modal
function showModal(title, content, confirmCallBack) {
  wx.showModal({
    title: title,
    content: content,
    // showCancel: false,
    confirmColor: "#ffcc00",
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        confirmCallBack(res)
      } else if (res.cancel) {
        console.log('用户点击取消')
        // cancelCallBack(res)
      }
    }
  })
}
//错误modal
function showErrorModal(msg) {
  wx.showModal({
    title: '调用失败',
    content: msg,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}
//展示loadding
function showLoading(msg) {
  if (!wx.canIUse('showLoading')) {
    return;
  }
  wx.showLoading({
    title: msg,
  })
}

//隐藏loadding
function hideLoading() {
  if (!wx.canIUse('hideLoading')) {
    return;
  }
  wx.hideLoading();
}
//优化字符串输出，如果str为空，则返回r_str
function conStr(str, r_str) {
  if (judgeIsAnyNullStr(str)) {
    return r_str;
  }
  return str;
}

function judgeIsAnyNullStrImp(obj) {
  if (obj.length > 0) {
    for (var i = 0; i < obj.length; i++) {
      var value = obj[i].value;
      var name = obj[i].name;
      if (value == null || value == "" || value == undefined || value == "未设置") {
        showToast("请设置" + convertEnNameToChiName(name), "../../images/close_icon.png");
        return true;
      }
    }
  }
  return false;
}

//util.js
function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽
  var originalHeight = e.detail.height;//图片原始高
  var originalScale = originalHeight / originalWidth;//图片高宽比
  console.log('originalWidth: ' + originalWidth)
  console.log('originalHeight: ' + originalHeight)
  //获取屏幕宽高
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth;//屏幕高宽比
      console.log('windowWidth: ' + windowWidth)
      console.log('windowHeight: ' + windowHeight)
      //图片缩放后的宽为屏幕宽
      imageSize.imageWidth = windowWidth;
      imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
    }
  })
  console.log('缩放后的宽: ' + imageSize.imageWidth)
  console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}

//富文本转文本
function convertHtmlToText(inputText) {
  var returnText = "" + inputText;
  returnText = returnText.replace(/<\/div>/ig, '\r\n');
  returnText = returnText.replace(/<\/li>/ig, '\r\n');
  returnText = returnText.replace(/<li>/ig, ' * ');
  returnText = returnText.replace(/<\/ul>/ig, '\r\n');
  //-- remove BR tags and replace them with line break
  returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

  //-- remove P and A tags but preserve what's inside of them
  returnText = returnText.replace(/<p.*?>/gi, "\r\n");
  returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

  //-- remove all inside SCRIPT and STYLE tags
  returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
  returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
  //-- remove all else
  returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

  //-- get rid of more than 2 multiple line breaks:
  returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

  //-- get rid of more than 2 spaces:
  returnText = returnText.replace(/ +(?= )/g, '');

  //-- get rid of html-encoded characters:
  returnText = returnText.replace(/ /gi, " ");
  returnText = returnText.replace(/&/gi, "&");
  returnText = returnText.replace(/"/gi, '"');
  returnText = returnText.replace(/</gi, '<');
  returnText = returnText.replace(/>/gi, '>');

  return returnText;
}





module.exports = {
  INDEX_PAGE: "/pages/index/index",
  judgeIsAnyNullStr: judgeIsAnyNullStr,
  getOpenId: getOpenId,
  login: login,
  updateUserInfo: updateUserInfo,
  getAds: getAds,
  getIndexMenus: getIndexMenus,
  getNewGoods: getNewGoods,
  getGoods: getGoods,
  getBannerDetail: getBannerDetail,
  getSpecialGoods: getSpecialGoods,
  formatTime: formatTime,
  getTourGoodsDetail: getTourGoodsDetail,
  getDateStr: getDateStr,
  convertHtmlToText: convertHtmlToText,
  getGoodsCommentLists: getGoodsCommentLists,
  addConsent: addConsent,
  addComment: addComment,
  getQiniuToken: getQiniuToken,
  getImgRealUrl: getImgRealUrl,
  search: search,
  getTourGoodsLists: getTourGoodsLists,
  showLoading: showLoading,
  addCollectionGoods: addCollectionGoods,
  getCollectionLists: getCollectionLists,
  deleteCollectionLists: deleteCollectionLists,
  addSign: addSign,
  getIntegralLists: getIntegralLists,
  addIntegralHistory: addIntegralHistory,
  getIntegralHistoryListsForUser: getIntegralHistoryListsForUser,
  getIntegralDetaileLists: getIntegralDetaileLists,
  order: order,
  getTourOrder: getTourOrder,
  deleteTourOrder: deleteTourOrder,
  addCommentReplie: addCommentReplie,
  getMyInvitation: getMyInvitation,
  addInvitation: addInvitation,
  getIntegralHistoryListsForOrganization: getIntegralHistoryListsForOrganization,
  updateIntegralStatusById: updateIntegralStatusById,
  showModal: showModal,
  getTicket: getTicket,
  getHotel: getHotel,
  getCar: getCar,
  getCustomization: getCustomization,
  getByIdCustomization: getByIdCustomization,
  qiniuUrlTool: qiniuUrlTool,
  getTourGoods: getTourGoods,
  getTicketGoods: getTicketGoods,
  getOrders: getOrders,
  imageUtil: imageUtil,
}