// pages/recordlist/consume.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    dataList:[],
    refresh:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList()

  },
  refreshTap(e) {
    this.data.refresh = true
    this.setData({
      page:1,
      dataList:[]
    })
    this.getDataList();
  },
  // 跳转
  navTap(e) {
    let i = e.currentTarget.dataset.i,
    dataList = this.data.dataList;
    wx.setStorageSync('messageDetail', dataList[i]);
    dataList[i].isRead = 1;
    this.setData({
      dataList:dataList
    })
    wx.navigateTo({
      url: '/pages/recordlist/detail',
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
  // 获取通知列表
  getDataList() {
    this.setData({
      text:'加载中...'
    })
    http(url.appnotice,{
      limit:'20',
      page:this.data.page,
      personal:wx.getStorageSync('userInfo').userId
    },res=>{
      if(res.code == 0) {
        const totalPage=res.page.totalPage
        if(this.data.page<totalPage){//第一页是最后一页
          this.setData({
            text:'上拉加载更多'
          })
        }
        this.setData({
          dataList:this.data.dataList.concat(res.page.list),
          refresh:false,
          totalPage:totalPage,
        })
      }
    })
  },
  bottom(){
    if(this.data.page<this.data.totalPage){
      this.setData({
        page:this.data.page+1
      })
      this.getDataList()
    }else{
      this.setData({
        text:'没有更多!'
      })
    }
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