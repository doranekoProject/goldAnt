//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isShow: true,
    currentTab: 0,
    menuData: ['全部', '待付款', '待发货', '待收货', '已完成'],
    tabItem: [{
      isShow: true
    }, {
      isShow: false
    }, {
      isShow: false
    }, {
    isShow: false
    }, {
      isShow: false
    }]
  },
  onLoad: function () {
  },
  // 处理事件
  onTab(event) {
    console.log('ddd')
    var cur = event.currentTarget.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.data.tabItem[cur].isShow = true;
      this.setData({
        currentTab: cur,
        tabItem: this.data.tabItem
      })
    }
  },
  switchTab(event) {
    var cur = event.detail.current;
    this.data.tabItem[cur].isShow = true;
    this.setData({
      currentTab: cur,
      tabItem: this.data.tabItem
    });
  }
})
