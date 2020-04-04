//index.js
const app = getApp()

Page({
  data: {
    details: {
      RecName: '',
      RecAddress: '',
      RecPhone: '',
      ECSNum: ''
    }
  },
  onLoad: function () {
    let detailsAddress = Object.assign({}, app.detailsAddress);
    delete app.detailsAddress;
    this.setData({
      details: detailsAddress
    })
  }
})
