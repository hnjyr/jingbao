// pages/repair/repair.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:url.imgUrl,
    page:1,
    limit:20,
    dataList:[],
    list:[],
    activeKey:0,
    refresh:false,
    tolower:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  // 下拉刷新
  refreshTap(e) {
    this.data.refresh = true
    this.setData({
      page:1
    })
    this.getDataList();
  },
  onChange(e) {
    this.setData({
      list:this.data.dataList[e.detail].goodsList,
      tolower:false
    })
  },
  navTo(e){
    let i = e.currentTarget.dataset.i;
    let obj = this.data.list[i];
    wx.navigateTo({
      url: `/pages/repair/apply?goodsName=${obj.goodsName}&goodsId=${obj.goodsId}`,
    })
  },
  //获取数据
  getDataList() {
    let page = this.data.page,
    limit = this.data.limit;
    http(url.listLabelGoods,{
      "labelType":"1",
      "shopId":"12",
    },res=>{
      console.log(res);
      this.setData({
        dataList:res.page.list,
        list:res.page.list[0].goodsList
      })
    },'GET')
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