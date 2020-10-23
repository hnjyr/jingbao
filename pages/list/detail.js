// pages/list/detail.js
const url = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    mealInfo:'',
    imgUrl:url.imgUrl,
    carList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type,
      mealInfo:wx.getStorageSync('mealInfo')
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
    let list = wx.getStorageSync('carList')||[];
    this.setData({
      carList:list
    })
  },
  addCar() {
    let list = this.data.carList,
    obj = this.data.mealInfo;
    obj.amount = 1;
    if(list.length == 0) {
      list.push(obj)
    }else {
      let flag = list.findIndex((v)=>{
        return v.id == obj.id;
      })
      if(flag == -1) {
        list.push(obj)
      }else {
        list[flag].amount = list[flag].amount?list[flag].amount+1:2;
      }
    }
    this.setData({
      carList:list
    })
    wx.setStorage({
      data: list,
      key: 'carList',
    })
    app.showSuccess('添加成功！')
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