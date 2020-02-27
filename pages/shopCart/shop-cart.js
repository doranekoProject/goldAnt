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
    wx.request({
      url: app.api.cartlist,
      success(res) {
        console.log(res);
      }
    });
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      listHeight: systemInfo.windowHeight - 100,
      cartList: [{
        ID: '11',//该商品在购物车中的主键ID（删除购物车需要用到）
        ProductID: '333',//商品ID
        SPID: '2222',//规格ID
        Count: '5',//数量
        IsBuy: 'xxx',//是否购买，1为打钩，0为不打钩
        Price: 38.33,//商品价格
        Number: '333333333',//商品编号
        Score: '22',//商品积分
        Name: '家具家具家具',//商品名称
        Img: 'https://img-blog.csdnimg.cn/20190927151132530.png',//商品图片
        ShopID: '3333333',//商品商家ID
        SPName: '333,333',//规格名称（多个用逗号区分）
        SPDesc: '5555',//规格描述（多个用逗号区分）
      }, {
          ID: '11',//该商品在购物车中的主键ID（删除购物车需要用到）
          ProductID: '333',//商品ID
          SPID: '2222',//规格ID
          Count: '2',//数量
          IsBuy: 'xxx',//是否购买，1为打钩，0为不打钩
          Price: 22,//商品价格
          Number: '333333333',//商品编号
          Score: '22',//商品积分
          Name: '家具家具家具',//商品名称
          Img: 'https://img-blog.csdnimg.cn/20190927151132530.png',//商品图片
          ShopID: '3333333',//商品商家ID
          SPName: '333,333',//规格名称（多个用逗号区分）
          SPDesc: '5555',//规格描述（多个用逗号区分）
        }]});
  },
  onTap(e) {
    let index = e.currentTarget.dataset.index;
    this.data.cartList[index].isChecked = !this.data.cartList[index].isChecked;
    this.setData({
      cartList: this.data.cartList
    });
    this.caculPrice();
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
    wx.request({
      url: app.api.delcart,
      methos: 'POST',
      data: {
        delcart: item.ID
      },
      success(res) {
        console.log(res);
      }
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
