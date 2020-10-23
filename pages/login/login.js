const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
import Notify from '../../miniprogram/@vant/weapp/notify/notify.js';
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: 'test1',
    pwd: '111111',
    loginType: 'wx'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
  },
  // 输入框赋值
  userInput(e) {
    this.setData({
      username: e.detail.value
    })
  },
  pwdInput(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  confirm() {
    const {
      username,
      pwd,
      loginType
    } = this.data;
    if (!username) {
      Notify({
        type: 'danger',
        message: '请输入用户名'
      });
      return false;
    }
    if (!pwd) {
      Notify({
        type: 'danger',
        message: '请输入密码'
      });
      return false;
    }
    let header = 'application/x-www-form-urlencoded'
    wx.request({
      url: url.login,
      method: 'post',
      data: {
        userName: username,
        password: pwd,
        loginType
      },
      header: {
        "Content-Type": header
      },
      success: (res) => {
        console.log(res)
        if (res.data.code == 0) {
          var Cookie = res.header['Set-Cookie'].split(';')[0];
          wx.setStorageSync('cookie', Cookie);
          wx.setStorageSync('userInfo', res.data.user);
          wx.setStorageSync('dataList', res.data.data);
          wx.login({
            success: (res) => {
              console.log(res.code)
              wx.request({
                url: url.loginForWx,
                data: {
                  code: res.code
                },
                header: {
                  "Cookie": wx.getStorageSync('cookie'),
                },
                success: (res) => {
                  console.log(res)
                  wx.reLaunch({
                    url: '/pages/index/index'
                  })
                }
              })
            }
          })

        } else {
          Notify({
            type: 'danger',
            message: res.data.msg
          });
        }
      },
      complete: () => {

      }
    })
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

  }
})