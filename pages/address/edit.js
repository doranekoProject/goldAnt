//index.js
const app = getApp()

Page({
  data: {
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    addressInfo: {
      userName: '',
      provinceName: '',
      cityName: '',
      countyName: '',
      detailInfo: '',
      telNumber: ''
    }
  },
  onLoad: function () {
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  save() {
    this.data.addressInfo.provinceName = this.data.region[0];
    this.data.addressInfo.cityName = this.data.region[1];
    this.data.addressInfo.countyName = this.data.region[2];
    console.log(this.data);
  },
  bindKeyInput: function (e) {
    var name = e.currentTarget.dataset.modal;
    this.data.addressInfo[name] = e.detail.value;
  },
  chooseAddress() {
    wx.chooseAddress({
      success: (res) => {
        console.log(res);
        this.setData({
          addressInfo: res
        });
        this.setData({
          region: [res.provinceName, res.cityName, res.countyName]
        });
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})
