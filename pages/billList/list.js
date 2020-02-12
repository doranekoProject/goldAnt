// billList/list.js
const app = getApp()
Page({
  data: {
    list: [],
    height: wx.getSystemInfoSync().windowHeight
  },
  onLoad: function (e) {
    const typeText = ["充值", "兑换", "提现"];
    const type = !e.type ? typeText[0] : typeText[e.type];
    const list = [];

    wx.setNavigationBarTitle({
      title: `${type}记录`,
    });

    for (let i = 0; i < 20; i += 1) {
      const data = {
        desc: `${type}成功`,
        time: '2010.10.10',
        cost: Math.ceil(10 * (Math.random() * 8))
      }
      list.push(data);
    }
    this.setData ({
      list: list
    })
  },
  lower: function() {
    const data = this.data.list;
    data.push({
      desc: `新增成功`,
      time: '2010.10.10',
      cost: Math.ceil(10 * (Math.random() * 8))
    })
    this.setData({
      list: data
    })
  }
})
