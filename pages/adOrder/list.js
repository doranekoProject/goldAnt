// 广告订单
const app = getApp()

Page({
  data: {
    isShow: true,
    methodType: 'ads',
    currentTab: 0,
    listHeight: 0,
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
  onReady: function () {
    const that = this;
    let query = wx.createSelectorQuery().in(this)
    query.select('.tab-header').boundingClientRect().exec(res => {
      that.setData({
        listHeight: wx.getSystemInfoSync().windowHeight - res[0].height
      })
    });
  },
  onLoad: function (e) {
    this.currentTarget = 0;
    let title = '商品订单';
    let menuData;
    if (e.type == 'ads') {
      title = '广告订单';
      menuData = [{
        title: '全部',
        value: '',
        isShow: true
      }, {
        title: '待付款',
        value: '0',
        isShow: false
      }, {
        title: '待收货',
        value: '2',
        isShow: false
      }, {
        title: '已完成',
        value: '4',
        isShow: false
      }];
      this.setData({
        menuData
      });
    }
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
      this.tab = true;
      this.data.menuData[cur].isShow = true;
      this.data.menuData[this.currentTarget].isShow = false;
      this.currentTarget = cur;
      console.log(this.data.menuData);
      this.setData({
        currentTab: cur,
        menuData: this.data.menuData
      })
    }
  },
  switchTab(event) {
    if (this.tab) {
      this.tab = false;
      return;
    }
    console.log('cccc');
    var cur = event.detail.current;
    this.data.menuData[cur].isShow = true;
    this.data.menuData[this.currentTarget].isShow = false;
    this.currentTarget = cur;
    this.setData({
      currentTab: cur,
      menuData: this.data.menuData
    });
  }
})
