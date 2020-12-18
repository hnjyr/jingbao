// pages/chemist/search.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText:'',
    dataList:[],
    limit:-1,
    page:1,
    imgUrl:url.imgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      searchText:options.search
    })
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
  onChange(e) {
    this.setData({
      searchText:e.detail
    })
  },
  onClick() {
    this.getDataList();
  },
  onSearch() {
    this.getDataList();
  },
   // 跳转详情
  navTag(e) {
    let i = e.currentTarget.dataset.i;
    wx.setStorageSync('ypInfo', this.data.dataList[i]);
    wx.navigateTo({
      url: '/pages/chemist/detail',
    })
  },
  getDataList() {
    http(url.shopgoods,{
      publishState:'1',
      goodsName:this.data.searchText,
      shopId:'7',
      limit:this.data.limit,
      // page:this.data.page,
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