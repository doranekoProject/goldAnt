//index.js
const app = getApp()

Page({
  data: {
    isLogin: true,
    allSelect: false,
    totalCount: '',
    cartList: []
  },
  onLoad: function () {
    app.ajax({
      method: 'POST',
      url: app.api.cartlist
    }).then((res) => {
      let data = res.data;
      if (data.code == -98) {
        this.setData({
          isLogin: false
        });
        return false;
      }
      if (data.code == 1) {
        this.setData({
          cartList: data.msg
        });
        this.caculPrice();
      }
      if (res.code)
      console.log(res);
    });
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      listHeight: systemInfo.windowHeight - 100
    });
  },
  onTap(e) {
    let index = e.currentTarget.dataset.index;
    var isBuy = this.data.cartList[index].IsBuy;
    this.data.cartList[index].IsBuy = isBuy == 1 ? 0 : 1;
    this.setData({
      cartList: this.data.cartList
    });
    this.caculPrice();
    this.addCard(this.data.cartList[index]);
  },
  bindKeyInput(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    value = value.replace(/[^\d]/g, '');
    this.data.cartList[index].Count = value;
    this.setData({
      cartList: this.data.cartList
    });
    if (this.data.cartList[index].IsBuy == 1) {
      this.caculPrice();
    }
  },
  deleteCard(e) {  
    var index = e.currentTarget.currentTarget.index;
    let data = this.data.cartList;
    let item = data[index];
    app.ajax({
      url: app.api.delcart,
      methos: 'POST',
      data: {
        delcart: item.ID
      }}).then(() => {

    });
  },
  bindblur(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    if (value == '' || value == '0') {
      this.data.cartList[index].Count = 1;
      this.setData({
        cartList: this.data.cartList
      })
    }
    this.addCard(this.data.cartList[index]);
    if (this.data.cartList[index].IsBuy == 1) {
      this.caculPrice();
    }
  },
  caculPrice() {
    var data = this.data.cartList;
    var tPrice = 0;
    var isAllCheck = true;
    data.forEach((item) => {
      if (item.IsBuy == 1) {
        let price = Number(item.Price);
        let count = Number(item.Count);
        let t = price * count;
        tPrice = Number(t.toFixed(2)) + tPrice;
      } else {
        isAllCheck = false;
      }
    });
    this.setData({
      allSelect: isAllCheck,
      totalCount: tPrice.toFixed(2)
    });
  },
  setAll() { 
    let checked = !this.data.allSelect;
    var data = this.data.cartList;
    data.forEach((item) => {
      item.IsBuy = checked ? 1 : 0;
    });
    this.setData({
      cartList: data
    });
    this.caculPrice();
  },
  addCard(data) {
    app.ajax({
      url: app.api.addcart,
      data: {
        proid: data.ProductID,
        spid: data.SPID,
        count: data.Count,
        isbuy: data.IsBuy
      },
      method: 'POST',
    }).then(res => {
    })
  },
  goCount() {
    let index = [];
    let select = [];
    this.data.cartList.forEach((item, i) => {
      if (item.IsBuy == 1) {
        index.push(i);
        select.push(item)
      }
    });
    let type = select[0].Type;
    let agreed = true;
    select.forEach((item, i) => {
      if (item.Type != type) {
        agreed = false;
      }
    });
    if (index.length < 0) {
      wx.showModal({
        title: '提示',
        content: '请选择要购买的商品'
      });
      return false;
    }
    if (!agreed) {
      wx.showModal({
        title: '提示',
        content: '广告和商品不能一起结算！'
      });
      return false;
    }
    let cartIndex = index.join('-')
    wx.navigateTo({
      url: `../submitOrder/index?cartIndex=${index}&subType=${type}`
    })
  },
  modified(e) {
    var index = e.currentTarget.dataset.index;
    var action = e.currentTarget.dataset.action;
    let data = this.data.cartList;
    let num = Number(data[index].Count);
    switch(action) {
      case '-':
        if (num <= 1) {
          data[index].Count = 1;
        } else {
          data[index].Count = num - 1;
        }
        break;
      case '+':
        data[index].Count = num + 1;
        break;
    }
    this.setData({
      cartList: data
    });
    
    if (data[index].IsBuy == 1) {
      this.caculPrice();
    }
    this.addCard(data[index]);
  }
})
