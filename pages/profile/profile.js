//index.js
//获取应用实例
const app = getApp()
const api = app.api;
Page({
  data: {
    motto: 'Hello World',
    isLogin: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {
      balance: 0,
      score: 0,
      utype: 0,
      nickname: '',
      img: ''
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (e) {
    const action = e.action;
    if (!!wx.getStorageSync('userid')) {
     // this.userInfo();
      this.setData({
        isLogin: true
      });
    }
    this.setData({
      action: action
    })
  },
  onShow: function (e) {
    if (!!wx.getStorageSync('userid')) this.userInfo();
  },
  userInfo: function (e) {
    app.ajax({
      url: api.userinfo,
      data: {
        id: wx.getStorageSync('userid').split('.')[0]
      },
      method: 'POST'
    }).then((res) => {
      if (res.data.code === 1) {
        const data = res.data;
        if (!!data.msg.endtime) data.msg.endtime = data.msg.endtime.split(' ')[0];
        this.setData({
          userInfo: data.msg
        });
        wx.setStorageSync('nickname', data.msg.nickname);
      } else {
        wx.showModal({
          title: '获取用户信息失败',
          content: res.data.msg
        });
      }
    }).catch((res) => {
      console.log(res)
    });
  },
  getUserInfo: function(e) {
    const that = this;
    wx.login({
      success: function (res) {
        const code = res.code;
        if (!!code) {
          wx.getUserInfo({
            success: function (data) {
              wx.request({
                url: api.login,
                data: {
                  code: res.code,
                  nickname: data.userInfo.nickName,
                  img: data.userInfo.avatarUrl,
                  fid: '',
                  phone: ''
                },
                method: 'POST',
                success: function (res) {
                  if(res.data.code === 1) {
                    wx.setStorageSync('userid', res.data.msg.id);
                    that.setData({
                      isLogin: true,
                      userInfo: {
                        img: data.userInfo.avatarUrl,
                        nickname: data.userInfo.nickName
                      }
                    });
                    wx.setStorageSync('nickname', data.userInfo.nickName);
                    if (that.data.action === 'back') {
                      wx.setStorageSync('islong', true);
                      setTimeout(() => {
                        wx.navigateBack({
                          delta: 1
                        });
                      }, 1000)
                    }
                  }
                },
                fail: function (faildata) {
                  wx.showModal({
                    title: '登录失败',
                    content: `请重试`,
                    success: function (success) {
                      _this.onGotUserInfo();
                    },
                    fail: function (e) { }
                  });
                  console.info(faildata);
                },
              });
            }
          })
        } else {
          wx.showModal({
            title: '登录失败',
            content: `请退出小程序后重新登录`
          });
        }
      },
      fail: function (data) {
        console.log(data)
      },
    });
  },
})
