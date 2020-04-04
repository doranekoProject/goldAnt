//index.js
const app = getApp()

Page({
  data: {
    region: [],
    customItem: '全部',
    addressInfo: {
      aid: '',
      family: '',
      isdefault: '0',
      name: '',//收货人姓名
      address: '',//详细地址
      phone: ''//收货电话
    }
  },
  onLoad: function (options) {
    if (options.action === 'edit') {
      let  d = app.addressItem;
      let data = Object.assign({}, this.data.addressInfo, {
        name: d.TrueName,
        family: d.AreaID,
        address: d.Address,
        phone: d.Phone
      });
      let region = d.AreaID.split(',');
      this.setData({
        addressInfo: data,
        region: region
      })
    } else if (options.action === 'order') {
      this.setData({
        type: options.action
      })
    }
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  save() {
    this.data.addressInfo.family = this.data.region.join(',');
    app.ajax({
      url: app.api.updaddr,
      data: this.data.addressInfo,
      method: 'POST'
    }).then((res)=>{
      if (res.data.code == 1) {
        if (this.data.type === 'order') wx.setStorageSync('curAddrIndex', 0);
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000,
          success: function() {
            wx.navigateBack({
              delta: 1
            });

          }
        });
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
        console.log(res);
        var data = Object.assign({}, this.data.addressInfo, {
          name: res.userName,
          address: res.detailInfo,
          phone: res.telNumber
        });
        this.setData({
          addressInfo: data,
          region: [res.provinceName, res.cityName, res.countyName]
        });
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})
