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
    const typeText = ["充值", "兑换", "提现", '账单'];
    const type = !e.type ? 0 : e.type;
    let title = `${typeText[type]}记录`;
    let inout = type; 
    if (type == 3) {
      title = '账单明细';
      inout = '';
    }
    wx.setNavigationBarTitle({
      title
    });
    this.setData ({
      type,
      inout
    });
    this.getList();
  },
  getList: function (e) {
    const that = this;
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
        that.setData({
          list: that.data.list.concat(res.data.list)
        })
      } else {
        wx.showToast({
          icon: "none",
          title: res.data.msg
        })
      }
    }).catch(res => {
      console.elog(res);
    });
  },
  lower: function() {
    this.setData({
      page: this.data.page + 1
    })
    this.getList();
  }
})
