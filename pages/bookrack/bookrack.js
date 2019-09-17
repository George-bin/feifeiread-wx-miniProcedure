let app = getApp();
// pages/catalog/catalog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    // 书架信息
    bookList: [],
    // 边距
    backGauge: 0,
    openSet: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init()
    this.handleGetBookRackInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  init () {
    wx.setNavigationBarTitle({
      title: '我的书架'
    });
    this.setData({
      userInfo: app.globalData.userInfo,
      backGauge: (app.globalData.windowWidth - 85 * 4) / 5
    });
  },

  // 获取书架信息
  handleGetBookRackInfo () {
    wx.request({
      url: `${app.globalData.BASE_URL}/api/book/bookrackInfo`,
      method: 'GET',
      header: {
        // 默认值
        'content-type': 'application/json',
        // 读取sessionid,当作cookie传入后台将PHPSESSID做session_id使用
        'cookie': wx.getStorageSync("sessionId")
      },
      success: (res) => {
        console.log('书架信息:', res)
        this.setData({
          bookList: res.data.bookList
        });
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  // 操作书架上的小说
  handleOpenSetBook () {
    console.log('准备删除')
    this.setData({
      openSet: true
    });
  },

  handleCloseSetBook () {
    this.setData({
      openSet: false
    });
  }
})