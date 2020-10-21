// pages/index/code.js
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer:'',
    second:60,
    imgSrc:url.imgUrl,
    src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCode()
  },
  getCode() {
    let _this = this;
    wx.request({
      url: url.payQrcode,
      method:'GET',
      header:{
        "X-Requested-With":"WXCHART",
        "Cookie": wx.getStorageSync('cookie'),
      },
      success(res) {
        console.log(res)
        _this.setData({
          src:res.data
        })
      }
    })
    // http(url.payQrcode,{},res=>{
    //   console.log(res)
    // },'GET')
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