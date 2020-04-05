//index.js
//关于我们
const app = getApp()

Page({
  data: {
    img: '',
    nickname: ''
  },
  onLoad: function () {
    this.getInfo();
  },
  onTap() {
    app.ajax({
      url: app.api.uplv,
      data: {
        id: wx.getStorageSync('userid').split('.')[0]
      },
      method: 'POST'
    }).then((res) => {
      if (res.data.code === 1) {
        const obj = res.data.msg;
        obj.success = function (e) {
          wx.navigateBack()
        }
        obj.fail = function (e) {
          wx.showToast({
            icon: "none",
            title: '支付失败，请重试'
          });
        }
        wx.requestPayment(obj);
      }
    }).catch((res) => {
      console.log(res)
    });
  },
  getInfo: function () {
    app.ajax({
      url: app.api.userinfo,
      data: {
        id: wx.getStorageSync('userid').split('.')[0]
      },
      method: 'POST'
    }).then((res) => {
      if (res.data.code === 1) {
        const data = res.data;
        console.log(data.msg);
        this.setData({
          img: data.msg.img,
          nickname: data.msg.nickname
        });
      }
    }).catch((res) => {
      console.log(res)
    });
  }
})
