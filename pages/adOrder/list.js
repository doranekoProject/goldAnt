// 广告订单
const app = getApp()

Page({
  data: {
    isShow: true,
    methodType: 'ads',
    currentTab: 0,
    menuData: [{
      title: '全部',
      value: '',
      isShow: true
    }, {
        title: '待付款',
        value: '0',
        isShow: false
      }, {
        title: '待发货',
        value: '1',
        isShow: false
      }, {
        title: '待收货',
        value: '2',
        isShow: false
      }, {
        title: '已完成',
        value: '4',
        isShow: false
      }]
  },
  onLoad: function (e) {
    const title = e.type == 'ads' ? '广告订单': '商品订单';
    wx.setNavigationBarTitle({
      title
    });
    this.setData({
      methodType: e.type
    })
  },
  // 处理事件
  onTab(event) {
    var cur = event.currentTarget.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.data.menuData[cur].isShow = true;
      this.setData({
        currentTab: cur,
        menuData: this.data.menuData
      })
    }
  },
  switchTab(event) {
    var cur = event.detail.current;
    this.data.menuData[cur].isShow = true;
    this.setData({
      currentTab: cur,
      menuData: this.data.menuData
    });
  }
})
