//app.js
App({
  onLaunch: function () {
    this.init();
    this.getSystemInfo()
  },
  init: function () {},
  // 获取系统信息
  getSystemInfo () {
    wx.getSystemInfo({
      success: (res) => {
        // console.log('系统信息', res)
        this.globalData.windowWidth = res.windowWidth;
        this.globalData.windowHeight = res.windowHeight;
      },
    })
  },
  globalData: {
    userInfo: null,
    // BASE_URL: 'http://localhost:3000',
    BASE_URL: 'https://www.gengshaobin.top',
    // 设备宽高
    windowWidth: '',
    windowHeight: '',
    // 当前小说详情
    activeBookInfo: {},
    // 当前小说章节列表
    activeBookCatalog: []
  }
})