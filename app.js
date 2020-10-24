//app.js
const app = getApp()
const url = require('/utils/config.js');
const http = require('/utils/http.js');
App({
  globalData: {
    height: 20
  },
  onLaunch: function () {

    // 登录
    if(!wx.getStorageSync('cookie')) {
      this.loginMini()
    }

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
  // 登录
  loginMini() {
    wx.login({
      success: (res) => {
        wx.request({
          url: url.loginForWx,
          data: {
            code: res.code
          },
          header: {
            "Cookie": wx.getStorageSync('cookie'),
          },
          success: (res) => {
            if (res.data.code == 0) {
              var Cookie = res.header['Set-Cookie'].split(';')[0];
              wx.setStorageSync('cookie', Cookie);
              wx.setStorageSync('userInfo', res.data.user);
              wx.setStorageSync('dataList', res.data.data);
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }
          }
        })
      }
    })
  },
  goback() {
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