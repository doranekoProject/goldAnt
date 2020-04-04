//homepage.js
const app = getApp();
const api = app.api;
const utils = require('../../utils/util.js');
const globalData = app.globalData;
const curCityID = {
  province: 1963,
  city: 2021,
  area: 0,
  county: 0,
}
Page({
  data: {
    list: [],
    height: 0,
    winHeight: wx.getSystemInfoSync().windowHeight,
    quantity: 1,
    tabType: 0,
    adsPage: 1,
    curCity: '湛江',
    key:"",
    address:[],
    multiArray: [],
    isNext: true
  },
  onReady: function () {
    console.log(utils)
    const that = this;
    let query = wx.createSelectorQuery().in(this)
    query.select('.home-bar').boundingClientRect()
    query.select('.home-filter').boundingClientRect().exec(res => {
      that.setData({
        height: wx.getSystemInfoSync().windowHeight - res[0].height - res[1].height -20
      })
    });
  },
  lower: function () {
    if(this.data.isNext)  this.getAds();
  },
  getArea: function () {
    app.ajax({
      url: api.getarea,
      data: {},
      method: 'POST',
    }, '',).then((res) => {
      const position = {
        province: [],
        city: {},
        area: {},
        county: {}
      };
      for(let i = 0; i < res.data.msg.length; i += 1) {
        const data = res.data.msg[i];
        switch(data.LV) {
          case 2:
            position.province.push(data)
          break;
          case 3:
            if (!position.city[data.HeadID]) position.city[data.HeadID] = [];
            position.city[data.HeadID].push(data)
          break;
          case 4:
            if (!position.area[data.HeadID]) position.area[data.HeadID] = [];
            position.area[data.HeadID].push(data)
          break;
          case 5:
            if (!position.county[data.HeadID]) position.county[data.HeadID] = [];
            position.county[data.HeadID].push(data)
          break;
        }
      }
      wx.setStorageSync('position', position);
      this.position();
    }).catch((res) => {
      console.log(res)
    })
  },
  getAds: function () {
    const that = this;
    const addr = this.data.address.toString().replace(/\,/ig, '')
    app.ajax({
      url: api.ads,
      data: {
        key: this.data.key || '',
        area: addr,
        category: !!this.data.getCategory ? this.data.getCategory.current : '',
        otype: !!this.data.otype ? this.data.otype.current : '',
        index: this.data.adsPage
      },
      method: 'POST'
    }).then((res) => {
      if (res.data.code === 1) {
        const data = res.data.msg;
        const obj = {};
        const location = wx.getStorageSync('location');
        for(let i = 0; i < data.list.length; i += 1) {
          data.list[i].Img = `${app.host}${data.list[i].Img}`;
          if (location != null && (data.list[i].X > 0 || data.list[i].Y > 0)) {
            data.list[i].location = utils.distanceCheck(data.list[i].X, location.longitude, data.list[i].Y, location.latitude);
          }
        }
        obj.list = that.data.list.length > 0 ? that.data.list.concat(data.list) : data.list;
        if(obj.list.length > 10 ) obj.adsPage = obj.adsPage  + 1;
        this.setData(obj)
      } else {
        wx.showModal({
          title: '获取列表失败',
          content: res.data.msg
        });
      }
    }).catch((res) => {
      console.log(res)
    });
  },
  getCategory: function () {
    app.ajax({
      url: api.category,
      data: {
        type: 0
      },
      method: 'POST',
    }).then(res => {
      console.log(res)
      if (res.data.code === 1) {
        res.data.msg.current = 0;
        this.setData({
          getCategory:  res.data.msg
        })
      } else {
        wx.showModal({
          title: '获取类型列表失败',
          content: res.data.msg
        });
      }
    }).catch(res => {
      console.log(res)
    });
  },
  bindColChange: function (e) {
    const index =  e.detail.value;
    if (e.detail.column === 0) {
      const position = wx.getStorageSync('position');
      const cityName =  this.getName(position.city[position.province[index].ID]);
      this.setData({
        multiArray: [this.data.multiArray[0], cityName],

      })
    }
  },
  bindCityChange: function (e) {
    const position = wx.getStorageSync('position');
    curCityID.province = position.province[e.detail.value[0]].ID;
    curCityID.city = position.city[curCityID.province][e.detail.value[1]].ID;
    const area =  {
      area: this.getName(position.area[curCityID.city], 'all'),
      county: ['全部'],
      select: [0,0]
    }
    const obj = {};
    obj.curCity = this.data.multiArray[1][e.detail.value[1]],
    obj.area = area;
    if (this.data.tabType == 1) obj.downList = area;
    this.setData(obj);
    this.getAds();
  },
  getName: function (data, type) {
    let result = [];
    for (let j = 0; j < data.length; j += 1) {
      if (j === 0 && type === 'all') result.push('全部');
      result.push(data[j].Name);
    }
    return result;
  },
  position: function() {
    const position = wx.getStorageSync('position');
    const provinceName = this.getName(position.province);
    const cityName = this.getName(position.city[curCityID.province]);
    const area =  {
      area: this.getName(position.area[curCityID.city], 'all'),
      county: ['全部'],
      select: [0,0]
    }
    this.setData({
      multiArray: [provinceName, cityName],
      multiIndex: [5, 17], // 默认广东省湛江
      area,
      address: [provinceName[5], cityName[17]]
    })
  },
  bindToPage: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../detail/detail?type=adsinfo&id=${id}`,
    })
  },
  onLoad: function () {
    const that = this;
    if (!wx.getStorageSync('position')) {
      this.getArea();
    } else {
      this.position();
    }
    this.getCategory();
    
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userLocation'] && wx.getStorageSync('location')) {
          that.getAds();
        } else {
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              const latitude = res.latitude
              const longitude = res.longitude
              const speed = res.speed
              const accuracy = res.accuracy
              wx.setStorageSync('location', res);
              that.getAds();
            },
            fail: function(res) {
              wx.showToast({
                title: '授权失败,将无法显示距离',
                icon: "none"
              });
              wx.setStorageSync('location', null);
              that.getAds();
            }
          })
        }
      }
    })
    const otype = {
      list: [{
        ID: '',
        Name: '全选'
      },
      {
        ID: 1,
        Name: '线上'
      },
      {
        ID: 0,
        Name: '线下'
      },],
      current: '',
    }
    this.setData({
      otype: otype
    })
  },
  bindTabList: function (e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.downList;
    list.current = id;
    this.setData({
      downList: list,
      tabType: 0
    });
    this.getAds();
  },
  bindLayer: function(e) {
    this.setData({
      tabType: 0
    });
  },
  bindTabArea: function(e) {
    const index = e.currentTarget.dataset.index;
    const type = e.currentTarget.dataset.type;
    const list = this.data.area;
    const obj = {
      address: this.data.address
    };
    if (!type) {
      if(index > 0) {
        const position = wx.getStorageSync('position');
        curCityID.area = position.area[curCityID.city][index - 1].ID;
        list.county = !!position.county[curCityID.area] ? this.getName(position.county[curCityID.area], 'all') : ['全部']
      } else {
        list.county = ['全部']
      }
      obj.address[2] = list.area[index];
    } else {
      obj.address[3] = list.county[index];
      obj.tabType = 0;
    }
    list.select = type ? [list.select[0], index] : [index, 0]
    obj.downList = list;
    this.setData(obj);
    this.getAds();
  },
  bindSearch: function(e) {
    this.setData({
      key: e.detail.value
    })
    this.getAds();
  },
  tab: function(e) {
    const type = e.currentTarget.dataset.type;
    const obj = {};
    if (this.data.tabType != '' && type == this.data.tabType) {
      obj.tabType = 0;
    } else {
      obj.tabType = type;
      obj.isSub = type != 1 ;
      obj.downList = type == 1 ? this.data.area : (type == 3 ? this.data.otype : this.data.getCategory);
    }
    this.setData(obj);
  }
})
