//app.js
App({
  onLaunch: function () {
    this.init();
    this.getSystemInfo()
  },
  init: function () {
    wx.checkSession({
      success: (res) => {
        if (wx.getStorageSync('sessionId')) {
          this.autoLogin();
        }
      },
      fail: (err) => {
        // 重新登录微信服务
        this.getOpenid()
          .then(() => {
            this.autoLogin();
          })
      }
    })
  },
  // 自动登录
  autoLogin () {
    wx.request({
      url: `${this.globalData.BASE_URL}/api/book/wx/login`,
      method: 'post',
      data: {
        account: 'geng',
        password: '123'
      },
      header: {
        // 默认值
        'content-type': 'application/json',
        // 读取sessionid,当作cookie传入后台将PHPSESSID做session_id使用
        'cookie': wx.getStorageSync("sessionId")
      },
      success: (res) => {
        console.log(res);
        let { errcode } = res.data
        if (res.data.errcode === 0) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          });
          this.globalData.userInfo = res.data.userInfo;
          this.getBookrackInfo();
        } else if (errcode === 991) {
          // 服务器登录态失效
          this.getOpenid()
            .then(() => {
              this.autoLogin();
            }) 
        }
      },
      fail: (err) => {
        console.log(err);
        this.globalData.userInfo = null;
      }
    })
  },
  // 获取openid(登录微信服务器)
  getOpenid () {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          console.log(res)
          let { code } = res;
          wx.request({
            url: `${this.globalData.BASE_URL}/api/book/wx/getOpenid`,
            method: 'POST',
            data: {
              code
            },
            success: (res) => {
              wx.setStorage({
                key: 'sessionId',
                data: res.header['Set-Cookie']
              });
              resolve();
            },
            fail: (err) => {
              console.log(err)
              reject(err)
            }
          })
        },
        fail: (err) => {
          console.log('微信服务器登录失败!');
          wx.showToast({
            title: '微信服务器登录失败!',
            icon: 'none'
          });
          reject(err);
        }
      });
    })
  },

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

  // 获取书架信息
  getBookrackInfo () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.BASE_URL}/api/book/bookrackInfo`,
        method: 'GET',
        header: {
          // 默认值
          'content-type': 'application/json',
          // 读取sessionid,当作cookie传入后台将PHPSESSID做session_id使用
          'cookie': wx.getStorageSync("sessionId")
        },
        success: (res) => {
          let { errcode, bookList } = res.data;
          if (res.data.errcode === 0) {
            this.globalData.bookrackList = bookList
          }
          resolve(res)
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },

  globalData: {
    // 用户信息
    userInfo: null,
    // BASE_URL: 'http://localhost',
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
    activeCatalogLimit: 30,
    // 当前分类书籍
    activeClassify: {},
    // 书架列表
    bookrackList: []
  }
})