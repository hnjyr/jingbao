// pages/recordlist/maintain.js
// 获取应用实例
const app=getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    createUserId:'182',
    limit:'20',
    page:1,
    type:'1',
    userInfo:'',
    wxDataList:[],
    yyDataList:[],
    refresh:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = '维修记录';
    this.setData({
      userInfo:wx.getStorageSync('userInfo'),
      type:options.type
    })
    options.type == 1?this.getWxList():this.getYyList();
    title = options.type == 2?'预约记录':'维修记录';
    if(options.type == 2) {
      wx.setNavigationBarTitle({
        title:title
      })
    }
  },
  refreshTap(e) {
    this.data.refresh = true
    this.setData({
      page:1
    })
    this.data.type == 1?this.getWxList():this.getYyList();
  },
  // 维修
  getWxList(){
    const {userInfo,limit,page}=this.data
    http(url.repairrecordinfo,{
      createUserId:userInfo.userId,
      limit,
      page
    },(res)=>{
      if(res.code == 0) {
        this.setData({
          wxDataList:res.page.list,
          refresh:false
        })
      }
    })
  },
  // 预约
  getYyList(){
    const {userInfo,limit,page}=this.data
    http(url.appointment,{
      createUserId:userInfo.userId,
      limit,
      page
    },(res)=>{
      if(res.code == 0) {
        this.setData({
          yyDataList:res.page.list,
          refresh:false
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