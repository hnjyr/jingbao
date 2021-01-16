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
    weekList:[],
    active:0,
    weekActive:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let arr = ['日', '一', '二', '三', '四', '五', '六'],
    // time = util.formatEndTime(new Date()),
    // week = '周'+arr[new Date().getDay()];
    // time = time.substring(time.length-2);
    // this.setData({
    //   timeArr:[{
    //     time,
    //     week
    //   }]
    // })
    let type = options.type;
    let num = type == 2?3:2;
    this.getWeekDay(num);
    this.getDataList();
  },
  // 获取一周
  getWeekDay(num) {
    let weekList = [],
      list = ['日','一','二','三','四','五','六'],
      currentDay = new Date(),
      timesStamp = currentDay.getTime();
    for(let i = 0;i<num;i++) {
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
  toogleDay(e) {
    let i = e.currentTarget.dataset.i;
    let week = e.currentTarget.dataset.week;
    this.setData({
      weekActive:i,
      week
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
    let arr = ['日', '一', '二', '三', '四', '五', '六', ]
    let list = this.data.dataList;
    let pages=getCurrentPages();//页面指针数组
    let prepage=pages[pages.length-2];//上一页面指针
    for(let v of list) {
      v.flag = false
    }
    list[this.data.active].flag = true;
    // list[this.data.active].week = this.data.week.replace(/周/,'星期')
    prepage.setData({
      dataList:list,

    })
    wx.navigateBack()
  },
  // 获取预约详情列表
  getDataList() {
    let arr = ['日', '一', '二', '三', '四', '五', '六', ];
    let dateTime = util.formatEndTime(new Date(this.data.weekList[this.data.weekActive].date));
    console.log(dateTime)
    http(url.manageTime,{
      endDate:dateTime,
      shopId:"9"
    },(res)=>{
      if(res.code == 0) {
        if(res.data[dateTime]) {
          for(let v of res.data[dateTime]) {
            v.week = '星期'+arr[new Date(dateTime.replace(/-/g,"/")).getDay()];
            v.flag = false;
          }
          res.data[dateTime][0].flag = true;
        }else {
          res.data[dateTime] = [];
        }
        
        this.setData({
          dataList:res.data[dateTime] || []
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