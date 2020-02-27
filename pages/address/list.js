//index.js
const app = getApp()

Page({
  data: {
    addressList: [{
      ID: '11',//收货地址ID，主键
      TrueName: '李丽丽',//收货人姓名
      AreaID: '广东省,佛上市,顺德区',//地区的Family
      Address: '顶顶顶顶',//详细地址
      detailsInfo: '',
      Phone: '11111111',//收货电话
      isdefault: true,
      Status: '1',//状态，1为显示，2为不显示

    }]
  },
  onLoad: function () {
    let address = this.data.addressList[0];
    address.detailsInfo = address.AreaID.replace(/,/g, '') + address.Address;
    this.setData({
      addressList: [address]
    });
    wx.request({
      url: app.api.addr,
      success(res) {
        let data = res.data;
        if (data.code !=1) {
          return false;
        }
        data.data.forEach((item) => {
          item.detailsInfo = item.AreaID.replace(/,/g, '') + item.Address;
        });
        this.setData({
          addressList: data.data
        })
        console.log(data);
      }
    });
  },
  bindtap(e) {
    let aid = e.currentTarget.dataset.aid;
    wx.request({
      url: app.api.deladdr,
      data: {
        aid
      },
      method: 'POST',
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
  edit(e) {
    let data = e.currentTarget.dataset.item;
    app.addressItem = data;
    wx.navigateTo({
      url: '/pages/address/edit?action=edit'
    });
  }
})
