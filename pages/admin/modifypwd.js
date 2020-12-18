// pages/admin/modifypwd.js
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
import Notify from '../../miniprogram/@vant/weapp/notify/notify.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password:'',
    newpwd:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  userInput(e){
    this.setData({
      password:e.detail.value
    })
  },
  pwdInput(e){
    this.setData({
      newpwd:e.detail.value
    })
  },
  confirm(){
    const {password,newpwd}=this.data;
    if(!password) {
      Notify({ type: 'danger', message: '请输入原密码' });
      return false;
    }
    if(!newpwd) {
      Notify({ type: 'danger', message: '请输入新密码' });
      return false;
    }
    http(url.password,{
      password:password,
      newPassword:newpwd
    },res=>{
      if(res.code == 0) {
        wx.clearStorageSync('cookie')
        wx.clearStorageSync('payPassword')
        wx.clearStorageSync('userInfo')
        wx.clearStorageSync('dataList')
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    },'GET','json')
    
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