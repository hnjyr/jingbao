const http = require("../../utils/http");
const url = require('../../utils/config.js');
// pages/recordlist/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let dataInfo = wx.getStorageSync('messageDetail');
    this.setData({
      dataInfo:dataInfo
    })
    wx.removeStorage({
      key: 'messageDetail',
    })
    // 请求已读接口
    http(url.updateByNoticeId,{
      noticeId:this.data.dataInfo.noticeId
    },res=>{
      console.log(res)
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