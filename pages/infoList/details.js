//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    title: '',
    date: '',
    content: ''
  },
  onLoad: function () {
    this.setData({
      title: '北欧现代简约餐厅吊灯创意三头餐厅灯具艺术',
      date: '2019-01-01',
      content: '<img src="https://img-blog.csdnimg.cn/20190927151132530.png"></img><p>内容内容</p>'
    });
  },
})
