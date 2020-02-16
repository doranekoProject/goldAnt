//index.js
//关于我们
const app = getApp()

Page({
  data: {
    addressInfo: {
      
    }
  },
  onLoad: function () {
  },
  bindKeyInput: function (e) {
    var name = e.currentTarget.dataset.modal;
    this.data.addressInfo[name] = e.detail.value;
  },
})
