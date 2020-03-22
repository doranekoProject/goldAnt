// bill.js
const app = getApp()
const api = app.api;
Page({
  data: {
    isRecharge: false,
  },
  bindBtn: function(e) {
    const popType = ["充值", "兑换"];
    const text = e.currentTarget.dataset.type ?  popType[e.currentTarget.dataset.type] : '';
    this.setData({
      isRecharge: !this.data.isRecharge,
      type: e.currentTarget.dataset.type,
      typeText: text
    })
  },
  inputValue: function (e) {
    this.setData({
      cost: e.detail.value
    })
  },
  submit: function () {
    const cost = this.data.cost;
    if (cost) {
      this.setData({
        isRecharge: !this.data.isRecharge,
      });
      app.ajax({
        url: api.recharge,
        data: {
          money: cost
        },
        method: 'POST',
      }).then(res => {
        wx.showToast({
          icon: "none",
          title: res.data.code === 1 ? '操作成功~' : res.data.msg
        })
      }).catch(res => {
        console.log(res);
      });
    } else {
      wx.showToast({
        icon: "none",
        title: '金额不能为空~'
      })
    }
  },
  onLoad: function () {
  }
})
