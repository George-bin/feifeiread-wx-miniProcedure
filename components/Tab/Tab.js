// components/Tab/Tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabList: [
      {
        path: '/pages/bookrack/bookrack',
        icon: 'iconfont icon-shujia',
        label: '我的书架'
      },
      {
        path: '/pages/index/index',
        icon: 'iconfont icon-tianchongxing-',
        label: '书城'
      },
      {
        path: '/pages/my/my',
        icon: 'iconfont icon-wode',
        label: '个人中心'
      }
    ],
    currPage: null
  },

  ready() {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];

    this.setData({
      currPage: currPage.route
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSwitchTab(event) {
      let { path } = event.currentTarget.dataset;
      console.log('当前Tab路由', this.data.currPage);
      if (path.indexOf(this.data.currPage) > -1) {
        console.log('处于当前路由页面');
      } else {
        wx.navigateTo({
          url: path
        });
      }
    }
  }
})
