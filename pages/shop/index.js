//shop.js
const app = getApp()
const api = app.api;
const utils = require('../../utils/util.js');

Page({
  data: {
    list: [],
    getCategory: [],
    key: '',
    page: 1,
    height: wx.getSystemInfoSync().windowHeight,
    banner: [],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500
  },
  onReady: function (e) {
  },
  getBanner: function (e) {
    app.ajax({
      url: api.proads,
      method: 'POST',
    }).then(res => {
      if (res.data.code === 1) {
        for (let i = 0; i < res.data.msg.length; i += 1) {
          res.data.msg.list[i].Img = `${app.host}${res.data.msg.list[i].Img}`;
          if (location != null && (data.list[i].X > 0 || data.list[i].Y > 0)) {
            data.list[i].location = utils.distanceCheck(data.list[i].X, location.longitude, data.list[i].Y, location.latitude);
          }
        }
        this.setData({
          banner: res.data.msg.list
        }); 
      }
    }).catch(res => {
      console.log(res)
    });
  },
  getCategory: function () {
    app.ajax({
      url: api.category,
      data: {
        type: 1
      },
      method: 'POST',
    }).then(res => {
      if (res.data.code === 1) {
        this.setData({
          getCategory: res.data.msg.list
        })
      } else {
        wx.showModal({
          title: '获取类型列表失败',
          content: res.data.msg
        });
      }
    }).catch(res => {
      console.log(res)
    });
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
        if (data.list.length >= 10) {
          obj.page = this.data.page + 1;
        } else {
          obj.lastPage = true;
        }
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
  bindToPage: function (e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type;
    if (type === 'allBusiness') {
      const name = e.currentTarget.dataset.name;
      wx.navigateTo({
        url: `../allBusiness/index?id=${id}&name=${name}`,
      })
    } else {
      wx.navigateTo({
        url: `../detail/detail?type=proinfo&id=${id}`,
      })
    }
  },
  lower: function(e) {
    if(!this.data.lastPage) this.getList();
  },
  onLoad: function () {
    this.getCategory();
    this.getBanner();
  },
  onShow: function () {
    this.getList()
  }
})
