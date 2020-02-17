//homepage.js
const app = getApp()

Page({
  data: {
    list: [],
    height: wx.getSystemInfoSync().windowHeight
  },
  onReady: function () {
  },
  onLoad: function () {
    const dataList = [];
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
    })
  },
  lower: function () {
    const list = this.data.list;
    const data = {
      cover: 'https://profile.csdnimg.cn/5/D/E/3_a772116804',
      title: '1湛江市赤坎区安铺人鸡饭店',
      desc: '广东省湛江市赤坎区金城新区127号',
      cost: '38',
      location: '0.88'
    }
    list.push(data)
    this.setData({
      list: list,
    })
  }
})
