// pages/recordlist/maintain.js
// 获取应用实例
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    createUserId: '182',
    limit: '20',
    page: 1,
    type: '1',
    userInfo: '',
    wxDataList: [],
    yyDataList: [],
    refresh: false,
    text: '上拉加载更多'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = '维修记录';
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      type: options.type
    })
    options.type == 1 ? this.getWxList() : this.getYyList();
    title = options.type == 2 ? '预约记录' : '维修记录';
    if (options.type == 2) {
      wx.setNavigationBarTitle({
        title: title
      })
    }
  },
  refreshTap(e) {
    this.data.refresh = true
    this.setData({
      page: 1,
      text: '上拉加载更多'
    })
    if (this.data.type == 1) {
      this.setData({
        wxDataList: []
      })
    } else {
      this.setData({
        yyDataList: []
      })
    }
    this.data.type == 1 ? this.getWxList() : this.getYyList();
  },
  // 维修
  getWxList() {
    this.setData({
      text: '加载中...'
    })
    const {
      userInfo,
      limit,
      page
    } = this.data
    http(url.repairrecordinfo, {
      createUserId: userInfo.userId,
      limit,
      page
    }, (res) => {
      if (res.code == 0) {
        const totalPage = res.page.totalPage
        if (page < totalPage) { //第一页是最后一页
          this.setData({
            text: '上拉加载更多'
          })
        }
        this.setData({
          wxDataList: this.data.wxDataList.concat(res.page.list),
          refresh: false,
          totalPage: totalPage,
        })
      }
    })
  },
  // 预约
  getYyList() {
    this.setData({
      text: '加载中...'
    })
    const {
      userInfo,
      limit,
      page
    } = this.data
    http(url.appointment, {
      createUserId: userInfo.userId,
      limit,
      page
    }, (res) => {
      if (res.code == 0) {
        const totalPage = res.page.totalPage
        if (page < totalPage) { //第一页是最后一页
          this.setData({
            text: '上拉加载更多'
          })
        }
        this.setData({
          yyDataList: this.data.yyDataList.concat(res.page.list),
          refresh: false,
          totalPage: totalPage,
        })
      }
    })
  },
  bottom() {
    if (this.data.page < this.data.totalPage) {
      this.setData({
        page: this.data.page + 1
      })
      this.getDataList()
    } else {
      this.setData({
        text: '没有更多!'
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