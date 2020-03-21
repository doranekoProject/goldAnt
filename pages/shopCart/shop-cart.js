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
      if (data.code == 1) {
        this.setData({
          cartList: data.msg
        });
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
    this.data.cartList[index].isChecked = !this.data.cartList[index].isChecked;
    this.setData({
      cartList: this.data.cartList
    });
    this.caculPrice();
  },
  addCard(e) {
    let data = e.currentTarget.dataset.item;
    console.log(data);
    app.ajax({
      url: app.api.addcart,
      data: {
        proid: data.ID,//商品ID
        spid: data.ShopID,//规格ID（可为空，如果该商品有规格，则该值必填）
        count: 1,//商品数量
        isbuy: 1,//是否勾选购买

      },
      method: 'POST'
    }).then(() => {

    });
  },
  bindKeyInput(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    value = value.replace(/[^\d]/g, '');
    this.data.cartList[index].Count = value;
    this.setData({
      cartList: this.data.cartList
    });
    if (this.data.cartList[index].isChecked) {
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
    if (this.data.cartList[index].isChecked) {
      this.caculPrice();
    }
  },
  caculPrice() {
    var data = this.data.cartList;
    var tPrice = 0;
    var isAllCheck = true;
    data.forEach((item) => {
      if (item.isChecked) {
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
      item.isChecked = checked
    });
    this.setData({
      cartList: data
    });
    this.caculPrice();
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
    if (this.data.cartList[index].isChecked) {
      this.caculPrice();
    }
  }
})
