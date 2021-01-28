// pages/list/detail.js
const app = getApp();
const url = require('../../../utils/config.js');
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
      mealInfo:wx.getStorageSync('wzInfo')
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
    let list = wx.getStorageSync('wzList')||[];
    this.setData({
      carList:list
    })
  },
  addCar() {
    let list = JSON.parse(JSON.stringify(this.data.carList)),
    obj = this.data.mealInfo;
    obj.amount = 1;
    // if(obj.remaining == 0) {
    //   app.showError('剩余库存不足！');
    //   return false;
    // }
    if(list.length == 0) {
      list.push(obj)
    }else {
      let flag = list.findIndex((v)=>{
        return v.id == obj.id;
      })
      if(flag == -1) {
        list.push(obj)
      }else {
        // if(list[flag].amount >= obj.remaining) {
        //   app.showError('剩余库存不足！')
        //   return false;
        // }
        // let limitedQuantity = obj.limitedQuantity;
        // if(limitedQuantity == list[flag].amount) {
        //   app.showError(`每人限购${limitedQuantity}份！`);
        //   return false;
        // }
        list[flag].amount = list[flag].amount+1;
      }
    }
    this.setData({
      carList:list
    })
    wx.setStorage({
      data: list,
      key: 'wzList',
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