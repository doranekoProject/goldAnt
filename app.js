//app.js
const apiUrl = 'http://hzkzd.com:8050/Services/c_server.aspx';
App({
  api: {
    reg: `${apiUrl}?t=reg`,
    login: `${apiUrl}?t=login`,
    userinfo: `${apiUrl}?t=userinfo`,
    ads: `${apiUrl}?t=ads`, // 获取广告列表
    adsinfo: `${apiUrl}?t=adsinfo`, // 获取广告详情
    pros: `${apiUrl}?t=pros`,
    getarea: `${apiUrl}?t=getarea`,
    addr: `${apiUrl}?t=addr`, //，  获取收货地址
    updaddr: `${apiUrl}?t=updaddr`, // 编辑收货地址
    deladdr: `${apiUrl}?t=deladdr`, // 删除收货地址
    cartlist: `${apiUrl}?t=updaddr`, // 购物车列表
    deladdr: `${apiUrl}?t=delcart`, // 删除购物车: 
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    area: null,
  }
})