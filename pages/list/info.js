// pages/list/info.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:0,
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      price:options.price,
      userInfo:userInfo
    })
  },
  saveOrder(e) {
    let createUserName = this.data.userInfo.userName,
        mobile = this.data.userInfo.mobile,
        list = wx.getStorageSync('carList'),
        price = this.data.price,
        arr = [],
        shopId = list[0].shopId;
    if(this.data.userInfo.userName&&this.data.userInfo.mobile) {
      for(let v of list) {
        arr.push({
          createTime:new Date().getTime(),
          goodsId:v.goodsId,
          goodsName:v.shopGoodsEntity.goodsName,
          piece:v.amount,
          price:v.shopGoodsEntity.price,
          shopId:v.shopId
        })
      }
      app.getDyInfo(['rgp_p1GDSy1k-FuoSzdGIFxslcu2s436wpUlHnLiKU8'],()=>{
        http(url.saveForUser,{
          createUserName: createUserName,
          isPayBehalf:0, //是否代付 1是0否，（目前默认传0）
          mobile:mobile, //用户手机号
          ordersLinkEntityList:arr, //订单商品集合
          payPrice:price, //支付价格
          shopId:shopId, //商家id
          totalPrice:price //总价格
        },(res)=>{
          if(res.code == 0) {
            wx.setStorage({
              data: res.data,
              key: 'orderDetail',
            })
            wx.navigateTo({
              url: '/pages/order/order',
            })
          }
        },'POST','json')
      })
      
    }
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