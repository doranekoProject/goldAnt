// billList/list.js
const app = getApp()
Page({
  data: {
    list: [],
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
  lower: function() {
    const data = this.data.list;
    data.push({
      desc: `新增成功`,
      time: '2010.10.10',
      symbolTag: '-',
      cost: Math.ceil(10 * (Math.random() * 8))
    })
    this.setData({
      list: data
    })
  }
})
