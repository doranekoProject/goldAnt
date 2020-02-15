//index.js
//关于我们
const app = getApp()

Page({
  data: {
    title: '金蚁广告商城',
    content: ''
  },
  onLoad: function () {
    this.setData({
      title: '金蚁广告商城',
      content: '<img src="https://img-blog.csdnimg.cn/20190927151132530.png"></img><p>内容内容</p>'
    });
  },
})
