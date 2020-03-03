//index.js
const app = getApp()

Page({
  data: {
    addressList: []
  },
  onLoad: function () {
    app.ajax({
      url: app.api.addr,
      method: 'POST'
    }).then((res) => {
      let data = res.data;
      if (data.code != 1) {
        return false;
      }
      data.msg.forEach((item) => {
        item.detailsInfo = item.AreaID.replace(/,/g, '') + item.Address;
      });
      this.setData({
        addressList: data.msg
      })
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
