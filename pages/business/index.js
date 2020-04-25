//business.js
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
    banner: [],
    height: 0,
    winHeight: wx.getSystemInfoSync().windowHeight,
    quantity: 1,
    tabType: 0,
    adsPage: 1,
    curCity: '湛江市',
    key:"",
    address:[],
    multiArray: [],
    isNext: true
  },
  onReady: function () {
    const that = this;
    let query = wx.createSelectorQuery().in(this)
    query.select('.home-bar').boundingClientRect()
    query.select('.home-filter').boundingClientRect().exec(res => {
      that.setData({
        height: wx.getSystemInfoSync().windowHeight - res[0].height - res[1].height
      })
    });
  },
  lower: function () {
    if(this.data.isNext)  this.getList();
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
  getBanner: function (e) {
    app.ajax({
      url: api.proads,
      method: 'POST',
    }).then(res => {
      if (res.data.code === 1) {
        for (let i = 0; i < res.data.msg.list.length; i += 1) {
          res.data.msg.list[i].Img = `${app.host}${res.data.msg.list[i].Img}`;
          if (location != null && (data.list[i].X > 0 || data.list[i].Y > 0)) {
            data.list[i].location = utils.distanceCheck(data.list[i].X, location.longitude, data.list[i].Y, location.latitude);
          }
        }
        this.setData({
          banner: res.data.msg.list
        });
      }
    }).catch(res => {
      console.log(res)
    });
  },
  getList: function () {
    const that = this;
    let addr = this.data.address.toString().replace(/\,/ig, '');
    if (/全部/.test(addr)) addr = addr.replace(/全部/ig, '');
    app.ajax({
      url: api.companypro,
      data: {
        key: this.data.key || '',
        area: addr,
        category: !!this.data.getCategory && this.data.getCategory.current > 0 ? this.data.getCategory.current : '',
        index: this.data.adsPage,
        shopid: ''
      },
      method: 'POST'
    }).then((res) => {
      if (res.data.code === 1) {
        const data = res.data.msg;
        const obj = {};
        const location = wx.getStorageSync('location');
        if (data.list.length < 10) obj.isNext = false; 
        for(let i = 0; i < data.list.length; i += 1) {
          data.list[i].Img = `${app.host}${data.list[i].Img}`;
          if (location != null && (data.list[i].X > 0 || data.list[i].Y > 0)) {
            data.list[i].location = utils.distanceCheck(data.list[i].X, location.longitude, data.list[i].Y, location.latitude);
          }
        }
        obj.list = that.data.adsPage > 1 ? that.data.list.concat(data.list) : data.list;
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
      if (res.data.code === 1) {
        res.data.msg.current = '';
        const list = res.data.msg.list;
        const allCur = [];
        const showAll = [];
        for (let i = 0; i < list.length; i += 1) {
          showAll.push(list[i].ID);
          if (list[i].ProCount > 0) allCur.push(list[i].ID);
        }
        list.unshift({
          ID: -1,
          Name: '全部',
          active: 0,
          ProCount: null
        });
        this.setData({
          getCategory:  res.data.msg,
          buyList: {
            list: list,
            allCur: allCur,
            current: [],
            showAll: showAll,
            cateids: [],
            quantity: 1,
            time: '',
          }
        })
        console.log(this.data)
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
  bindBuy: function (e) {
    const index = e.currentTarget.dataset.index;
    const id = this.data.buyList.list[index].ID;
    const obj = this.data.buyList.list;
    obj[index].active = !this.data.buyList.list[index].active ? 1 : 0;
    let selectArr = this.data.buyList.current;
    let cateids = this.data.buyList.cateids;
    console.log(id)
    if (id == -1 ) {
      if (obj[index].active) {
        for(let i = 0; i < obj.length; i += 1) {
          obj[i].active = 1;
        }
        selectArr = this.data.buyList.showAll;
        cateids = this.data.buyList.allCur;
      } else {
        for (let i = 0; i < obj.length; i += 1) {
          obj[i].active = 0;
        }
        selectArr = [];
        cateids = [];
      }
    } else {
      obj[index].active ? selectArr.push(id) : selectArr.splice(index, 1);
      if (this.data.buyList.list[index].ProCount > 0 ){
        obj[index].active ? cateids.push(id) : cateids.splice(index, 1);
      }
    }
    this.setData({
      buyList: {
        list: obj,
        current: selectArr,
        cateids: cateids,
        time: this.data.buyList.time,
        quantity: this.data.buyList.quantity,
        allCur: this.data.buyList.allCur,
        showAll: this.data.buyList.showAll
      }
    });
  },
  bindQuantity: function (e) {
    const type = e.currentTarget.dataset.type;
    const quantity = Number(this.data.buyList.quantity)
    const obj = {};
    console.log(quantity, type)
    if (type === 'add') {
      obj['buyList.quantity'] = quantity + 1;
    }
    if (type === 'reduce') {
      obj['buyList.quantity'] = quantity === 1 ? 1 : quantity - 1;
    }
    if (type === 'input') {
      const num = Number(e.detail.value);
      obj['buyList.quantity'] = num <= 1 ? 1 : num;
    }
    this.setData(obj);
  },
  bindTime: function (e) {
    const value = e.currentTarget.dataset.value;
    const obj = {};
    obj['buyList.time'] = value;
    this.setData(obj);
  },
  bindSubmit: function (e) {
    const buyList = this.data.buyList;
    if (buyList.cateids.length > 0 && !!buyList.time) {
      app.ajax({
        url: api.batchaddcart,
        method: 'POST',
        data: {
          cateids: buyList.cateids.join(','),
          spname: buyList.time,
          count: buyList.quantity,
        },
      }).then(res => {
        if (res.data.code === 1) {
          const obj = res.data.msg;
          this.setData({
            tabType: 0
          });
          wx.showToast({
            title: '加入成功',
            icon: "none"
          })
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
      wx.showToast({
        title: buyList.cateids.length <= 0 ? (buyList.current.length > 0 ? '所选分类下没有商品' : '请选择商品') : '投放时长未选择' ,
        icon : 'none'
      });
    }

  },
  bindColChange: function (e) {
    const index =  e.detail.value;
    if (e.detail.column === 0) {
      const position = wx.getStorageSync('position');
      const cityName =  this.getName(position.city[position.province[index].ID]);
      console.log(this.data.multiArray[0], cityName)
      this.setData({
        multiArray: [this.data.multiArray[0], cityName]
      })
    }
  },
  bindCityChange: function (e) {
    console.log(e)
    const position = wx.getStorageSync('position');
    curCityID.province = position.province[e.detail.value[0]].ID;
    curCityID.city = position.city[curCityID.province][e.detail.value[1]].ID;
    const area =  {
      area: this.getName(position.area[curCityID.city], 'all'),
      county: ['全部'],
      select: [0,0]
    }
    const obj = {};
    const multiIndex = e.detail.value;
    const multiArray = this.data.multiArray;
    obj.curCity = this.data.multiArray[1][e.detail.value[1]],
    obj.area = area;
    obj.adsPage = 1;
    obj.address = [multiArray[0][multiIndex[0]], multiArray[1][multiIndex[1]]];
    if (this.data.tabType == 1) obj.downList = area;
    this.setData(obj);
    this.getList();
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
      url: `../detail/detail?type=adsinfo&id=${id}&form=business`,
    })
  },
  onLoad: function () {
    const that = this;
    this.getBanner();
    if (!wx.getStorageSync('position')) {
      this.getArea();
    } else {
      this.position();
    }
    this.getCategory();
    
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation'] && wx.getStorageSync('location')) {
          that.getList();
        } else {
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              const latitude = res.latitude
              const longitude = res.longitude
              const speed = res.speed
              const accuracy = res.accuracy
              wx.setStorageSync('location', res);
              that.getList();
            },
            fail: function(res) {
              wx.showToast({
                title: '授权失败,将无法显示距离',
                icon: "none"
              });
              wx.setStorageSync('location', null);
              that.getList();
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
      tabType: 0,
      adsPage: 1
    });
    this.getList();
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
      if (list.area[index] === '全部') obj.address[3] = '';
    } else {
      obj.address[3] = list.county[index];
      obj.tabType = 0;
    }
    list.select = type ? [list.select[0], index] : [index, 0]
    obj.downList = list;
    obj.adsPage = 1;
    this.setData(obj);
    this.getList();
  },
  bindSearch: function(e) {
    this.setData({
      key: e.detail.value,
      adsPage: 1
    })
    this.getList();
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
