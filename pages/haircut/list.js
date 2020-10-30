// pages/haircut/list.js
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
    imgUrl:url.imgUrl,
    refresh:false,
    tolower:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList();
  },
  // 下拉刷新
  refreshTap(e) {
    this.data.refresh = true
    this.setData({
      page:1,
      dataList:[]
    })
    this.getDataList();
  },
  // 滑动加载
  tolower(e) {
    if(!this.data.tolower) {
      return false;
    }
    this.setData({
      page:this.data.page+1,
      tolower:true,
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
  // 跳转
  navTo(e) {
    let i = e.currentTarget.dataset.i;
    wx.setStorageSync('lfInfo', this.data.dataList[i]);
    wx.navigateTo({
      url: '/pages/haircut/detail',
    })
  },
  // 获取数据
  getDataList() {
    let _this = this,
    page = this.data.page,
    limit = this.data.limit,
    list = this.data.dataList;
    http(url.ydList,{
      shopId:'9',
      page:page,
      limit:limit
    },(res)=>{
      if(res.code == 0) {
        list.push(...res.page.list);
        this.setData({
          dataList:res.page.list,
          refresh:false,
          tolower:res.page.totalCount > list.length ? true : false
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