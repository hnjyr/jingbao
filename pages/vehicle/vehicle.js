// pages/vehicle/vehicle.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    page:1,
    limit:20,
    imgUrl:url.imgUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList();
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
    let _this = this,
    page = this.data.page,
    limit = this.data.limit;
    http(url.listMyShop,{
      shopType:'7',
      page:page,
      limit:limit
    },(res)=>{
      if(res.code == 0) {
        this.setData({
          dataList:res.page.list
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