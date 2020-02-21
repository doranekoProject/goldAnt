//index.js
const app = getApp()

Page({
  data: {
    isLogin: true
  },
  onLoad: function () {
    this.setData({
      cartList: [{
      imgUrl: 'https://img-blog.csdnimg.cn/20190927151132530.png',
      url: '',
      title: '北欧现代简约餐厅吊灯创意三头餐厅灯具',
      price: 38,
      num: 2,
      isChecked: false,
      selectClass: ''
      }, {
          imgUrl: 'https://img-blog.csdnimg.cn/20190927151132530.png',
          url: '',
          title: '北欧现代简约餐厅吊灯创意三头餐厅灯具',
          price: 38,
          num: 2,
          isChecked: false,
          selectClass: ''
      }]});
  },
  onTap(e) {
    let index = e.currentTarget.dataset.index;
    this.data.cartList[index].isChecked = !this.data.cartList[index].isChecked;
    this.setData({
      cartList: this.data.cartList
    });
  },
  bindKeyInput(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    value = value.replace(/[^\d]/g, '');
    this.data.cartList[index].num = value;
    this.setData({
      cartList: this.data.cartList
    })
  },
  bindblur(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    if (value == '' || value == '0') {
      this.data.cartList[index].num = 1;
      this.setData({
        cartList: this.data.cartList
      })
    }
  },
  modified(e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var action = e.currentTarget.dataset.action;
    let data = this.data.cartList;
    let num = data[index].num;
    switch(action) {
      case '-':
        if (num <= 1) {
          data[index].num = 1;
        } else {
          data[index].num = data[index].num - 1;
        }
        break;
      case '+':
        data[index].num = data[index].num + 1;
        break;
    }
    this.setData({
      cartList: data
    })
  }
})
