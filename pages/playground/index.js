// pages/playground/index.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curid:1,
    imgUrl:url.imgUrl,
    dataList1:[],
    dataList2:[],
    dataList3:[],
    page:1,
    limit:20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList();
    
  },
  check(e){
    this.setData({
      curid:e.currentTarget.dataset.id,
      page:1
    })
    this.getDataList()
  },
  back(){
    app.goback()
  },
  // 获取数据
  getDataList() {
    let classifyId = this.data.curid,
      page = this.data.page,
      limit = this.data.limit;
    http(url.ydList,{
      shopType:'5',
      classifyId:classifyId,
      page:page,
      limit:limit
    },(res)=>{
      if(res.code == 0) {
        let str = 'dataList' + classifyId;
        this.setData({
          [str]:res.page.list
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