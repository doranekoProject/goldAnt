//detail.js
const app = getApp()
const api = app.api;
Page({
  data: {
    banner: [
      'https://image.seedit.com/sys/2020/02/08/b54dd7cee43fa8c5b353c9184e3f7658693628.jpg', 'https://image.seedit.com/sys/2020/02/08/67536dd2dabc741d7f88d3784e3d1a80801717.jpg', 'https://image.seedit.com/sys/2020/02/08/b4b68bdce8e154004526ed709c8bef02496360.jpg'
      ],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    isSeletePop: false,
    quantity: 1
  },
  onReady: function () {
   
  },
  onLoad: function (e) {
    const page = e.type || 'adsinfo';
    const id = 'd9a9fcd7-5f04-4e8c-b482-e70e1f265b0d' //e.id;
    const that =  this;
    this.setData({
      page,
      id
    })
    app.ajax({
      url: api[page],
      data: {
        pid: id
      },
      method: 'POST',
    }).then(res => {
      if (res.data.code === 1) {
        res.data.msg.ImgList = res.data.msg.ImgList.split(';')
        console.log(res.data.msg.ImgList)
        for (let i = 0; i < res.data.msg.ImgList.length; i += 1) {
          res.data.msg.ImgList[i] = `${app.host}${res.data.msg.ImgList[i]}`;
        }
        that.setData({
          detail: res.data.msg
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }).catch(res => {
      console.log(res)
    })
  },
  bindAddcollect: function (e) {
    app.ajax({
      url: api.addcollect,
      data: {
        proid: this.data.id
      },
      method: 'POST',
    }).then(res => {
      if (res.data.code === 1) {
        wx.showToast({
          title: '收藏成功',
          icon: "none"
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }).catch(res => {
      console.log(res)
    })
  },
  catchShopCart: function (e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      isSeletePop: !this.data.isSeletePop
    })
    console.log(item)
    app.ajax({
      url: api.addcart,
      data: {
        proid: item.ID,//商品ID
        spid: item.ShopID,//规格ID（可为空，如果该商品有规格，则该值必填）
        count: 1,//商品数量
        isbuy: 1,//是否勾选购买
      },
      method: 'POST'
    }).then(res => {
      if (res.data.code != 1) {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        });
      } else {
        wx.showToast({
          title: '添加成功',
        })
      }
    }).catch(res => {
      wx.showModal({
        title: '提示',
        content: res,
      });
    });
  },
  seletePop: function() {
    this.setData({
      isSeletePop: !this.data.isSeletePop
    })
  }
})
