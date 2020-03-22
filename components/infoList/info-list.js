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
    type: {
      type: String,
      value: 'list'
    },
    paddingTop: {
      type: Number,
      value: 50
    }
  },
  observers: {
    'isShow': function (val) {
      if (val && !this._hasLoadData) {
        this.getData();
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
    _hasLoadData: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 滚动到底部获取数据
    lower() {
      this.getData();
    },
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
          wx.showModal({
            title: '确认收货',
            content: '确认收货成功'
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
    getData() {
      var that = this;
      const systemInfo = wx.getSystemInfoSync();
      this._hasLoadData = true;
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
          obj.list = that.data.infoList.length > 0 ? that.data.infoList.concat(data.list) : data.list;
          if (obj.list.length > 10) obj.adsPage = obj.adsPage + 1;
          this.setData({
            listHeight: systemInfo.windowHeight - this.data.paddingTop,
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
