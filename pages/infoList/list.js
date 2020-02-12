//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isShow: true,
    currentTab: 0,
    menuData: ['新闻', '资讯', '视频', '招聘'],
    tabItem: [{
      isShow: true
    }, {
      isShow: true
    }, {
      isShow: true
    }, {
      isShow: true
    }]
  },
  onLoad: function () {
  },
  // 处理事件
  onTab(event) {
    console.log(event)
    var cur = event.currentTarget.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  switchTab(event) {
    console.log(event);
    var cur = event.detail.current;
    this.setData({
      currentTab: cur
    });
  }
})
