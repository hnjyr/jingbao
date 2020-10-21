// pages/recordlist/dining.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:url.imgUrl,
    userInfo:'',
    limit:20,
    page:1,
    dataList:[],
    refresh:false
  },
  refreshTap(e) {
    this.setData({
      page:1
    })
    this.getDataList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
    this.getDataList();
  },
  // 跳转
  navTap(e) {
    let i = e.currentTarget.dataset.i;
    wx.setStorage({
      data: this.data.dataList[i],
      key: 'orderDetail',
    })
    wx.navigateTo({
      url: '/pages/order/order',
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
  // 获取数据
  getDataList() {
    let createUserId = this.data.userInfo.userId,
    shopType = '1',
    limit = this.data.limit,
    page = this.data.page;
    http(url.orderingList,{
      createUserId,
      shopType,
      limit,
      page
    },res=>{
      if(res.code == 0) {
        this.setData({
          dataList:res.page.list,
          refresh:false
        })
      }
    })
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