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
    height: app.globalData.windowHeight,
    toView: '',
    openSet: false,
    // daytime: 白天 night: 夜晚
    readPattern: 'daytime'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      sectionId: options.sectionId,
      bookId: options.bookId
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init()
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
  }
})