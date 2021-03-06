// pages/admin/type.js
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curid:2,
    jine:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status:options.status
    })
    wx.setNavigationBarTitle({
      title: options.status==1?'提现':'充值'
    })
  },
  check(e){
    this.setData({
      curid:e.currentTarget.dataset.id
    })
  },
  // 充值
  recordsave(){
    const that=this
    if(that.data.jine.trim()==''){
      app.showError('请输入金额');
      return
    }
    http(url.recordsave,{
      amount:that.data.jine,
      qmfPayType:6,
      type:6,
      subOpenId:wx.getStorageSync('userInfo').wxOpenId
    },res=>{
      console.log(res)
      if(res.code == 0) {
        let str = '全民付预支付订单响应参数';
        let obj = JSON.parse(JSON.parse(res.data.wechatPrePaymentOrderParam)[0][str]);
        let zf = obj.miniPayRequest;
        console.log(obj)
        wx.requestPayment({
          timeStamp:zf.timeStamp,
          nonceStr:zf.nonceStr,
          package:zf.package,
          signType:zf.signType,
          paySign:zf.paySign,
          success(res) {
            console.log(res)
            if(res.errMsg == 'requestPayment:ok') {
              app.showSuccess('支付成功！',()=>{
                wx.navigateBack();
              })
            }
          },
          complete(res) {
            console.log(res)
          }
        })
      }
    },'POST','json')
  },
  jineInput(e){
    this.setData({
      jine:e.detail.value
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