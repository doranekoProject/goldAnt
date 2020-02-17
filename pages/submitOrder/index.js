//submit Order.js
//获取应用实例
const app = getApp()

Page({
  data: {
    list: [],
    quantity: 1
  },
  onLoad: function () {
    const data = {
      cover: 'https://profile.csdnimg.cn/5/D/E/3_a772116804',
      title: '湛江市赤坎区安铺人鸡饭店',
      desc: '广东省湛江市赤坎区金城新区127号',
      cost: '38',
    }

    this.setData({
      list: data,
    })
    console.log(this.data.list)
  }
})
