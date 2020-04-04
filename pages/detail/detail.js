//detail.js
const app = getApp()
const api = app.api;
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    isSeletePop: false,
    quantity: 1,
    stock: 0,
    SPID:0,
    isBuy: 0,
    itemOption: {
      original: [],
      allData: [],
      sortData: [],
      showData: [],
      curData: []
    }
  },
  onReady: function () {},
  onLoad: function (e) {
    const page = e.type //|| 'adsinfo';
    const id = e.id; // 'd9a9fcd7-5f04-4e8c-b482-e70e1f265b0d' //
    this.setData({
      page,
      id
    })
  },
  onShow: function (e) {
    app.ajax({
      url: api[this.data.page],
      data: {
        pid: this.data.id
      },
      method: 'POST',
    }).then(res => {
      if (res.data.code === 1) {
        const itemOption = {
          original: [],
          allData : [],
          sortData : [],
          showData: [],
          curData : [],
          name: []
        }
        const list = res.data.msg.list;
        res.data.msg.ImgList = res.data.msg.ImgList.split(';')
        for (let i = 0; i < res.data.msg.ImgList.length; i += 1) {
          res.data.msg.ImgList[i] = `${app.host}${res.data.msg.ImgList[i]}`;
        }
        if (list.length > 0) {
          itemOption.name = list[0].SPName.split(',');
          itemOption.original = list;
          const len = itemOption.name.length;
          for (let i = 0; i < list.length; i += 1) {
            const desc = list[i].SPDesc.split(',');
            for (let j = 0; j < len; j += 1) {
              if (!itemOption.sortData[j]) itemOption.sortData[j] = [];
              if (!itemOption.curData[j]) itemOption.curData[j] = [];
              if (!itemOption.sortData[j].includes(desc[j])) {
                itemOption.sortData[j].push(desc[j]);
                itemOption.curData[j].push(0); // 0未选/1选中/-1不可选
              }
              if (!itemOption.allData[j]) itemOption.allData[j] = [];
              itemOption.allData[j].push(desc[j]);
            }
          }
          itemOption.showData = itemOption.sortData;
        }
        this.setData({
          detail: res.data.msg,
          itemOption
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }).catch(res => {
      console.log(res)
    })
  },
  optionFilter: function (key, index) {
    const result = [];
    const indexArr = [];
    let curIndex = 0;
    const itemOption = this.data.itemOption;
    const saveValue = [];
    // 查询在哪一条数据里
    for (let i = 0; i < itemOption.allData.length; i += 1) {
      if (itemOption.allData[i].includes(key)) {
        curIndex = i;
         // 查key值所对应的所有索引
        for (let j = 0; j < itemOption.allData[i].length; j += 1) {
          if (itemOption.allData[i][j] == key) {
            indexArr.push(j);
          }
        }
      }
    }

    for (let i = 0; i < itemOption.allData.length; i += 1) {
      if (i != curIndex) {
        for (let j = 0; j < indexArr.length; j += 1) {
          if (!saveValue[i]) saveValue[i] = [];
          if (!saveValue[i].includes(itemOption.allData[i][indexArr[j]])) {
            saveValue[i].push(itemOption.allData[i][indexArr[j]]);
          }
        }
      } else {
        saveValue[i] = itemOption.showData[i];
      }
    }
    for (let i = 0; i < itemOption.showData.length; i += 1) {
      if (!result[i]) result[i] = new Array(itemOption.showData[i].length).fill(i != curIndex ? -1 : 0);
      if (i === curIndex) {
        result[i][index] = 1;
      } else {
        for (let j = 0; j < itemOption.showData[i].length; j += 1) {
          if(itemOption.showData[i].includes(saveValue[i][j])) {
            const index = itemOption.showData[i].indexOf(saveValue[i][j]);
            result[i][index] = itemOption.curData[i][index] == 1 ? 1 : 0;
          }
        }
      }
    }
    // 查找对应的SID
    return result;
  },
  bindOption: function (e) {
    const index = e.currentTarget.dataset.index;
    const key = e.currentTarget.dataset.key;
    const obj = {};
    obj[`itemOption.curData`] = this.optionFilter(key, index);
    this.setData(obj);
  },
  bindAddcollect: function (e) {
    app.ajax({
      url: api.addcollect,
      data: {
        proid: this.data.id
      },
      method: 'POST',
    }).then(res => {
      if (res.data.code === 1) {
        wx.showToast({
          title: '收藏成功',
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
    })
  },
  bindQuantity: function (e) {
    const type = e.currentTarget.dataset.type;
    const quantity = Number(this.data.quantity)
    const obj = {};
    if (type === 'add') {
      obj.quantity = quantity + 1;
    }
    if (type === 'reduce') {
      obj.quantity = quantity === 1 ? 1 : quantity - 1;
    }
    if (type === 'input') {
      obj.quantity = e.detail.value;
    }
    this.setData(obj);
  },
  bindConfirm: function(e) {
    const itemOption = this.data.itemOption;
    let spid = 0;
    let isNext = 1;
    if (this.data.quantity <= 0) {
      return wx.showToast({
        title: '请添加数量',
        icon: "none"
      })
    }
    for (let i = 0; i < itemOption.showData.length; i += 1) {
      if(itemOption.curData[i].includes(1) && isNext) {
        spid = true;
      } else {
        spid = false;
        isNext = false;
      }
    }
    const postItem = () => {
      if (spid <= 0 && this.data.itemOption.allData.length > 0) {
        return wx.showToast({
          title: '请选择规格',
          icon: "none"
        })
      }
      app.ajax({
        url: api.addcart,
        data: {
          proid: this.data.id,
          spid: !!spid ? this.data.SPID : '',
          count: this.data.quantity,
          isbuy: this.data.isBuy
        },
        method: 'POST',
      }).then(res => {
        if (res.data.code === 1) {
          wx.showToast({
            title: '已加入购物车',
            icon: "none"
          })
          this.setData({
            isSeletePop: false
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }).catch(res => {
        console.log(res)
      })
    }
    if (spid) {
      let str = '';
      let stock = '';
      spid = -1;
      itemOption.showData.map(function(i, v){
        str += str === '' ? i[itemOption.curData[v].indexOf(1)] : `,${i[itemOption.curData[v].indexOf(1)] }`;
      });
      itemOption.original.map((i) => {
        if (i.SPDesc == str)  {
          spid = i.SPID;
          stock = i.Stock;
          return;
        }
      });
      this.setData({
        SPID: spid,
        stock: stock
      });
    } else {
      this.setData({
        stock: this.data.detail.Stock
      });
    }
    if (this.data.stock < this.data.quantity) {
      return wx.showToast({
        title: `库存只剩下${this.data.stock}件`,
        icon: 'none'
      });
    }
    if (this.data.isBuy === 'options') {
      return this.setData({
        isSeletePop: false
      });
    }
    if (this.data.isBuy == 0) {
      postItem();
    } else {
      if (spid <= 0 && this.data.itemOption.allData.length > 0) {
        return wx.showToast({
          title: '请选择规格',
          icon: "none"
        })
      }
      wx.navigateTo({
        url: `../submitOrder/index?id=${this.data.id}&spid=${this.data.SPID}&type=${this.data.page}&quantity=${this.data.quantity}`,
      })
    }
  },
  catchShopCart: function (e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      isSeletePop: !this.data.isSeletePop
    })
    app.ajax({
      url: api.addcart,
      data: {
        proid: item.ID,//商品ID
        spid: item.ShopID,//规格ID（可为空，如果该商品有规格，则该值必填）
        count: 1,//商品数量
        isbuy: 1,//是否勾选购买
      },
      method: 'POST'
    }).then(res => {
      if (res.data.code != 1) {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        });
      } else {
        wx.showToast({
          title: '添加成功',
        })
      }
    }).catch(res => {
      wx.showModal({
        title: '提示',
        content: res,
      });
    });
  },
  seletePop: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      isSeletePop: !this.data.isSeletePop,
      isBuy: type
    })
  }
})
