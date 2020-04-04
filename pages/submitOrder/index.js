//submit Order.js
//获取应用实例
const app = getApp();
const api = app.api;

Page({
  data: {
    list: [],
    detail: {},
    userInfo: {},
    quantity: 1,
    remark: '',
    address: {},
    aid: 0,
    totle: 0,
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
        const data = res.data.msg;
        data.Img = `${app.host}${data.Img}`;
        const cost = data.Price * this.data.quantity;
        const obj = {};
        if (!!this.data.spid) {
          for (let i = 0; i < data.list.length; i += 1) {
            if (data.list[i].SPID === this.data.spid) {
              obj.totle = data.list[i].Stock;
            }
          }
        } else {
          obj.totle = data.Stock;
        }
        obj.detail = data;
        obj.cost = cost;
        obj.originalCost = cost;
        this.setData(obj);
      } else {
        wx.showToast({
          title: data,
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
    const obj = {};
    const max = this.data.totle;
    if (type === 'add') {
      obj.quantity = quantity + 1 > max ? max : quantity + 1;
    }
    if (type === 'reduce') {
      obj.quantity = quantity === 1 ? 1 : quantity - 1;
    }
    if (type === 'input') {
      const num = Number(e.detail.value);
      obj.quantity = num <= 1 ? 1 : (num > max ? max : num);
    }
    obj.cost  =  obj.quantity * this.data.detail.Price;
    this.setData(obj);
  },
  bindWallet: function (e) {
    const type = e.currentTarget.dataset.type;
    const price = this.data.cost;
    if (this.data.userInfo[type] < price || (this.data.userInfo[type] === 0 && this.data.walletType!= type )) {
      return  wx.showToast({
        title: `您的${type === 'balance' ? '余额' : '积分'}不足`,
        icon: 'none'
      });
    }
    this.setData({
      walletType: this.data.walletType === type ? '' : type,
      cost: this.data.walletType === type ? this.data.originalCost : 0
    })
  },
  bindDesc: function (e) {
    const v = e.detail.value;
    this.setData({
      remark: v
    })
  },
  bindSumbit: function () {
    if (this.data.type === 'list') {
      app.ajax({
        url: api.ordercart,
        method: 'POST',
        data: {
          addid: this.data.aid,
          remark: this.data.remark,
          paytype: this.data.walletType === 'balance' ? 1 : (this.data.walletType === 'score' ? 2 : 0),
        },
      }).then(res => {
        if (res.data.code === 1) {
          const obj = res.data.msg;
          if (!!this.data.walletType) {
            wx.redirectTo({
              url: `../adOrder/details?id=${obj}`,
            })
          } else {
            obj.success = function (e) {
              wx.redirectTo({
                url: `../adOrder/details?id=${obj.orderid}`,
              })
            }
            obj.fail = function (e) {
              wx.showToast({
                icon: "none",
                title: '支付失败，请重试'
              });
              console.log('fail', e)
            }
            wx.requestPayment(obj);
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }).catch(res => {
        console.log(res)
      });
    } else {
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
          const obj = res.data.msg;
          if (!!this.data.walletType) {
            wx.navigateTo({
              url: `../adOrder/details?id=${obj}`,
            })
          } else {
            obj.success = function (e) {
              wx.navigateTo({
                url: `../adOrder/details?id=${obj.orderid}`,
              })
            }
            obj.fail = function (e) {
              wx.showToast({
                icon: "none",
                title: '支付失败，请重试'
              });
            }
            wx.requestPayment(obj);
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }).catch(res => {
        console.log(res)
      });
    }
  },
  getList: function () {
    app.ajax({
      method: 'POST',
      url: app.api.cartlist
    }).then((res) => {
      if (res.data.code == 1) {
        let data = res.data.msg;
        const indexArr = this.data.cartIndex;
        let list = [];
        let cost = 0;
        if (indexArr.length > 0) {
          for (let i = 0; i < indexArr.length; i += 1) {
            if (!!data[indexArr[i]]) {
              data[indexArr[i]].Img = `${app.host}${data[indexArr[i]].Img}`;
              list.push(data[indexArr[i]]);
              cost += (data[indexArr[i]].Count * data[indexArr[i]].Price);
            }
          }
          this.setData({
            list: list,
            cost: cost,
            originalCost: cost
          });
        }
      }
      if (res.code)
        console.log(res);
    });
  },
  onLoad: function (e) {
    if (!e.id && (!e.cartIndex && e.cartIndex != 0 )) return wx.showToast({
      title: "找不到商品ID",
      icon: "none"
    });
    if (!!e.cartIndex) {
      this.setData({
        cartIndex: e.cartIndex.split(','),
        type: 'list'
      });
      this.getList();
    } else {
      this.setData({
        type: e.type,
        spid: e.spid == 0 ? '':  e.spid,
        itemId: e.id,
        quantity: e.quantity
      });
      this.getItem();
    }
  },
  onShow: function () {
    this.getAddr();
    this.getInfo();
  }
})
