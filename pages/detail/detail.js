//detail.js
const app = getApp()

Page({
  data: {
    banner: [
      'https://image.seedit.com/sys/2020/02/08/b54dd7cee43fa8c5b353c9184e3f7658693628.jpg', 'https://image.seedit.com/sys/2020/02/08/67536dd2dabc741d7f88d3784e3d1a80801717.jpg', 'https://image.seedit.com/sys/2020/02/08/b4b68bdce8e154004526ed709c8bef02496360.jpg'
      ],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    isSeletePop: false,
    quantity: 1
  },
  onReady: function () {
   
  },
  onLoad: function (e) {
    const page = e.type || 1;
    this.setData({
      page: page
    })
    
  },
  seletePop: function() {
    this.setData({
      isSeletePop: !this.data.isSeletePop
    })
  }
})
