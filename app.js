//app.js
App({
  globalData:{
    height:20
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
       wx.setStorage({
         data: res.statusBarHeight,
         key: 'titHeight',
       })
      }
    })
  },
  globalData: {
    userInfo: null
  },
  goback(){
    wx.navigateBack()
  },
  /**
   * 显示成功提示框
   */
  showSuccess(msg, callback) {
    wx.showToast({
      title: msg,
      icon: 'success',
      mask: true,
      duration: 1500,
      success() {
        callback && (setTimeout(function () {
          callback();
        }, 800));
      }
    });
  },
  /**
   * 显示失败提示框
   */
  showError(msg, callback) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success(res) {
        // callback && (setTimeout(function() {
        //   callback();
        // }, 1500));
        callback && callback();
      }
    });
  },
})