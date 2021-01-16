// pages/physio/physio.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
let submitFlag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekList:[],
    activeTime:0,
    userInfo:'',
    dataList:[],
    proList:'',
    activeTimeDay:0,
    imgUrl:url.imgUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo:userInfo
    })
    this.getWeekDay();
    this.getDayList(util.formatEndTime(new Date()));
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
    let arr = this.data.proList.reserveManageList || [];
    let obj = arr.find((item)=>{
      return item.flag == true;
    })
    if(!obj) {
      app.showError('请选择预约场地！')
      return false;
    }
    let beginTime = this.data.dataList[this.data.activeTimeDay].beginTime,
    endTime = this.data.dataList[this.data.activeTimeDay].endTime,
    manageId = obj.manageId,
    mobile = this.data.userInfo.mobile,
    reserveUserName = this.data.userInfo.nickName;
    if(!submitFlag) {
      return false;
    }
    submitFlag = false;
    app.getDyInfo(['5JWugDNNHLwmdQGqr0JLrZqTh7-2WuRXI2JC3vH8tYs', 'w9YYPOrqNy0QL_d7JlWi2q54MCJo-GzvRQVmz4We0BU'], () => {
      http(url.saveRecord,{
        beginTime,
        endTime,
        manageId,
        mobile,
        reserveUserName,
        reserveType:'6',
        shopId:'15'
      },res=>{
        if(res.code == 0) {
          app.showSuccess('预约成功！',()=>{
            wx.navigateBack()
          })
        }
      },'POST','json')
    })
    setTimeout(res=>{
      submitFlag = true
    },1000)
  },
  // 选择
  onChange(e) {
    let i = e.currentTarget.dataset.i;
    let proList = this.data.proList;
    if(proList.reserveManageList[i].setNumber == 0) {
      // app.showError('暂无');
      return false;
    }
    for(let v of proList.reserveManageList) {
      v.flag = false;
    }
    proList.reserveManageList[i].flag = true;
    this.setData({
      proList
    })
  },
  // 选择时间
  selectTime(e) {
    let i = e.currentTarget.dataset.i,
    proList = this.data.dataList[i];
    // proList.reserveManageList[0].flag = true;
    this.setData({
      activeTimeDay:i,
      proList:proList
    })
  },
  // 获取每日时间点
  getDayList(endDate) {
    http(url.manageTime,{
      endDate:endDate,
      shopId:'15'
    },res=>{
      if(res.data[endDate] && res.code == 0) {
        // res.data[endDate][0].reserveManageList[0].flag = true;
        this.setData({
          dataList:res.data[endDate],
          proList:res.data[endDate][0]
        })
      }else {
        this.setData({
          dataList:'',
          proList:''
        })
      }
    },'GET')
  },
  // 点击选择时间
  seleTime(e) {
    let i = e.currentTarget.dataset.i;
    this.setData({
      activeTime:i
    })
    this.getDayList(util.formatEndTime(new Date(this.data.weekList[i].date)))
  },
  // 获取一周
  getWeekDay() {
    let weekList = [],
      list = ['日','一','二','三','四','五','六'],
      currentDay = new Date(),
      timesStamp = currentDay.getTime();
    for(let i = 0;i<7;i++) {
      let date = new Date(timesStamp + 24 * 60 * 60 * 1000 * i).getTime();
      let day = new Date(timesStamp + 24 * 60 * 60 * 1000 * i).getDate();
      let week = new Date(timesStamp + 24 * 60 * 60 * 1000 * i).getDay();
      weekList.push({
        day:day,
        week:`周${list[week]}`,
        date:date
      })
    }
    this.setData({
      weekList:weekList
    })
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