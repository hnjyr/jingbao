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
    refresh:false,
    allchoose:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList()

  },
  // 长按删除
  longpressClick(e){
    let _this = this
    let arr = []
    arr.push(e.currentTarget.dataset.id)
    wx.showModal({
      title:"提示",
      content:'是否确认删除',
      success: function (res) {
        if (res.confirm) {
          http(url.appnoticeDelete,
            arr
          ,res=>{
            if(res.code == 0) {
              _this.data.refresh = true
              _this.setData({
                page:1,
                dataList:[]
              })
              _this.getDataList();
            }
          },'Delete','json')
        } else {
          console.log('用户点击取消')
        }
 
      }
    })
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
      id = e.currentTarget.dataset.id,
    dataList = this.data.dataList;
    dataList[i].isRead = 1;
    this.setData({
      dataList:dataList
    })
    wx.navigateTo({
      url: '/pages/recordlist/detail?id='+id,
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
      text:''
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
        // 防止全选中时候分页加载出现数据未全选问题
        if(!this.data.allchoose){
          res.page.list.map(item=>{
            item.isfalse = false
          })
        }else{
          res.page.list.map(item=>{
            item.isfalse = true
          })
        }
       
        this.setData({
          dataList:this.data.dataList.concat(res.page.list),
          refresh:false,
          totalPage:totalPage,
        })
        console.log(this.data.dataList)
      }
    })
  },
  // 多删
  deleteBtn(){
    let _this = this
    let arr = []
    let arrNum = []
    arr = this.data.dataList
    wx.showModal({
      title:"提示",
      content:'是否确认删除',
      success: function (res) {
        if (res.confirm) {
          arr.map(item=>{
            if(!item.isfalse){
              arrNum.push(item.noticeId)
            }
          })
          http(url.appnoticeDelete,
            arrNum
          ,res=>{
            if(res.code == 0) {
              _this.data.refresh = true
              _this.setData({
                page:1,
                dataList:[]
              })
              _this.getDataList();
            }
          },'Delete','json')
        } else {
          console.log('用户点击取消')
        }
 
      }
    })
  },
  // 全选操作
  allChooseBtn(){
    let arr;
    arr = this.data.dataList
   
    if(this.data.allchoose){
      arr.map((item,i)=>{
          item.isfalse = !item.isfalse
      })
      this.setData({
        allchoose:false,
      })
    }else{
      arr.map((item,i)=>{
          item.isfalse = !item.isfalse
      })
      this.setData({
        allchoose:true,
      })
    }
    this.setData({
      dataList:arr,
    })
  },
  // 选择操作
  chooseDelete(e){
    let arr;
    let istrue=true;
    arr = this.data.dataList
    arr.map((item,i)=>{
      if(i==e.currentTarget.dataset.i){
        item.isfalse = !item.isfalse
      }
      if(item.isfalse){
        istrue = false
      }
    })
    if(!istrue){
      this.setData({
        allchoose:true
      })
    }else{
      this.setData({
        allchoose:false
      })
    }
    this.setData({
      dataList:arr,
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