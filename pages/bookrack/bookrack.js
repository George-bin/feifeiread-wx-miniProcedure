let app = getApp();
// pages/catalog/catalog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  // 获取书架信息
  handleGetBookRackInfo: function () {
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
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }
})