// bill.js
const app = getApp()
Page({
  data: {
    isRecharge: false,
  },
  bindBtn: function(e) {
    const popType = ["充值", "兑换", "提现"];
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
    if (this.data.cost) {
      this.setData({
        isRecharge: !this.data.isRecharge,
      })
      wx.showToast({
        icon: "none",
        title: '操作成功~'
      })
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
