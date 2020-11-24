//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 分类列表
    classifyList: [],
    // classify: {},
    systemWidth: 0,
    systemHeight: 0
  },

  //事件处理函数
  onLoad () {
    this.init();
    this.getBookList();
  },

  init () {
    this.setData({
      systemWidth: app.globalData.windowWidth,
      systemHeight: app.globalData.windowHeight
    });
  },

  handleGoSectionContent: function (e) {
    console.log('跳转路由')
    let { book } = e.currentTarget.dataset;
    app.globalData.activeBookInfo = JSON.parse(JSON.stringify(book));
    wx.navigateTo({
      url: '../bookInfo/bookInfo',
    });
  },

  // 获取小说列表
  getBookList: function () {
    wx.showLoading({
      title: '数据加载中...',
    });
    let sessionId = wx.getStorageSync('sessionId')
    wx.request({
      url: `${app.globalData.BASE_URL}/api/book/list/base`,
      header: {
        sessionId: sessionId
      },
      success: (response) => {
        // console.log(response.data);
        this.setData({
          classifyList: response.data.classifyList
        });
        wx.hideLoading();
      },
      fail: (err) => {
        console.error(err);
        wx.hideLoading();
        wx.showToast({
          title: '数据加载失败!',
          icon: 'none'
        })
      }
    })
  }
})
