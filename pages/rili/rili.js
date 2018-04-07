'use strict';
var util = require('../../utils/util.js')
var vm = null
let choose_year = null,
  choose_month = null;
const conf = {
  // page({
  data: {
    hasEmptyGrid: false,
    showPicker: false,
    travelid: '',
    detail: [],
  },
  onLoad(options) {

    vm = this
    var travelid = options.travelid
    this.setData({
      travelid: travelid
    })
    this.getTourGoodsByTourGoodsId()  //获取余位及价格

  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },

  getTourGoodsByTourGoodsId: function () {
    var param = {
      tour_goods_id: this.data.travelid
    }
    util.getTourGoodsByTourGoodsId(param, function (res) {
      console.log("获取余位及金额：" + JSON.stringify(res))
      var detail = res.data.ret
      for (let i = 0; i < detail.length; i++) {
        detail[i].price = parseInt(detail[i].price)
      }
      vm.setData({
        detail: detail
      });

      const date = new Date();
      const cur_year = date.getFullYear();
      const cur_month = date.getMonth() + 1;
      const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
      vm.calculateEmptyGrids(cur_year, cur_month);
      vm.calculateDays(cur_year, cur_month);
      vm.setData({
        cur_year,
        cur_month,
        weeks_ch
      });

    })
  },

  calculateDays(year, month) {
    let days = [];
    let detail = vm.data.detail
    const thisMonthDays = this.getThisMonthDays(year, month);
    // console.log("年月" + JSON.stringify(year + "----" + month))
    for (let i = 1; i <= thisMonthDays; i++) {
      var date = year + "-" + month + "-" + i

      // console.log("日期：" + JSON.stringify(date))
      days.push({
        day: i,
        choosed: false
      });

    }

    for (let j = 0; j < detail.length; j++) {
      // console.log("日期：" + JSON.stringify(date + "---" + detail[j].date))
      for (let k = 1; k <= thisMonthDays; k++) {

        var month = ("0" + month).slice(-2);
        var day = ("0" + k).slice(-2);
        var date = year + "-" + month + "-" + day

        // console.log("-----" + JSON.stringify(date + "---" + detail[j].date))
        if (date == detail[j].date) {
          // console.log("days :----" + JSON.stringify(days[k-1]))
          days[k - 1] = {
            day: k,
            money: detail[j].price,
            site: detail[j].surplus,
            choosed: false
          }
        }
      }
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });
    }
  },

  //跳转到详情页
  tapDayItem(e) {
    // console.log("1111" + JSON.stringify(e))         
    console.log("点击日期" + JSON.stringify(e.currentTarget.dataset.idx + 1))

    const cur_year = this.data.cur_year
    const cur_month = this.data.cur_month
    var idx = e.currentTarget.dataset.idx;

    const days = this.data.days;
    days[idx].choosed = !days[idx].choosed;
    idx = idx + 1;
    console.log("333" + JSON.stringify(days))
    wx.navigateTo({
      url: '/pages/travelDetails/travelDetails?idx=' + idx + '&cur_month=' + cur_month + '&cur_year=' + cur_year + '&travelid=' + this.data.travelid
    })
    this.setData({
      days,
    });
  },
  chooseYearAndMonth() {
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    let picker_year = [],
      picker_month = [];
    for (let i = 1900; i <= 2100; i++) {
      picker_year.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      picker_month.push(i);
    }
    const idx_year = picker_year.indexOf(cur_year);
    const idx_month = picker_month.indexOf(cur_month);
    this.setData({
      picker_value: [idx_year, idx_month],
      picker_year,
      picker_month,
      showPicker: true,
    });
  },
  pickerChange(e) {
    const val = e.detail.value;
    choose_year = this.data.picker_year[val[0]];
    choose_month = this.data.picker_month[val[1]];
  },
  tapPickerBtn(e) {
    const type = e.currentTarget.dataset.type;
    const o = {
      showPicker: false,
    };
    if (type === 'confirm') {
      o.cur_year = choose_year;
      o.cur_month = choose_month;
      this.calculateEmptyGrids(choose_year, choose_month);
      this.calculateDays(choose_year, choose_month);
    }

    this.setData(o);
  },

  onShareAppMessage: function () {
    var user_id = getApp().globalData.userInfo.id
    if (app.globalData.userInfo.organization_id) {

      return {
        title: app.globalData.userInfo.organization_id,
        path: '/pages/index/index?share_user=' + user_id
      }
    }

  },

  // onShareAppMessage() {
  //   return {
  //     title: '小程序日历',
  //     desc: '旅游小程序',
  //     path: 'pages/index/index'
  //   };
  // }
};

Page(conf);
