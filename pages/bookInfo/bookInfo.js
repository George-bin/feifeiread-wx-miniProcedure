// pages/bookInfo/bookInfo.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookInfo: {},
    // 目录数据
    catalogData: [],
    systemWidth: 0,
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  init: function () {
    console.log('app.globalData.activeBookInfo', app.globalData.activeBookInfo)
    let activeBookInfo = JSON.parse(JSON.stringify(app.globalData.activeBookInfo));
    let systemWidth = app.globalData.windowWidth;
    activeBookInfo.label = JSON.parse(activeBookInfo.label)
    this.setData({
      bookInfo: activeBookInfo,
      systemWidth
    });
    wx.setNavigationBarTitle({
      title: activeBookInfo.bookName
    });

    this.getCatalogList();
  },

  // 获取章节列表
  getCatalogList () {
    wx.request({
      url: `${app.globalData.BASE_URL}/api/book/catalog/${this.data.bookInfo.bookId}`,
      success: (response) => {
        app.globalData.activeBookCatalog = response.data.catalogData;
        this.setData({
          catalogData: response.data.catalogData ? response.data.catalogData : [],
          loading: false
        });
        // console.log('目录列表', response.data.catalogData)
      },
      fail: (err) => {
        console.error(err);
        this.setData({
          loading: false
        });
      }
    })
  },

  // 开始阅读
  handleStartRead() {
    wx.navigateTo({
      url: `../sectionContent/sectionContent?sectionId=000000&bookId=${this.data.bookInfo.bookId}`,
    })
  }
})