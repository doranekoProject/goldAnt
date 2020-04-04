// billList/list.js
const app = getApp()
const api = app.api
Page({
  data: {
    type: 0 ,// 1为收入，0为支出，
    inout: '',
    list: [],
    page: 1,
    height: wx.getSystemInfoSync().windowHeight
  },
  onLoad: function (e) {
    const typeText = {
      '0': '充值记录',
      '4': '提现记录',
      'account': '账单明细',
      'other': '提现'
    };
    const type = !e.type ? 'other' : e.type;
    let title = typeText[type];
    let inout = type;
    if (type == 'account') {
      inout = '';
    }
    wx.setNavigationBarTitle({
      title
    });
    this.setData ({
      type,
      inout
    });
    if (type != 'other') {
      this.getAccountList();
    } else {
      app.ajax({
        url: api.userinfo,
        data: {
          id: wx.getStorageSync('userid').split('.')[0]
        },
        method: 'POST'
      }).then((res) => {
        if (res.data.code === 1) {
          const data = res.data;
          this.setData({
            userInfo: data.msg
          });
        } else {
          wx.showModal({
            title: '获取用户信息失败',
            content: res.data.msg
          });
        }
      }).catch((res) => {
        console.log(res)
      });
    }
  },
  inputValue: function (e) {
    const v = e.detail.value;
    this.setData({
      value: v > this.data.userInfo.score ? this.data.userInfo.score : v
    })
  },
  // 获取账单明细
  getAccountList: function (e) {
    const that = this;
    if (this.isEnd) {
      return false;
    }
    app.ajax({
      url: api.paylist,
      data: {
        date: '',
        inout: that.data.inout,
        index: that.data.page
      },
      method: 'POST',
    }).then(res => {
      if (res.data.code === 1) {
        let d = res.data.msg.list;
        let page = that.data.page;
        if (d.length >= 10) {
          page = page +1;
        } else {
          this.isEnd = true;
        }
        that.setData({
          page,
          list: that.data.list.concat(d)
        })
      } else {
        wx.showToast({
          icon: "none",
          title: res.data.msg
        })
      }
    }).catch(res => {
      console.log(res);
    });
  },
  submit: function () {
    if (!this.data.value || this.data.value == 0 || this.data.value > this.data.userInfo.score ) {
      return wx.showToast({
        title: '请检查提现金额',
        icon: "none"
      })
    }
    app.ajax({
      url: api.transferout,
      data: {
        money: this.data.value,
        remark: ""
      },
      method: 'POST',
    }).then(res => {
      if(res.data.code === 1) {
        wx.showToast({
          title: '提现成功'
        });
        wx.navigateBack({
          delta: 1
        });
      } else  {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        });
      }
    }).catch(res => {
      console.log(res);
    });
  },
  lower: function() {
    this.getAccountList();
  }
})
