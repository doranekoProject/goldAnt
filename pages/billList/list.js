// billList/list.js
const app = getApp()
const api = app.api
Page({
  data: {
    type: 0 ,// 1为收入，0为支出，
    list: [],
    page: 1,
    height: wx.getSystemInfoSync().windowHeight
  },
  onLoad: function (e) {
    const typeText = ["充值", "兑换", "提现", '账单'];
    const type = !e.type ? 0 : e.type;
    console.log(type);
    const list = [];
    let title = type === '3' ? '账单明细' : `${typeText[type]}记录`;
    wx.setNavigationBarTitle({
      title
    });
    for (let i = 0; i < 20; i += 1) {
      const data = {
        desc: `${typeText[type]}成功`,
        time: '2010.10.10',
        symbolTag: '+',
        cost: Math.ceil(10 * (Math.random() * 8))
      }
      list.push(data);
    }
    this.setData ({
      list: list,
      type: type
    })
  },
  getList: function (e) {
    const that = this;
    app.ajax({
      url: api.paylist,
      data: {
        date: '',
        inout: that.data.type,
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
