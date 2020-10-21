// pages/chemist/chemist.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    dataList:[],
    tagList:[],
    page:1,
    limit:10,
    labelId:'',
    imgUrl:url.imgUrl,
    searchText:'',
    refresh:false
  },
  onChange1(e) {
    this.setData({
      searchText:e.detail
    })
  },
  onChange(event) {
    this.setData({
      labelId:this.data.tagList[event.detail].labelId,
      page:1,
      activeKey:event.detail
    })
    this.getDataList();
  },
  // 滑动加载
  tolower() {
    this.setData({

    })
    // this.getDataList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTagList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 下拉刷新
  refreshTap(e) {
    this.data.refresh = true
    this.setData({
      page:1
    })
    this.getDataList();
  },
  // 搜索
  onClick() {
    wx.navigateTo({
      url: '/pages/chemist/search?search='+this.data.searchText,
    })
  },
  onSearch() {
    wx.navigateTo({
      url: '/pages/chemist/search?search='+this.data.searchText,
    })
  },
  // 跳转详情
  navTag(e) {
    let i = e.currentTarget.dataset.i;
    wx.setStorageSync('ypInfo', this.data.dataList[i]);
    wx.navigateTo({
      url: '/pages/chemist/detail',
    })
  },
  // 获取标签
  getTagList() {
    http(url.shopgoodslabel,{
      shopId:'7'
    },(res)=>{
      console.log(res)
      if(res.code == 0) {
        this.setData({
          tagList:res.page.list,
          labelId:res.page.list[0].labelId
        })
        this.getDataList();
      }
    })
  },
  // 获取列表
  getDataList() {
    let _this = this,
    labelId =  _this.data.labelId,
    limit =  _this.data.limit,
    page =  _this.data.page;
    http(url.shopgoods,{
      publishState:'1',
      labelId:labelId,
      shopId:'7',
      limit:limit,
      page:page,
    },(res)=>{
      console.log(res)
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