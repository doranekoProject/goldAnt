//index.js
//关于我们
const app = getApp()

Page({
  data: {
    addressInfo: {
      shopname: '', //店铺名称
      name: '', //联系人名称
      phone: '', //联系电话
      address: '' //店铺地址
    }
  },
  onLoad: function () {
  },
  bindKeyInput: function (e) {
    var name = e.currentTarget.dataset.modal;
    this.data.addressInfo[name] = e.detail.value;
  },
  submit() {
    app.ajax({
      data: this.data.addressInfo,
      url: app.api.applyshop,
      method: 'POST',
    }).then((res) => {
      if (res.data.code == 1) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            wx.navigateBack({
              delta: 1
            });
          }
        });
      } else {
        wx.showModal({
          title: '失败',
          content: res.data.msg
        });
      }
    });
  }
})
