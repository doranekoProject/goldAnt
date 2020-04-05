//index.js
//关于我们
const app = getApp()

Page({
  data: {
    img: '',
    nickname: '',
    buttonShow: false,
    lv: 0
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
        const data = res.data.msg;
        let show = false;
        if (data.endtime) {
          var time = new Date().getTime() - new Date(data.endtime).getTime();
          time = parseInt(time / (1000 * 60 * 60 * 24));
          if (time <= 30) {
            show = true;
          }
        }
        this.setData({
          img: data.img,
          nickname: data.nickname,
          buttonShow: show,
          lv: data.lv
        });
      }
    }).catch((res) => {
      console.log(res)
    });
  }
})
