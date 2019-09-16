let app = getApp();
// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginForm: {
      account: '',
      password: ''
    },
    userInfo: null,
    loading: false
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
    this.init();
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
      title: '个人中心',
    });
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },

  // 获取用户名
  handleGetAccount (e) {
    this.setData({
      'loginForm.account': e.detail.value
    });
  },
  // 获取密码
  handleGetPassword(e) {
    this.setData({
      'loginForm.password': e.detail.value
    });
  },
  // 用户登录
  handleLogin (e) {
    console.log(e)
    // 允许获取用户信息
    if (e.detail.errMsg === 'getUserInfo:ok') {
      this.setData({
        loading: true
      });
      app.getOpenid()
        .then(() => {
          wx.request({
            url: `${app.globalData.BASE_URL}/api/book/wx/login`,
            method: 'post',
            data: {
              ...this.data.loginForm,
              username: e.detail.userInfo.nickName,
              avatarUrl: e.detail.userInfo.avatarUrl
            },
            header: {
              // 默认值
              'content-type': 'application/json',
              // 读取sessionid,当作cookie传入后台将PHPSESSID做session_id使用
              'cookie': wx.getStorageSync("sessionId")
            },
            success: (res) => {
              console.log(res);
              if (res.data.errcode === 0) {
                wx.showToast({
                  title: '登录成功',
                  icon: 'success',
                  duration: 2000
                });
                app.globalData.userInfo = res.data.userInfo;
                this.setData({
                  userInfo: res.data.userInfo,
                  loading: false
                });
              }
            },
            fail: (err) => {
              console.log(err);
              app.globalData.userInfo = null;
              this.setData({
                loading: false
              });
            }
          })
        })
    }
  },
  // 用户注销
  handleLogon () {
    wx.showModal({
      title: '退出登录',
      content: '确定退出当前用户吗？',
      success: () => {
        wx.request({
          url: `${app.globalData.BASE_URL}/api/book/wx/logon`,
          method: 'POST',
          header: {
            // 默认值
            'content-type': 'application/json',
            // 读取sessionid,当作cookie传入后台将PHPSESSID做session_id使用
            'cookie': wx.getStorageSync("sessionId")
          },
          success: (res) => {
            let { errcode } = res.data;
            if (errcode === 0) {
              app.globalData.userInfo = null;
              this.setData({
                userInfo: null
              });
              wx.removeStorage({
                key: 'sessionId'
              });
            }
          },
          fail: (e) => {
            console.log('退出登录失败!', e)
          }
        })
      },
      fail: () => {
        console.log('取消退出登录!')
      }
    })
  }
})