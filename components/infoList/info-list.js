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
    methodType: {
      type: String,
      value: 'ads'
    },
    method: {
      type: String,
      value: 'getCollects' // getCollects：我的收藏， getList：资讯列表， getOrder：订单列表
    },
    listStatus: {
      type: Number,
      value: 1
    },
    paddingTop: {
      type: Number,
      value: 50
    }
  },
  observers: {
    'isShow': function (val) {
      let type = this.data.method;
      let show = !val ? 'tab-hide' : ''
      this.setData({
        infoList: [],
        adsPage: 1,
        showClass: show
      });
      this.isEnd = false;
      
      setTimeout(() => {
        if (val) {
          if (this.data.methodType == 'ads' || this.data.methodType == 'goods') {
            this.getInfo();
          }
          console.log(type);
          this[type](this.data.methodType);
        }
      }, 10);
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showClass: '',
    infoList: [],
    userinfo: {},
    walletType: '',
    show: false,
    adsPage: 1,
    type: {
      '0': '待付款',
      '1': '待发货',
      '2': '待收货',
      '4': '已完成',
      '5': '已退货'
    },
    actions: {
      '0': '去付款',
      '2': '确认收货',
      '4': '退货'
    },
    message: {
      getCollects: '亲，你的收藏为空哦！',
      getList: '暂无数据',
      getOrder: '亲，你还没有相关订单哟！'
    }
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
    bindWallet: function (e) {
      const type = e.currentTarget.dataset.type;
      let price = this.currentData.Price;

      if (type != 'weixin' && this.data.userInfo[type] < price) {
        return wx.showToast({
          title: `您的${type === 'balance' ? '余额' : '积分'}不足`,
          icon: 'none'
        });
      }
      this.setData({
        walletType: this.data.walletType === type ? '' : type
      })
    },
    getInfo: function () {
      app.ajax({
        url: app.api.userinfo,
        data: {
          id: wx.getStorageSync('userid').split('.')[0]
        },
        method: 'POST'
      }).then((res) => {
        if (res.data.code === 1) {
          const data = res.data;
          this.setData({
            userInfo: data.msg
          });
        } else {
          wx.showModal({
            title: '获取用户信息失败',
            content: res.data.msg
          });
        }
      }).catch((res) => {
        console.log(res)
      });
    },
    hideMask() {
      this.setData({
        show: false
      })
    },
    getList() {
      var that = this;
      if (this.isEnd) {
        return false;
      }
      app.ajax({
        data: {
          type: this.data.listStatus
        },
        url: app.api.infolist,
        method: 'POST',
      }).then((res) => {
        if (res.data.code == 1) {
          let data = res.data.msg;
          const obj = {
            adsPage: that.data.adsPage
          };
          obj.list = that.data.infoList.concat(data);
          if (data.length >= 10) {
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
    },
    bindSumbit: function () {
      let _this = this;
      let data = this.currentData;
      let paytype = this.data.walletType === 'balance' ? 1 : (this.data.walletType === 'score' ? 2 : 0)
      app.ajax({
        data: {
          id: data.ID,
          paytype
        },
        url: app.api.pay,
        method: 'POST',
      }).then((res) => {
        if (res.data.code == 1) {
          if (paytype !== 0) {
            _this.setData({
              adsPage: 1,
              infoList: [],
              show: false
            });
            this.isEnd = false;
            _this.currentData = null;
            _this.getOrder();
            return false;
          }
          const obj = res.data.msg;
          obj.success = function (e) {
            _this.setData({
              adsPage: 1,
              infoList: [],
              show: false
            });
            this.isEnd = false;
            _this.currentData = null;
            _this.getOrder();
          }
          obj.fail = function (e) {
            wx.showToast({
              icon: "none",
              title: '支付失败，请重试'
            });
          }
          wx.requestPayment(obj);
        } else {
          wx.showToast({
            icon: "none",
            title: '支付失败，请重试'
          });
        }
      });
    },
    // 滚动到底部获取数据
    lower() {
      let method = this.data.method;
      if (method == 'getCollects') {
        return false;
      }
      this[method]();
    },
    // 确认收货
    submitPay(data, status) {
      var _this = this;
      app.ajax({
        data: {
          id: data.ID,//订单ID
          status

        },
        url: app.api.updord,
        method: 'POST',
      }).then((res) => {
        if (res.data.code == 1) {
          wx.showToast({
            title: '确认收货',
            icon: 'success',
            duration: 2000
          });
          _this.setData({
            adsPage: 1,
            infoList: []
          });
          this.isEnd = false;
          _this.getOrder();
        }
      });
    },
    onTap(e) {
      let data = e.currentTarget.dataset.item;
      let type = e.currentTarget.dataset.type;
      let action = type ? type : data.Status;
      switch (action) {
        case 0: // 待付款
          this.setData({
            show: true
          });
          this.currentData = data;
          break;
        case 2: // 待收货
          this.submitPay(data, 4);
          break;
        case 4: // 已完成
          this.submitPay(data, 5);
          break;
        case 'wu':
          app.detailsAddress = data;
          wx.navigateTo({
            url: '/pages/logistics/logistics-info'
          });
          break;
      }
    },
    // 获取我的收藏
    getCollects() {
      app.ajax({
        data: {
        },
        url: app.api.collects,
        method: 'POST',
      }).then((data) => {
        if (data.data.code == 1) {
          this.setData({
            infoList: data.data.msg
          });
        } else {
          wx.showModal({
            title: '获取数据失败',
            content: data.data.msg
          });
        }
      });
    },
    // 获取我的账单
    getOrder() {
      var that = this;
      if (this.isEnd) {
        return false;
      }
      let ordertype = this.data.methodType === 'ads' ? 2 : 1;
      app.ajax({
        data: {
          begin: '',
          end: '',
          ordertype,
          status: this.data.status,
          index: this.data.adsPage
        },
        url: this.data.url,
        method: 'POST',
      }).then((res) => {
        if (res.data.code == 1) {
          let data = res.data.msg;
          const obj = {
            adsPage: that.data.adsPage
          };
          obj.list = that.data.infoList.concat(data.list);
          if (data.list.length >= 10) {
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
