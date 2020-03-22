// components/component-tag-name.js
const app = getApp();
Component({
  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  /**
   * 组件的属性列表
   */
  properties: {
    url: {
      type: String,
      value: app.api.orderlist
    },
    isShow: {
      type: Boolean,
      value: false
    },
    status: {
      type: String,
      value: ''
    },
    method: {
      type: String,
      value: 'getCollects' // getCollects：我的收藏， getList：资讯列表， getOrder：订单列表
    },
    paddingTop: {
      type: Number,
      value: 50
    }
  },
  observers: {
    'isShow': function (val) {
      let type = this.data.method;
      if (val && !this._hasLoadData) {
        this[type]();
      }
      let show = !val ? 'tab-hide' : ''
      this.setData({
        showClass: show
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showClass: '',
    infoList: [],

    adsPage: 1,
    type: {
      '0': '待付款',
      '1': '待发货',
      '2': '待收货',
      '4': '已完成'
    },
    actions: {
      '0': '去付款',
      '1': '确认收货',
      '2': '确认收货',
      '4': '查看物流'
    },
    message: {
      getCollects: '亲，你的收藏为空哦！',
      getList: '暂无数据',
      getOrder: '亲，你还没有相关订单哟！'
    },
    _hasLoadData: false
  },
  ready: function() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      listHeight: systemInfo.windowHeight - this.data.paddingTop
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 滚动到底部获取数据
    lower() {
      let method = this.data.method;
      if (method == 'getCollects') {
        return false;
      }
      this[method]();
    },
    // 去支付
    pay(data) {
      wx.requestPayment({
        timeStamp: '',
        nonceStr: '',
        package: '',
        signType: 'MD5',
        paySign: '',
        success(res) { },
        fail(res) { }
      })
    },
    // 确认收货
    submitPay(data) {
      app.ajax({
        data: {
          id: data.ID,//订单ID
          status: 3//订单状态（3已收货、4确认完成）

        },
        url: app.api.updord,
        method: 'POST',
      }).then((data) => {
        if (res.data.code == 1) {
          wx.showToast({
            title: '确认收货',
            icon: 'success',
            duration: 2000
          });
        }
      });
    },
    onTap(e) {
      let data = e.currentTarget.dataset.item;
      switch (data.Status) {
        case '0': // 待付款
          this.pay(data);
          break;
        case '1': // 待发货
        case '2': // 待收货
          this.submitPay(data);
          break;
        case '4': // 已完成
          app.orderListItem = data;
          wx.navigateTo({
            url: '/pages/logistics/logistics-info'
          });
          break;
      }
    },
    // 获取我的收藏
    getCollects() {
      this._hasLoadData = true;
      app.ajax({
        data: {
        },
        url: app.api.collects,
        method: 'POST',
      }).then((data) => {
        if (res.data.code == 1) {
          this.setData({
            infoList: res.data.msg
          });
        } else {
          wx.showModal({
            title: '获取数据失败',
            content: res.data.msg
          });
        }
      });
    },
    // 获取我的账单
    getOrder() {
      var that = this;
      this._hasLoadData = true;
      if (this.isEnd) {
        return false;
      }
      app.ajax({
        data: {
          begin: '',
          end: '',
          status: this.data.status,
          index: this.data.adsPage
        },
        url: this.data.url,
        method: 'POST',
      }).then((data) => {
        if (res.data.code == 1) {
          let data = res.data.msg;
          const obj = {};
          obj.list = that.data.infoList.concat(data.list);
          if (obj.list.length > 10) {
            obj.adsPage = obj.adsPage + 1;
          } else {
            this.isEnd = true;
          }
          this.setData({
            infoList: obj.list,
            adsPage: obj.adsPage
          });
        } else {
          wx.showModal({
            title: '获取订单失败',
            content: res.data.msg
          });
        }
      });
    }
  }
})
