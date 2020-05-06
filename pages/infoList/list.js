//index.js
//资讯列表
const app = getApp()

Page({
  data: {
    isShow: true,
    currentTab: 1,
    listWidth: '',
    menuData: [],
    tabItem: [],
    listHeight: 0
  },
  onReady: function () {
    
  },
  onLoad: function (e) {
    if (e.index > 0) {
      this.setData({
        currentTab: e.index
      })
    }
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      listWidth: systemInfo.windowWidth
    });
    app.ajax({
      url: app.api.infocategory,
      data: {
      },
      method: 'POST'
    }).then((res) => {
      if (res.data.code === 1) {
        let data = res.data.msg;
        let menuData = [];
        let tabItem = [];
        data.forEach((item) => {
          menuData.push(item.Name);
          tabItem.push({
            isShow: false,
            index: item.ID
          });
        });
        if (tabItem.length > 0) {
          tabItem[1].isShow = true;
        }
        this.setData({
          menuData,
          tabItem
        });
        this.setHeight();
      }
    }).catch((res) => {
      console.log(res)
    });
  },
  // 处理事件
  onTab(event) {
    var cur = event.currentTarget.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.isTab = true;
      this.data.tabItem[this.data.currentTab].isShow = false;
      this.data.tabItem[cur].isShow = true;
      this.setData({
        currentTab: cur,
        tabItem: this.data.tabItem
      })
    }
  },
  setHeight() {
    const that = this;
    let query = wx.createSelectorQuery().in(this)
    query.select('.tab-header').boundingClientRect()
    query.select('.footer').boundingClientRect().exec(res => {
      that.setData({
        listHeight: wx.getSystemInfoSync().windowHeight - res[0].height - res[1].height
      })
    });
  },
  switchTab(event) {
    if (this.isTab) {
      this.isTab = false;
      return;
    }
    var cur = event.detail.current;
    this.data.tabItem[cur].isShow = true;
    this.data.tabItem[this.data.currentTab].isShow = false;
    this.setData({
      currentTab: cur,
      tabItem: this.data.tabItem
    });
  }
})
