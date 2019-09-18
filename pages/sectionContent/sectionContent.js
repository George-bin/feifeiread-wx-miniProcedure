// pages/sectionContent/sectionContent.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: '',
    sectionId: '000000',
    // 章节信息
    section: '',
    height: 0,
    toView: '',
    // 目录顶部
    toCatalogView: '',
    openSet: false,
    // 打开目录
    openCatalog: false,
    // daytime: 白天 night: 夜晚
    readPattern: 'daytime',
    // 目录列表
    catalogData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      sectionId: options.sectionId,
      bookId: options.bookId,
      height: app.globalData.windowHeight,
      catalogData: JSON.parse(JSON.stringify(app.globalData.activeBookCatalog)),
      toCatalogView: 'catalog-top'
    });

    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log('catalogData', app.globalData.activeBookCatalog)
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
  onPullDownRefresh: function () {
    console.log('下拉~获取上一章内容');
    if (Number(this.data.sectionId) === 0) {
      wx.showToast({
        title: '当前已经处于第一章!',
        icon: "none",
        duration: 2000
      });
      this.setData({
        toView: 'top'
      });
      wx.stopPullDownRefresh();
      return;
    }
    wx.showLoading({
      title: '加载中',
    });
    // 加载上一章 start
    let sectionId = (Number(this.data.sectionId) - 1).toString().padStart(6, '0');
    this.setData({
      sectionId
    });
    this.getSectionContent()
     // 加载上一章 end
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉~')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  init: function () {
    let readPattern = wx.getStorageSync('readPattern');
    if (readPattern) {
      this.setData({
        readPattern
      });
      if (readPattern !== 'daytime') {
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#000000',
          animation: {
            duration: 400,
            timingFunc: 'easeIn'
          }
        });
      }
    }

    let catalogStorage = wx.getStorageSync('catalogStorage');
    if (catalogStorage && catalogStorage[this.data.bookId]) {
      this.setData({
        sectionId: catalogStorage[this.data.bookId]
      })
    }
    wx.showLoading({
      title: '加载中...',
    });
    this.getSectionContent();
  },

  // 获取章节内容
  getSectionContent () {
    wx.request({
      url: `${app.globalData.BASE_URL}/api/book/content/${this.data.bookId}/${this.data.sectionId}`,
      header: {
        // 默认值
        'content-type': 'application/json',
        // 读取sessionid,当作cookie传入后台将PHPSESSID做session_id使用
        'cookie': wx.getStorageSync("sessionId")
      },
      success: (response) => {
        // 设置章节缓存 start
        let catalogStorage = wx.getStorageSync('catalogStorage');
        if (catalogStorage) {
          catalogStorage = JSON.parse(JSON.stringify(catalogStorage));
          catalogStorage[this.data.bookId] = this.data.sectionId;
          wx.setStorage({
            key: 'catalogStorage',
            data: catalogStorage
          })
        } else {
          let data = {}
          data[this.data.bookId] = this.data.sectionId
          wx.setStorage({
            key: 'catalogStorage',
            data: data
          })
        }
        // 设置章节缓存 end
        this.setData({
          section: response.data.section
        });
        setTimeout(() => {
          this.setData({
            toView: 'top'
          });
        }, 200);
        wx.setNavigationBarTitle({
          title: response.data.section.title
        });
        wx.hideLoading();
        // 停止下拉刷新
        wx.stopPullDownRefresh();
      }
    })
  },

  // 滚动到底部
  onScrolltolower (e) {
    this.setData({
      toView: ''
    })
    // console.log(e)
    // console.log('上拉触底啦')

    wx.showLoading({
      title: '加载中',
    });
    // 加载下一章 start
    let sectionId = (Number(this.data.sectionId) + 1).toString().padStart(6, '0');
    this.setData({
      sectionId
    });
    this.getSectionContent()
     // 加载下一章 end
  },

  // 滚动到顶部
  onScrolltoupper (e) {
    if (Number(this.data.sectionId) === 0) {
      wx.showToast({
        title: '当前已经处于第一章!',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        toView: 'top'
      });
      wx.stopPullDownRefresh();
      return;
    }
    wx.showLoading({
      title: '加载中',
    });
    // 加载上一章 start
    let sectionId = (Number(this.data.sectionId) - 1).toString().padStart(6, '0');
    this.setData({
      sectionId
    });
    this.getSectionContent()
  },

  // 打开设置
  handleActiveSetUp (e) {
    console.log('打开设置');
    this.setData({
      openSet: true
    });
  },

  // 关闭设置
  handleCloseSetUp (e) {
    if (!this.data.openSet) return;
    console.log('关闭设置')
    this.setData({
      openSet: false
    });
  },

  // 显示目录
  handleOpenCatalog () {
    this.setData({
      openSet: false,
      openCatalog: true
    });
    setTimeout(() => {
      this.setData({
        toCatalogView: `catalog-${this.data.section.sectionId}`
      });
    }, 500);
  },

  // 切换阅读模式
  handleSwitchReadPattern () {
    if (this.data.readPattern === 'daytime') {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    } else {
      console.log(123)
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#4bb8c5',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
    this.setData({
      readPattern: this.data.readPattern === 'daytime' ? 'night' : 'daytime'
    });
    // 缓存 缓存模式
    wx.setStorage({
      key: 'readPattern',
      data: this.data.readPattern
    })
  },

  // 获取对应的章节信息
  handleGetSectionBySectionId (e) {
    console.log(e)
    let { sectionid } = e.currentTarget.dataset;
    this.setData({
      sectionId: sectionid
    });
    wx.showLoading({
      title: '加载中...',
    });
    this.getSectionContent();
  },

  // 获取目录数据
  getCatalogData () {
    app.getCatalogList()
      .then(res => {
        // console.log('目录信息', res)
        this.setData({
          catalogData: JSON.parse(JSON.stringify(app.globalData.activeBookCatalog)),
          toCatalogView: 'catalog-top'
        });
        wx.hideLoading();
      })
      .catch(err => {
        console.log(err);
        wx.hideLoading();
        wx.showToast({
          title: '获取目录列表失败!',
          icon: 'none'
        });
      })
  },

  // 获取更多目录信息
  handleMoreGetCatalog () {
    // let page = app.globalData.activeCatalogPage;
    app.globalData.activeCatalogPage += 1;
    wx.showLoading({
      title: '加载中...',
    });
    this.getCatalogData();
  },

  // 滚动到目录列表顶部
  onScrollCatalogtoupper () {
    if (app.globalData.activeCatalogPage === 0) return;
    app.globalData.activeCatalogPage -= 1;
    wx.showLoading({
      title: '加载中...',
    });
    this.getCatalogData();
  },
  
    // 关闭目录
  handleCloseCatalog () {
    this.setData({
      openCatalog: false
    });

    let secionIdIndex = this.data.catalogData.findIndex(item => item.sectionId === this.data.section.sectionId)
    if (secionIdIndex < 0) {
      let page = parseInt(this.data.section.sectionId / app.globalData.activeCatalogLimit);
      app.globalData.activeCatalogPage = parseInt(this.data.section.sectionId) > app.globalData.activeCatalogLimit ? (parseInt(this.data.section.sectionId) % app.globalData.activeCatalogLimit > 0 ? page : page - 1) : 0
      this.getCatalogData();
    }
  }
})