// billList/list.js
const app = getApp()
const api = app.api
Page({
  data: {
    type: 0 ,// 1为收入，0为支出，
    inout: '',
    list: [],
    page: 1,
    height: wx.getSystemInfoSync().windowHeight
  },
  onLoad: function (e) {
    const typeText = {
      '0': '充值记录',
      '4': '提现记录',
      'account': '账单明细',
      'other': '提现'
    };
    const type = !e.type ? 0 : e.type;
    let title = typeText[type];
    let inout = type; 
    if (type == 'account') {
      inout = '';
    }
    wx.setNavigationBarTitle({
      title
    });
    this.setData ({
      type,
      inout
    });
    if (type != 'other') {
      this.getAccountList();
    }
  },
  // 获取账单明细
  getAccountList: function (e) {
    const that = this;
    if (this.isEnd) {
      return false;
    }
    app.ajax({
      url: api.paylist,
      data: {
        date: '',
        inout: that.data.inout,
        index: that.data.page
      },
      method: 'POST',
    }).then(res => {
      if (res.data.code === 1) {
        let d = res.data.msg.list;
        let page = that.data.page;
        if (d.length >= 10) {
          page = page +1;
        } else {
          this.isEnd = true;
        }
        that.setData({
          page,
          list: that.data.list.concat(d)
        })
      } else {
        wx.showToast({
          icon: "none",
          title: res.data.msg
        })
      }
    }).catch(res => {
      console.log(res);
    });
  },
  lower: function() {
    this.getAccountList();
  }
})
