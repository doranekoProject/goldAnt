//homepage.js
const app = getApp();
const api = app.api;
const globalData = app.globalData;
Page({
  data: {
    list: [],
    height: 0,
    quantity: 1,
    tabType: 0,
    config: {
      horizontal: false, 
      animation: true, // 过渡动画是否开启
      search: true, // 是否开启搜索
      searchHeight: 45, // 搜索条高度
      suctionTop: true // 是否开启标题吸顶
    }
  },
  onReady: function () {
    const that = this;
    let query = wx.createSelectorQuery().in(this)
    query.select('.home-bar').boundingClientRect()
    query.select('.home-filter').boundingClientRect().exec(res => {
      that.setData({
        height: wx.getSystemInfoSync().windowHeight - res[0].height - res[1].height
      })
    })
  },
  getArea: function () {
    wx.request({
      url: api.getarea,
      data: {},
      method: 'POST',
      success: function (res) { 
        console.log(res)
      },
      fail: function () { },
    });
  },
  onLoad: function () {
    if (globalData.area === null) this.getArea();
    wx.request({
      url: api.pros,
      data: {
        key: '',
        index: 1
      },
      method: 'POST',
      success: function () { },
      fail: function () { },
    });
    const dataList = [];
    const area =  [{
      name: '广州市',
      subtime: {
        arr: ['天河区', '海珠区', '荔弯区']
      }
    }]

    const place = [{
        name: '全部'
      },
      {
        name: '全超市部'
      },
      {
        name: '机场'
      },
    ]
    const online = [
      {
        name: '全选'
      },
      {
        name: '线上'
      },
      {
        name: '线下'
      },
    ]
    const data = {
      cover: 'https://profile.csdnimg.cn/5/D/E/3_a772116804',
      title: '湛江市赤坎区安铺人鸡饭店',
      desc: '广东省湛江市赤坎区金城新区127号',
      cost: '38',
      location: '0.88'
    }
    for (let i = 1; i < 20; i += 1) {
      dataList.push(data);
    }
    this.setData({
      list: dataList,
      area: area,
      place: place,
      online: online
    })
  },
  bindtap(e) {
    console.log(e.detail)
  },
  tab: function(e) {
    const type = e.currentTarget.dataset.type;
    const obj = {};
    if (this.data.tabType != '' && type == this.data.tabType) {
      obj.tabType = 0;
    } else {
      obj.tabType = type;
      obj.isSub = type != 1 ;
      obj.downList = type == 1 ? this.data.area : (type == 2 ? this.data.place : this.data.online);
    }
    this.setData(obj);
  }
})
