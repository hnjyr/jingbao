// pages/admin/wallet.js
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    show: false,
    veCode: new Array(),
    veCodetwo:[],
    time: 60,
    twoshow:false,
    inputFocus:false
  },

  onClose() {
    this.setData({ 
      show: false,
      veCode: new Array(),
      veCodetwo:[],
      twoshow:false,
      inputFocus:false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbalance()
  },
  
  paypwd() {
    this.setData({ show: true,inputFocus:true });
  },

  inputValue(e) {
    console.log(e)
    let value = e.detail.value;
    let arr = [...value];
    this.setData({ veCode: arr })
    if(arr.length==6){
      this.setData({ twoshow: true })
    }
  },
  inputValuetwo(e) {
    console.log(e)
    let value = e.detail.value;
    let arr = [...value];
    this.setData({ veCodetwo: arr })
    if(arr.length==6){
      // 调用设置支付密码
      var str1=this.data.veCode.join('')
      var str2=this.data.veCodetwo.join('')
      this.setPayMi(str1,str2)
    }
  },

  // a1 新密码  a2旧密码  type 1添加 2修改
  setPayMi(a1,a2,type){
    const that=this
    wx.request({
      url: url.updatePayPassword,
      data:{
        newPayPassword:a2,
        oldPayPassword:a1
      },
      header:{
        "Cookie": wx.getStorageSync('cookie'),
      },
      method:'POST',
      success:(res)=>{
        console.log(res)
        if(res.data.code=500){
          app.showError(res.data.msg);
        }else{
          app.showSuccess(res.data.msg);
        }
      },
      complete:()=>{
        that.setData({
          show:false,
          veCodetwo:[],
          veCode:[],
          inputFocus:false,
          twoshow:false
        })
      }
    })
  },

  getbalance() {
    const that = this
    http(url.getPurse,{
    },res=>{
      if(res.code == 0) {
        console.log(res)
        that.setData({
          balance:res.data.balance,
          payPassword:res.data.payPassword
        })
        wx.setStorageSync('payPassword', res.data.payPassword!=null?res.data.payPassword:0)
        var exemptPassword={
          'isExemptPassword':res.data.isExemptPassword,
          'exemptPasswordAmount':res.data.exemptPasswordAmount
        }
        wx.setStorageSync('exemptPassword', exemptPassword)
      }
    },'GET')
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