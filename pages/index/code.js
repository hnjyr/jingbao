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
    second:30,
    imgSrc:url.imgUrl,
    src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setInterval(()=>{
      this.setData({
        second:this.data.second - 1
      })
      if(this.data.second == 0) {
        this.getCode();
        this.setData({
          second:30
        })
      }
    },1000)
    this.getCode();
  },
  getCode() {
    let _this = this;
    wx.request({
      url: url.payQrcode,
      method:'GET',
      responseType: 'arraybuffer',
      header:{
        "X-Requested-With":"WXCHART",
        "Cookie": wx.getStorageSync('cookie'),
      },
      success(res) {
        console.log(res.data);
        let url ='data:image/png;base64,'+wx.arrayBufferToBase64(res.data)
        _this.setData({
          src:url,
        })
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