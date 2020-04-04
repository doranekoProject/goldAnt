// bill.js
const app = getApp()
const api = app.api;
Page({
  data: {
    userInfo: {},
    isRecharge: false,
  },
  bindBtn: function(e) {
    const popType = ["充值", "兑换"];
    const text = e.currentTarget.dataset.type ?  popType[e.currentTarget.dataset.type] : '';
    const type =  e.currentTarget.dataset.type;
    if (type  == 1 && this.data.userInfo.MScore <= 0) {
      return wx.showToast({
        title: '金币不足，无法兑换',
        icon: "none"
      })
    } else if (type  == 2 && this.data.userInfo.score <= 0) {
      return wx.showToast({
        title: '佣金不足，无法提现',
        icon: "none"
      })
    }
    if (type  == 2 && this.data.userInfo.score > 0) {
      return wx.navigateTo({
        url: "/pages/billList/list?type=other&value=this.data.userInfo.score"
      })
    }
    this.setData({
      isRecharge: !this.data.isRecharge,
      type: type,
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
    const that = this;
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
        if (res.data.code === 1) {
          const obj = res.data.msg;
          obj.success = function(e) {
            that.getInfo();
            wx.showToast({
              title: '充值成功~'
            });
          }
          obj.fail = function(e) {
            wx.showToast({
              icon: "none",
              title: '充值失败，请重试'
            });
            console.log('fail', e)
          }
          wx.requestPayment(obj);
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.msg
          });
        }
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
  getInfo: function () {
    app.ajax({
      url: api.userinfo,
      data: {
        id: wx.getStorageSync('userid').split('.')[0]
      },
      method: 'POST'
    }).then((res) => {
      if (res.data.code === 1) {
        const data = res.data;
        this.setData({
          userInfo: data.msg
        });
      } else {
        wx.showModal({
          title: '获取用户信息失败',
          content: res.data.msg
        });
      }
    }).catch((res) => {
      console.log(res)
    });
  },
  onShow: function () {
    this.getInfo();
  }
})
