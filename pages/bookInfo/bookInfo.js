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
    userInfo: null,
    // 是否已经添加至书架
    isAddToBookrack: false
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

  init () {
    // console.log('app.globalData.activeBookInfo', app.globalData.activeBookInfo)
    let activeBookInfo = JSON.parse(JSON.stringify(app.globalData.activeBookInfo));
    let systemWidth = app.globalData.windowWidth;
    activeBookInfo.label = JSON.parse(activeBookInfo.label)
    this.setData({
      userInfo: app.globalData.userInfo,
      bookInfo: activeBookInfo,
      systemWidth,
      isAddToBookrack: app.globalData.userInfo && app.globalData.userInfo.bookIdList.includes(activeBookInfo.bookId) ? true : false
    });
    wx.setNavigationBarTitle({
      title: activeBookInfo.bookName
    });

    // 获取目录信息（对比缓存的章节，获取对应的目录列表）
    let catalogStorage = wx.getStorageSync('catalogStorage');
    if (catalogStorage && catalogStorage[this.data.bookInfo.bookId]) {
      let index = parseInt(catalogStorage[this.data.bookInfo.bookId]);
      let page = parseInt(index / app.globalData.activeCatalogLimit);
      app.globalData.activeCatalogPage = parseInt(index) > app.globalData.activeCatalogLimit ? (parseInt(index) % app.globalData.activeCatalogLimit > 0 ? page : page - 1) : 0;
    }

    wx.showLoading({
      title: '加载中'
    });
    // 获取目录
    app.getCatalogList()
      .then((response) => {
        this.setData({
          catalogData: response.data.catalogData ? response.data.catalogData : []
        });
        console.log('目录列表', response.data.catalogData);
        wx.hideLoading();
      })
      .catch(err => {
        console.log(err);
        wx.hideLoading();
      })
  },

  // 开始阅读
  handleStartRead () {
    wx.navigateTo({
      url: `../sectionContent/sectionContent?sectionId=000000&bookId=${this.data.bookInfo.bookId}`,
    })
  },

  // 加入书架
  handleJoinBookrack () {
    if (this.data.isAddToBookrack) return;
    wx.request({
      url: `${app.globalData.BASE_URL}/api/book/joinBookrack`,
      method: 'POST',
      data: {
        bookId: this.data.bookInfo.bookId
      },
      header: {
        // 默认值
        'content-type': 'application/json',
        // 读取sessionid,当作cookie传入后台将PHPSESSID做session_id使用
        'cookie': wx.getStorageSync("sessionId")
      },
      success: (res) => {
        let { errcode, bookIdList } = res.data;
        if (errcode === 0) {
          wx.showToast({
            title: '加入书架成功!',
            icon: 'success',
            duration: 2000
          });
          this.setData({
            'userInfo.bookIdList': JSON.parse(JSON.stringify(bookIdList))
          });
          app.globalData.userInfo.bookIdList = JSON.parse(JSON.stringify(bookIdList));
        } else if (errcode === 991) {
          // 服务器登录态失效

        } else if (errcode === 889) {
          // 书籍已添加
          wx.showToast({
            title: '小说已添加至书架!',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '加入书架失败!',
          icon: 'none',
          duration: 2000
        });
      }
    })
  }
})