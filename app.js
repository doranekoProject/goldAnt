//app.js
const apiUrl = 'http://hzkzd.com:8050/Services/c_server.aspx';
App({
  host: 'http://hzkzd.com:8050',
  api: {
    reg: `${apiUrl}?t=reg`,
    login: `${apiUrl}?t=login`,
    userinfo: `${apiUrl}?t=userinfo`,
    collects: `${apiUrl}?t=collects`, // 收藏列表
    category: `${apiUrl}?t=category`, // 获取所有商品或广告分类类型
    ads: `${apiUrl}?t=ads`, // 获取广告列表
    adsinfo: `${apiUrl}?t=adsinfo`, // 获取广告详情
    proinfo: `${apiUrl}?t=proinfo`, // 获取商品详情
    pros: `${apiUrl}?t=pros`,
    getarea: `${apiUrl}?t=getarea`,
    addr: `${apiUrl}?t=addr`, //，  获取收货地址
    updaddr: `${apiUrl}?t=updaddr`, // 编辑收货地址
    deladdr: `${apiUrl}?t=deladdr`, // 删除收货地址
    cartlist: `${apiUrl}?t=cartlist`, // 购物车列表
    deladdr: `${apiUrl}?t=delcart`, // 删除购物车:
    recharge:`${apiUrl}?t=recharge`, // 充值
    paylist: `${apiUrl}?t=paylist`, // 账单列表
    addcart: `${apiUrl}?t=addcart`, // 添加购物车
    addcollect: `${apiUrl}?t=addcollect`, // 添加购物车
    order: `${apiUrl}?t=order`, // 下单
    orderlist: `${apiUrl}?t=orderlist`, // 订单列表
    collects: `${apiUrl}?t=collects`, // 我的收藏
    applyshop: `${apiUrl}?t=applyshop`, // 商家入驻
    updord: `${apiUrl}?t=updord`, // 更新状态
    proads: `${apiUrl}?t=proads`, // 商品首页中的广告图
    transferout: `${apiUrl}?t=transferout`, // 提现
    ordercart: `${apiUrl}?t=ordercart`// 购物车下单
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
  // getUser() {
  //   var _this = this;
  //   wx.login({
  //     success: function (res) {
  //       const code = res.code;
  //       if (!!code) {
  //         wx.getUserInfo({
  //           success: function (data) {
  //             wx.request({
  //               url: _this.api.login,
  //               data: {
  //                 code: res.code,
  //                 nickname: data.userInfo.nickName,
  //                 img: data.userInfo.avatarUrl,
  //                 fid: '',
  //                 phone: ''
  //               },
  //               method: 'POST',
  //               success: function (data) {
  //                 if (data.data.code === 1) {
  //                   wx.setStorageSync('userid', data.data.msg.id);
  //                 }
  //               },
  //               fail: function (faildata) {
  //                 wx.showModal({
  //                   title: '登录失败',
  //                   content: `请重试`,
  //                   success: function (success) {
  //                     _this.getUser();
  //                   },
  //                   fail: function (e) { }
  //                 });
  //               },
  //             });
  //           }
  //         })
  //       } else {
  //         wx.showModal({
  //           title: '登录失败',
  //           content: `请退出小程序后重新登录`
  //         });
  //       }
  //     },
  //     fail: function (data) {
  //       console.log(data)
  //     },
  //   });
  // },
  ajax(params, tokenNotShow, type) {
    var _this = this;
    params.data = params.data || {};
    if (!tokenNotShow) {
      params.data.token = wx.getStorageSync('userid');
    }
    return new Promise((suc, err) => {
      params.success = function(data) {
        if (data.data.code == -98) {
          if (!wx.getStorageSync('islong')) {
            wx.showModal({
              title: '未登录',
              content: data.data.msg,
              success: function(){
                wx.navigateTo({
                  url: `../profile/profile?action=back`,
                })
              },
              fail: function() {
                wx.clearStorageSync();
              }
            });
          } else {
            wx.getStorageSync('islong');
          }
          return;
        }
        suc(data);
      };
      params.fail = function(errM) {
        err(errM);
      };
      wx.request(params);
    });
  },
  globalData: {
    userInfo: null,
    area: null,
  }
})