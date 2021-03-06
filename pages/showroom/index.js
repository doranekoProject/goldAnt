//homepage.js
const app = getApp()

Page({
  data: {
    list: [],
    height: 0,
    quantity: 1,
    tabType: 0
  },
  onReady: function () {
    const that = this;
    let query = wx.createSelectorQuery().in(this)
    query.select('.showroom-bar').boundingClientRect()
    query.select('.showroom-filter').boundingClientRect().exec(res => {
      that.setData({
        height: wx.getSystemInfoSync().windowHeight - res[0].height - res[1].height
      })
    })
  },
  onLoad: function () {
    const dataList = [];
    const area =  [{
      name: '广州市',
      subtime: {
        arr: ['天河区', '海珠区', '荔弯区']
      }
    }]

    const place = [{
        name: '全部'
      },
      {
        name: '全超市部'
      },
      {
        name: '机场'
      },
    ]
    const online = [
      {
        name: '全选'
      },
      {
        name: '线上'
      },
      {
        name: '线下'
      },
    ]
    const recruit = [
      {
        name: '关于我们'
      },
      {
        name: '招聘信息'
      }
    ]
    const data = {
      cover: 'https://profile.csdnimg.cn/5/D/E/3_a772116804',
      title: '湛江市赤坎区安铺人鸡饭店',
      location: '0.88'
    }
    for (let i = 1; i < 20; i += 1) {
      dataList.push(data);
    }
    this.setData({
      list: dataList,
      area: area,
      place: place,
      online: online,
      recruit: recruit
    })
  },
  tab: function(e) {
    const type = e.currentTarget.dataset.type;
    const obj = {};
    if (this.data.tabType != '' && type == this.data.tabType) {
      obj.tabType = 0;
    } else {
      obj.tabType = type;
      obj.isSub = type != 1 ;
      obj.downList = type == 1 ? this.data.area : 
        (type == 2 ? this.data.place : (type == 3 ? this.data.online : this.data.recruit));
    }
    this.setData(obj);
  }
})
