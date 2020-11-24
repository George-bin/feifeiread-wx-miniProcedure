// components/TabItem/TabItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: {
      type: String,
      value: ''
    },
    label: {
      type: String,
      value: ''
    },
    path: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currPage: null
  },

  ready() {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];

    this.setData({
      currPage: currPage.route
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSwitchTab () {
      console.log('当前Tab路由', this.data.currPage);
      if (this.properties.path.indexOf(this.data.currPage) > -1) {
        console.log('处于当前路由页面');
      } else {
        wx.navigateTo({
          url: this.properties.path
        });
      }
    }
  }
})
