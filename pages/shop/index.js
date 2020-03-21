//shop.js
const app = getApp()
const api = app.api;

Page({
  data: {
    list: [],
    key: '',
    page: 1,
    height: wx.getSystemInfoSync().windowHeight,
    banner: [
      'https://image.seedit.com/sys/2020/02/08/b54dd7cee43fa8c5b353c9184e3f7658693628.jpg', 'https://image.seedit.com/sys/2020/02/08/67536dd2dabc741d7f88d3784e3d1a80801717.jpg', 'https://image.seedit.com/sys/2020/02/08/b4b68bdce8e154004526ed709c8bef02496360.jpg'
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500
  },
  onReady: function (e) {
  },
  getList: function () {
    app.ajax({
      url: api.pros,
      data: {
        key: this.data.key,
        index: this.data.page
      },
      method: 'POST'
    }).then(res => {
      if (res.data.code === 1) {
        const data = res.data.msg;
        const obj = {};
        if (data.list.length >= 10) obj.page = this.data.page + 1;
        for(let i = 0; i < data.list.length; i += 1) {
          data.list[i].Img = `${app.host}${data.list[i].Img}`;
        }
        obj.list = this.data.list.length > 0 ? this.data.list.concat(data.list) : data.list;
        this.setData(obj);
      }
    }).catch(res => {
      console.log(res)
    });
  },
  catchShopCart: function (e) {
    const id = e.currentTarget.dataset.id;
    console.log(id)
    app.ajax({
      url: api.addcart,
      data: {
        proid: id,//商品ID
        spid: "",//规格ID（可为空，如果该商品有规格，则该值必填）
        count: 1,//商品数量
        isbuy: "",//是否勾选购买
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
  bindToPage: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../detail/detail?type=shop&id=${id}`,
    })
  },
  onLoad: function () {
    const dataList = [];
    this.getList()
  }
})
