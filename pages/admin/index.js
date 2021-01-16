// pages/admin/index.js
const app=getApp();
import Toast from '../../miniprogram/@vant/weapp/toast/toast.js'; 
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:20,
    list:[
      {
        text:'订餐记录',
        imgsrc:'/images/admin/Ordermeal.png',
        url:'/pages/recordlist/dining?status=1'
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
    userInfo:'',
    src:'',
    imgUrl:url.imgUrl,
    isRed:false
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
    if(e.currentTarget.dataset.url == '/pages/index/code') {
      app.getDyInfo(['5JWugDNNHLwmdQGqr0JLrZqTh7-2WuRXI2JC3vH8tYs'],()=>{
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        })
      })
    }else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  // 获取消息红点
  getRed() {
    http(url.getNoRead, {}, res => {
      console.log(res)
      if (res.code == 0) {
        if(res.count > 0) {
          this.setData({
            isRed:true
          })
        }
        // wx.setStorageSync('userInfo', res.user);
      }
    }, 'GET', 'json')
  },
  // 获取用户信息
  getinfo() {
    const that = this
    http(url.getuserinfo, {}, res => {
      if (res.code == 0) {
        wx.setStorageSync('userInfo', res.user);
      }
    }, 'GET', 'json')
  },
  
  // showimg(){
  //   const that=this
  //   wx.request({
  //     url: url.download+that.data.userInfo.avatar,
  //     method:'get',
  //     responseType: 'arraybuffer', 
  //     header:{
  //       "Cookie":wx.getStorageSync('cookie'),
  //       "Content-Type":"application/form-data"
  //     },
  //     success:(res)=>{
  //       let url ='data:image/png;base64,'+wx.arrayBufferToBase64(res.data)
  //       that.setData({
  //         src:url
  //       })
  //     }
  //   })
  // },
  toast(){
    app.showError('功能正在开发，敬请期待!')
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
        userInfo:userInfo,
        src:this.data.imgUrl + userInfo.avatar
      })
      this.getRed();
      // this.showimg(userInfo.avatar)
      // this.getinfo()
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