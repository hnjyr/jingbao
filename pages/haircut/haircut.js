// pages/haircut/haircut.js
const app = getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
let submitFlag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '1',
    dataList: [],
    userInfo: '',
    type: 1,
    week:'',
    selectFlag:false
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
      url: '/pages/haircut/time?type=' + this.data.radio,
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
      reserveUserName = this.data.userInfo.nickName;
    for (let v of list) {
      if (v.flag == true) {
        obj = v
      }
    }
    if (!obj.beginTime) {
      app.showError('请选择预约时间！');
      return false;
    }
    if(!submitFlag) {
      return false;
    }
    submitFlag = false;
    app.getDyInfo(['5JWugDNNHLwmdQGqr0JLrZqTh7-2WuRXI2JC3vH8tYs', 'w9YYPOrqNy0QL_d7JlWi2q54MCJo-GzvRQVmz4We0BU'], () => {
      http(url.saveRecord, {
        beginTime: obj.beginTime.replace(/\//g,"-"),
        endTime: obj.endTime.replace(/\//g,"-"),
        haircutType: haircutType,
        // manageId: obj.manageId,非领导不需要
        mobile: mobile,
        reserveType: 1,
        reserveUserName: reserveUserName,
        shopId: '9',
        isAgent: this.data.radio == 2 ? 1 : '',
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
    setTimeout(res => {
      submitFlag = true;
    }, 1000)
  },
  // 获取预约详情列表
  getDataList() {
    let arr = ['日', '一', '二', '三', '四', '五', '六', ]
    http(url.manageTime, {
      endDate: util.formatEndTime(new Date()),
      shopType: "3"
    }, (res) => {
      if (res.code == 0) {
        if (JSON.stringify(res.data) == "{}") {
          this.setData({
            dataList: [{
              manageDate: util.formatEndTime(new Date()),
              flag: true
            }]
          })
        } else {
          for (let v of res.data[util.formatEndTime(new Date())]) {
            v.week = '星期' + arr[new Date().getDay()];
            v.beginTime = v.beginTime.replace(/-/g,"/");
            if(new Date().getTime() > new Date(v.beginTime).getTime()) {
              v.setNumber = 0
            }
          }
          let obj = res.data[util.formatEndTime(new Date())].find((item)=>{
            return item.setNumber > 0
          })
          if(obj) {
            obj.flag = true;
          }else {
            this.setData({
              selectFlag:true
            })
          }
          this.setData({
            dataList: res.data[util.formatEndTime(new Date())]
          })
        }

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