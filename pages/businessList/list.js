//index.js
const app = getApp()

Page({
data: {
  host: '',
  infoList: {}
},
onLoad: function (e) {
  app.ajax({
    url: app.api.shoplist,
    data: {},
    method: 'POST'
  }).then((res) => {
    if (res.data.code === 1) {
      this.setData({
        infoList: res.data.msg,
        host: app.host,
      });
    }
  }).catch((res) => {
    console.log(res)
  });
}
})
