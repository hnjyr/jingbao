// pages/list/order.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curid:1,
    tittext:'订餐列表',
    activeKey: 0,
    list:[
      {text:'分类1',id:0},
      {text:'分类2',id:1},
      {text:'分类3',id:2},
      {text:'分类4',id:3},
      {text:'分类4',id:4},
    ],
    jclist:[
      {text:'早餐',id:0},
      {text:'午餐',id:1},
      {text:'晚餐',id:2},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height:app.globalData.height
    })
  },
  check(e){
    this.setData({
      curid:e.currentTarget.dataset.id
    })
    this.setData({
      tittext:e.currentTarget.dataset.id==1?'订餐列表':'就餐'
    })
  },
  onChange(event) {
    Notify({ type: 'primary', message: event.detail });
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