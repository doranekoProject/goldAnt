//index.js
//广告订单详情
const app = getApp()
let addNumber = function (num1, num2) {
  if (arguments.length < 2) {
    console.log('必须要传入两个参数,进行相加');
    return false;
  };
  // 把数字转变为字符串
  num1 = num1 + '';
  num2 = num2 + '';
  // 处理小数点
  let arr1 = num1.split('.');
  let arr2 = num2.split('.');
  // 先处理整数 按照''将字符串进行分割成数组
  let intArr1 = arr1[0].split('');
  let intArr2 = arr2[0].split('');
  // 在处理小数位
  let decimalsArr1 = Number('0.' + arr1[1]) || 0;
  let decimalsArr2 = Number('0.' + arr2[1]) || 0;
  let carrayInt = 0; // 默认整数计算单数位
  // 存储处理好的number
  let resualtDecimals = (decimalsArr1 + decimalsArr2).toFixed(2);
  resualtDecimals = resualtDecimals.toString().split('.');
  carrayInt = Number(resualtDecimals[0]); // 记录小数点的整数
  resualtDecimals = resualtDecimals[1];
  if (arr1[0].length < 15 && arr2[0].length < 15) {
    let resualtInt = parseInt(arr1[0], 10) + parseInt(arr2[0], 10);
    carrayInt > 0 && (resualtInt += carrayInt);
    return `${resualtInt.toString()}.${resualtDecimals}`;
  }

  let resualtIntArr = []; // 存储整数的数组
  // 跟小数点计算方法同理 
  while (intArr1.length || intArr2.length) {
    let sumInt = carrayInt + parseInt(intArr1.pop() || 0, 10) + parseInt(intArr2.pop() || 0, 10);
    if (sumInt < 10) {
      resualtIntArr.unshift(sumInt);
      carrayInt = 0;
    } else {
      resualtIntArr.unshift(sumInt - 10);
      carrayInt = 1;
    };
  };
  if (carrayInt > 0) {
    resualtIntArr.unshift(carrayInt);
  };

  // 在转成字符串拼接返回
  return `${resualtIntArr.join('')}.${resualtDecimals}`;
};
Page({
  data: {
    host: '',
    type: {
      '0': '待付款',
      '1': '待发货',
      '2': '待收货',
      '4': '已完成'
    },
    dataItem: {}
  },
  getAddress() {
    app.detailsAddress = this.data.dataItem;
    wx.navigateTo({
      url: '/pages/logistics/logistics-info'
    });
  },
  onLoad: function (e) {
    let id = e.id;
    app.ajax({
      data: {
        id
      },
      url: app.api.orderinfo,
      method: 'POST',
    }).then((data) => {
      if (data.data.code == 1) {
        data = data.data.msg;
        data.totalPrice = addNumber(data.Price, data.Fee);
        this.setData({
          dataItem: data,
          host: app.host
        });
      }
    });
  },
})
