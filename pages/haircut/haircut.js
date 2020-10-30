// pages/haircut/haircut.js
const app = getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '1',
    dataList: [],
    userInfo: '',
    type: 1
  },

  radioClick(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },

  checktimer() {
    wx.navigateTo({
      url: '/pages/haircut/time?type='+this.data.radio,
    })
  },
  toogle(e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      type: type
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
    this.getDataList();
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
  // 提交
  submit() {
    let list = this.data.dataList,
      obj = {},
      haircutType = this.data.type,
      mobile = this.data.userInfo.mobile,
      reserveUserName = this.data.userInfo.userName;
    for (let v of list) {
      if (v.flag == true) {
        obj = v
      }
    }
    app.getDyInfo(['rgp_p1GDSy1k-FuoSzdGIFxslcu2s436wpUlHnLiKU8', 'VmPsKts5U5lAYmhtQZfgv5dWZh_mbm_CPjpoFfvOEuM'], () => {
      http(url.saveRecord, {
        beginTime: obj.beginTime,
        endTime: obj.endTime,
        haircutType: haircutType,
        manageId: obj.manageId,
        mobile: mobile,
        reserveType: 1,
        reserveUserName: reserveUserName,
        shopId: '9',
        isAgent:this.data.radio == 2?1:'',
      }, (res) => {
        if (res.code == 0) {
          app.showSuccess('预约成功', () => {
            wx.navigateBack()
          })
        } else {
          app.showError(res.msg)
        }
      }, 'POST', 'json')
    })
  },
  // 获取预约详情列表
  getDataList() {
    let arr = ['日', '一', '二', '三', '四', '五', '六', ]
    http(url.manageTime, {
      endDate: util.formatEndTime(new Date()),
      shopId: "9"
    }, (res) => {
      if (res.code == 0) {
        for (let v of res.data[util.formatEndTime(new Date())]) {
          v.week = '星期' + arr[new Date().getDay()];
        }
        res.data[util.formatEndTime(new Date())][0].flag = true;
        this.setData({
          dataList: res.data[util.formatEndTime(new Date())]
        })
      }
    }, 'GET')
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