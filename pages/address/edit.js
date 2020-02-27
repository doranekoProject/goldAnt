//index.js
const app = getApp()

Page({
  data: {
    region: [],
    customItem: '全部',
    addressInfo: {
      family: '',
      name: '',//收货人姓名
      address: '',//详细地址
      phone: ''//收货电话
    }
  },
  onLoad: function (options) {
    if (options.action === 'edit') {
      let  d = app.addressItem;
      let data = {
        name: d.TrueName,
        family: d.AreaID, 
        address: d.Address, 
        phone: d.Phone
      };
      let region = d.AreaID.split(',');
      this.setData({
        addressInfo: data,
        region: region
      })
    }
    
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  save() {
    this.data.family = this.data.region.join(',');
    wx.request({
      url: app.api.updaddr,
      success(res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          });
        }
      }
    });
  },
  bindKeyInput: function (e) {
    var name = e.currentTarget.dataset.modal;
    this.data.addressInfo[name] = e.detail.value;
  },
  chooseAddress() {
    wx.chooseAddress({
      success: (res) => {
        var data = {
          name: res.userName,
          adress: res.detailInfo,
          phone: res.telNumber
        }
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
