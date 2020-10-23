// pages/order/order.js
//获取应用实例
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:{},
    twoshow:false,
    show: false,
    veCode: new Array(),
    veCodetwo:[],
    inputFocus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dataInfo:wx.getStorageSync('orderDetail'),
    })
    wx.removeStorage({
      key: 'orderDetail',
    })
    this.getbalance()
  },
  // 点击支付
  payBtn(){
    const {exemptPassword,dataInfo,payPassword}=this.data
    // console.log(exemptPassword)
    // console.log(dataInfo)
    // console.log(payPassword)
    // 判断是否免密支付
    if(exemptPassword.isExemptPassword==0||exemptPassword.exemptPasswordAmount<dataInfo.totalPrice){
      // 没有开启免密支付或额度超过
      if(payPassword==1){//已设置过支付密码
        this.setData({
          show:true
        })
      }else{//显示设置支付密码在输入密码
        this.setData({
          show:true
        })
      }
    }else{//开启免密支付不显示输入密码
      this.payForUser()
    }
  },
  inputValue(e) {
    console.log(e)
    let value = e.detail.value;
    let arr = [...value];
    this.setData({ veCode: arr })
    console.log(this.data.payPassword)
    if(arr.length==6&&this.data.payPassword==0){
      this.setData({ twoshow: true })
    }else if(arr.length==6&&this.data.payPassword==1){
      // console.log('密码输入完成校验支付密码')
      var str1=this.data.veCode.join('')
      this.verifymi(str1)
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
          that.getbalance()
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
      wx.setStorageSync('payPassword', res.data.payPassword!=null?res.data.payPassword:0)
      var exemptPassword={
        'isExemptPassword':res.data.isExemptPassword,
        'exemptPasswordAmount':res.data.exemptPasswordAmount
      }
      that.setData({
        balance:res.data.balance,
        payPassword:res.data.payPassword!=null?res.data.payPassword:0,
        exemptPassword:exemptPassword
      })
      wx.setStorageSync('exemptPassword', exemptPassword)
    }
  },'GET')
},


  // 校验支付密码
  verifymi(str){
    const that=this
    http(url.verifyPayPassword,{
      payPassword:str
    },res=>{
      if(res.code == 0) {
        app.showSuccess(res.msg)
        that.payForUser()
        that.setData({
          show:false
        })
      }
    })
  },

  // 支付
  payForUser(){
    const that=this
    http(url.payForUser,{
      ordersId:that.data.dataInfo.ordersId,
      payPassword:that.data.veCode.join('')
    },res=>{
      if(res.code == 0) {
        app.showSuccess(res.msg)
        that.setData({
          show:false
        })
      }
    },'POST','json')
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