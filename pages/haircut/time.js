// pages/haircut/time.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    timeArr:[],
    active:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arr = ['日', '一', '二', '三', '四', '五', '六'],
    time = util.formatEndTime(new Date()),
    week = '周'+arr[new Date().getDay()];
    time = time.substring(time.length-2);
    this.setData({
      timeArr:[{
        time,
        week
      }]
    })
    this.getDataList();
  },
  toogle(e) {
    let i = e.currentTarget.dataset.i,
      dataList = this.data.dataList;
      for(let v of dataList) {
        v.flag = false;
      }
      dataList[i].flag = true;
      this.setData({
        dataList:dataList,
        active:i
      })
  },

  backTap() {
    let pages=getCurrentPages();//页面指针数组
    let prepage=pages[pages.length-2];//上一页面指针
    for(let v of prepage.data.dataList) {
      v.flag = false
    }
    prepage.data.dataList[this.data.active].flag = true;
    prepage.setData({
      dataList:prepage.data.dataList
    })
    wx.navigateBack()
  },
  // 获取预约详情列表
  getDataList() {
    let arr = ['日', '一', '二', '三', '四', '五', '六', ]
    http(url.manageTime,{
      endDate:util.formatEndTime(new Date()),
      shopId:"9"
    },(res)=>{
      console.log(res)
      if(res.code == 0) {
        for(let v of res.data[util.formatEndTime(new Date())]) {
          v.week = '星期'+arr[new Date().getDay()];
          v.flag = false;
        }
        res.data[util.formatEndTime(new Date())][0].flag = true;
        this.setData({
          dataList:res.data[util.formatEndTime(new Date())]
        })
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