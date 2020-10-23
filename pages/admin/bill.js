// pages/admin/bill.js
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    limit:20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbilllist()
  },
  getbilllist(){
    let _this = this;
    http(url.recordlist,{
      createUserId:wx.getStorageSync('userInfo').userId,
      status:1,
      limit:_this.data.limit,
      page:_this.data.page
    },res=>{
      if(res.code == 0) {
        console.log(res)
        _this.setData({
          list:_this.data.list.concat(res.page.list),
          refresh:false,
          totalPage:res.page.totalPage
        })
      }
    },'Post','json')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if(page<totalPage){
      this.setData({
        page:this.data.page+1
      })
      this.getbilllist()
    }
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