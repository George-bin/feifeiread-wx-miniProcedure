//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    catalogList: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.request({
      url: 'http://39.105.55.137/api/book/catalog/42',
      success: (response) => {
        console.log(response.data)
        this.setData({
          catalogList: response.data.catalogData
        })
      }
    })
  },
  handleGoSectionContent: function () {
    console.log('跳转路由')
    wx.navigateTo({
      url: '../catalog/catalog',
    })
  }
})
