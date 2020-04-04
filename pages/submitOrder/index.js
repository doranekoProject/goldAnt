//submit Order.js
//获取应用实例
const app = getApp();
const api = app.api;

Page({
  data: {
    detail: {},
    userInfo: {},
    quantity: 1,
    remark: '',
    address: {},
    aid: 0,
  },
  getItem: function () {
    app.ajax({
      url: api[this.data.type],
      method: 'POST',
      data: {
        pid: this.data.itemId
      },
    }).then(res => {
      if (res.data.code === 1) {
        res.data.msg.Img = `${app.host}${res.data.msg.Img}`;
        this.setData({
          detail: res.data.msg,
          cost: res.data.msg.Price * this.data.quantity
        });
        console.log(this.data)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }).catch(res => {
      console.log(res)
    })
  },
  getInfo: function () {
    app.ajax({
      url: api.userinfo,
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
  getAddr: function () {
    app.ajax({
      url: api.addr,
      method: 'POST'
    }).then((res) => {
      let data = res.data;
      if (data.code != 1) {
        return false;
      }
      if ( data.msg.length > 0 ) {
        const index = wx.getStorageSync('curAddrIndex') || 0;
        let curData = data.msg[index];
        curData.detailsInfo = curData.AreaID.replace(/,/g, '') + curData.Address;
        this.setData({
          aid: curData.ID,
          address: curData
        })
      } else {
        this.setData({
          address: ''
        })
      }
    });
  },
  bindQuantity: function (e) {
    const type = e.currentTarget.dataset.type;
    const quantity = Number(this.data.quantity)
    console.log(type)
    const obj = {};
    if (type === 'add') {
      obj.quantity = quantity + 1;
    }
    if (type === 'reduce') {
      obj.quantity = quantity === 1 ? 1 : quantity - 1;
    }
    if (type === 'input') {
      obj.quantity = e.detail.value;
    }
    obj.cost  =  obj.quantity * this.data.detail.Price;
    this.setData(obj);
  },
  bindWallet: function (e) {
    const type = e.currentTarget.dataset.type;
    const price = this.data.quantity * this.data.detail.Price;
    if (this.data.userInfo[type] < price ) {
      return  wx.showToast({
        title: `您的${type === 'balance' ? '余额' : '积分'}不足`,
        icon: 'none'
      })
    }
    this.setData({
      walletType: type,
      cost: 0
    })
  },
  bindDesc: function (e) {
    const v = e.detail.value;
    this.setData({
      remark: v
    })
  },
  bindSumbit: function () {
    console.log(this.data.detail)
    app.ajax({
      url: api.order,
      method: 'POST',
      data: {
        shopid: this.data.detail.ShopID,
        addid: this.data.aid,
        remark: this.data.remark,
        proid: this.data.itemId,
        spid:  this.data.spid,
        count: this.data.quantity,
        paytype: this.data.walletType === 'balance' ? 1 : (this.data.walletType === 'score' ? 2 : 0),
        fee: this.data.cost
      },
    }).then(res => {
      if (res.data.code === 1) {
        console.log('下单成功',res.data)
        const obj = res.data.msg;
        console.log(obj)
        obj.success = function(e) {
          wx.navigateTo({
            url: `../adOrder/details?id=${obj.orderid}`,
          })
        }
        obj.fail = function(e) {
          wx.showToast({
            icon: "none",
            title: '支付失败，请重试'
          });
          console.log('fail', e)
        }
        wx.requestPayment(obj);
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }).catch(res => {
      console.log(res)
    })
  },
  onLoad: function (e) {
    if(!e.id) return wx.showToast({
      title: "找不到商品ID",
      icon: "none"
    });
    this.setData({
      type: e.type,
      spid: e.spid == 0 ? '':  e.spid,
      itemId: e.id,
      quantity: e.quantity
    })
    this.getItem();
    this.getInfo();
  },
  onShow: function () {
    this.getAddr();
  }
})
