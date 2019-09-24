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
    openSet: false,
    // 当前操作小说
    activeBook: null,
    startTime: 0,
    endTime: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleGetBookRackInfo()
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
    wx.showLoading({
      title: '加载中',
    });
    app.getBookrackInfo()
      .then(data => {
        wx.hideLoading();
        this.setData({
          bookList: data.data.bookList
        });
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '获取书架信息失败!',
          icon: 'none'
        })
      })
  },


  // 手指按下
  handleTouchStart (e) {
    this.data.startTime = e.timeStamp;
  },

  //手指离开
  handleTouchEnd (e) {
    this.data.endTime = e.timeStamp;    
  },

  // 开始阅读
  handleStartRead (e) {
    // 避免点击事件和长按事件冲突
    if (this.data.endTime - this.data.startTime > 350) return;
    wx.showLoading({
      title: '加载中',
    })
    let { book } = e.currentTarget.dataset;
    app.globalData.activeBookInfo.bookId = book.bookId
    // 获取目录信息（对比缓存的章节，获取对应的目录列表）
    let catalogStorage = wx.getStorageSync('catalogStorage');
    if (catalogStorage && catalogStorage[book.bookId]) {
      let index = parseInt(catalogStorage[book.bookId]);
      let page = parseInt(index / app.globalData.activeCatalogLimit);
      app.globalData.activeCatalogPage = parseInt(index) > app.globalData.activeCatalogLimit ? (parseInt(index) % app.globalData.activeCatalogLimit > 0 ? page : page - 1) : 0;
    }

    app.getCatalogList()
      .then(data => {
        wx.hideLoading();
        let { errcode, catalogData } = data.data;
        if (errcode === 0) {
          wx.navigateTo({
            url: `../sectionContent/sectionContent?sectionId=000000&bookId=${book.bookId}`,
          })
        } else if (errcode === 998) {
          wx.showToast({
            title: '暂无数据!',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误!',
          icon: 'none'
        });
      })
  },

  // 操作书架上的小说
  handleOpenSetBook (e) {
    // console.log('准备删除', e)
    let { book } = e.currentTarget.dataset;
    this.setData({
      openSet: true,
      activeBook: JSON.parse(JSON.stringify(book))
    });
  },

  // 关闭小说设置
  handleCloseSetBook () {
    this.setData({
      openSet: false
    });
  },

  // 移出书架
  handleRemoveBook () {
    this.setData({
      openSet: false
    });
    wx.showModal({
      title: '移出书架',
      content: '确定将移出书架吗?',
      success: () => {
        wx.request({
          url: `${app.globalData.BASE_URL}/api/book/removeBookrack`,
          method: 'POST',
          data: {
            bookId: this.data.activeBook.bookId
          },
          header: {
            // 默认值
            'content-type': 'application/json',
            // 读取sessionid,当作cookie传入后台将PHPSESSID做session_id使用
            'cookie': wx.getStorageSync("sessionId") 
          },
          success: (res) => {
            console.log('移出书架成功!', res);
            let { errcode, bookId } = res.data;
            if (errcode === 0) {
              let index = this.data.bookList.findIndex(item => {
                return item.bookId === bookId;
              });
              this.data.bookList.splice(index, 1);
              this.setData({
                bookList: this.data.bookList
              });
            }
          },
          fail: (err) => {
            console.log('移出书架失败!', err);
          }
        })
      },
      fail: () => {
        console.log('取消移出书架!');
      }
    });
  }
})