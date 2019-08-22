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

  // 获取章节列表
  getCatalogList() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.BASE_URL}/api/book/catalog/${this.globalData.activeBookInfo.bookId}?page=${this.globalData.activeCatalogPage}&limit=${this.globalData.activeCatalogLimit}`,
        success: (response) => {
          this.globalData.activeBookCatalog = response.data.catalogData;
          resolve(response)
        },
        fail: (err) => {
          // console.error(err);
          reject(err);
        }
      })
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
    activeBookCatalog: [],
    // 当前获取的目录页数
    activeCatalogPage: 0,
    // 每次获取目录数据的条数
    activeCatalogLimit: 100
  }
})