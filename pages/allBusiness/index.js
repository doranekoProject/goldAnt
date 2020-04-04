//homepage.js
const app = getApp();
const api = app.api;

Page({
  data: {
    list: [],
    page: 1,
    height: wx.getSystemInfoSync().windowHeight
  },
  getList: function () {
    app.ajax({
      url: api.pros,
      data: {
        key: '',
        area: '',
        category: this.data.id,
        otype:'',
        index: this.data.page
      },
      method: 'POST'
    }).then((res) => {
      if (res.data.code === 1) {
        const data = res.data.msg;
        const obj = {};
        for(let i = 0; i < data.list.length; i += 1) {
          data.list[i].Img = `${app.host}${data.list[i].Img}`;
        }
        obj.list = this.data.list.length > 0 ? this.data.list.concat(data.list) : data.list;
        if (data.list.length >= 10) {
          obj.page = this.data.page + 1;
        } else {
          obj.lastPage = true;
        }
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
  bindToPage: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../detail/detail?type=proinfo&id=${id}`,
    })
  },
  onLoad: function (e) {
    if (!e.id) return wx.showToast({
      title: '商家ID不存在',
      icon: "none"
    })
    const name = !e.name ? 0 : e.name;
    const dataList = [];
    wx.setNavigationBarTitle({
      title: name == 0 ? '所属商家' : name
    });
    this.setData({
      id: e.id
    })
    this.getList();
  },
  lower: function () {
    console.log(this.data.lastPage)
    if(!this.data.lastPage) this.getList();
  }
})
