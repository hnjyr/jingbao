const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const vf = require('../../utils/verify.js');

// pages/chemist/opinion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    mobile:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  inputChange(e) {
    let str = e.currentTarget.dataset.name;
    this.setData({
      [str]:e.detail.value
    })
  },
  submit() {
    let { content, mobile } = this.data;
    if(!vf.isEmpty(content)) {
      app.showError('请输入您的意见！');
      return false;
    }
    if(!vf.isEmpty(mobile)) {
      app.showError('请输入您的联系方式！');
      return false;
    }
    if(!vf.isPhone(mobile)) {
      app.showError('请输入正确的联系方式！');
      return false;
    }
    http(url.opinionSave,{
      content,
      mobile,
      professionId:7
    },res=>{
      console.log(res)
      if(res.code == 0) {
        app.showSuccess('提交成功！',()=>{
          wx.navigateBack();
        })
      }
    },'post','json')
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