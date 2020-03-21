//index.js
//获取应用实例
const app = getApp()
const api = app.api;
Page({
  data: {
    motto: 'Hello World',
    isLogin: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (!!wx.getStorageSync('userid')) {
      this.setData({
        isLogin: true
      });
    }
  },
  getUserInfo: function(e) {
    const that = this;
    wx.login({
      success: function (res) {
        const code = res.code;
        console.log('code' ,code)
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
                success: function (data) {
                  if(data.data.code === 1) {
                    wx.setStorageSync('userid', data.data.msg.id);
                    that.setData({
                      isLogin: true
                    })
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
