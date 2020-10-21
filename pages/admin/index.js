// pages/admin/index.js
const app=getApp();
import Toast from '../../miniprogram/@vant/weapp/toast/toast.js'; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:0,
    list:[
      {
        text:'订餐记录',
        imgsrc:'/images/admin/Ordermeal.png',
        url:'/pages/recordlist/dining'
      },{
        text:'维修记录',
        imgsrc:'/images/admin/maintain.png',
        url:'/pages/recordlist/maintain?type=1'
      },{
        text:'预约记录',
        imgsrc:'/images/admin/makeAppointment.png',
        url:'/pages/recordlist/maintain?type=2'
      },{
        text:'消息通知',
        imgsrc:'/images/admin/buydrug.png',
        url:'/pages/recordlist/consume'
      }
    ],
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height:wx.getStorageSync('titHeight')
    })
  },
  navTo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
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
    let userInfo = wx.getStorageSync('userInfo')?wx.getStorageSync('userInfo'):'';
    if(userInfo) {
      this.setData({
        userInfo:userInfo
      })
    }else {
      Toast('请先登录~');
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