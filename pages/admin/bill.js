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
    limit:20,
    text:'上拉加载更多'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbilllist()
  },
  getbilllist(){
    this.setData({
      text:'加载中...'
    })
    let _this = this;
    http(url.recordlist,{
      createUserId:wx.getStorageSync('userInfo').userId,
      status:1,
      limit:_this.data.limit,
      page:_this.data.page
    },res=>{
      if(res.code == 0) {
        const totalPage=res.page.totalPage
        if(_this.data.page<totalPage){//第一页是最后一页
          this.setData({
            text:'上拉加载更多'
          })
        }
        _this.setData({
          list:_this.data.list.concat(res.page.list),
          refresh:false,
          totalPage:totalPage
        })
      }
    },'Post','json')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },
  refreshTap(){
    this.setData({
      page:1,
      list:[],
    })
    this.getbilllist();
  },
  bottom(){
    if(this.data.page<this.data.totalPage){
      this.setData({
        page:this.data.page+1
      })
      this.getbilllist()
    }else{
      this.setData({
        text:'没有更多!'
      })
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