//index.js
//资讯详情
const app = getApp()

Page({
  data: {
    info: {
      Img: '',//图片
      Title: '',//标题
      Content: '', //详细内容
      UpdateTime: '' //发布时间

    }
  },
  onLoad: function (e) {
    app.ajax({
      url: app.api.infodetail,
      data: {
        id: e.id
      },
      method: 'POST'
    }).then((res) => {
      if (res.data.code === 1) {
        this.setData({
          info: res.data.msg
        });
      }
    }).catch((res) => {
      console.log(res)
    });
  },
})
