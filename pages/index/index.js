//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navList:[
      {
        name:'餐厅',
        src:'',
        url:'',
      },
      {
        name:'理发店',
        src:'',
        url:'',
      },
      {
        name:'药店',
        src:'',
        url:'',
      },
      {
        name:'班车',
        src:'',
        url:'',
      },
      {
        name:'洗衣店',
        src:'',
        url:'',
      },
      {
        name:'运动场',
        src:'',
        url:'',
      },
      {
        name:'警营维修',
        src:'',
        url:'',
      },
      {
        name:'理疗',
        src:'',
        url:'',
      }
    ],
    record:[
      {
        name:'订餐记录',
        src:'',
        url:'',
      },
      {
        name:'维修记录',
        src:'',
        url:'',
      },
      {
        name:'预约记录',
        src:'',
        url:'',
      },
      {
        name:'购药记录',
        src:'',
        url:'',
      }
    ],
    declare:[
      {
        name:'办公用品申报',
        src:'',
        url:'',
      },
      {
        name:'用车管理申报',
        src:'',
        url:'',
      }
    ]
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
