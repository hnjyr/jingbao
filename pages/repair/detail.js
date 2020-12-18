// pages/repair/detail.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataObj:'',
    imgUrl:url.imgUrl,
    radio: '1',
    type:'',
    active:'',
    imgList:[]
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let dataObj = wx.getStorageSync('wxDetail');
    // wx.removeStorage({
    //   key: 'wxDetail',
    // })
    if(options.type == 1&&options.active == 1) {
      dataObj = dataObj.applyEntity
    }
    dataObj.applyDate = dataObj.applyDate.substring(0,10);
    this.setData({
      dataObj,
      radio:dataObj.repairType?dataObj.repairType:"1",
      type:options.type,
      active:options.active
    })
    http(url.attachmentList,{
      groupId:this.data.dataObj.attachmentGroupId
    },res=>{
      this.setData({
        imgList:res.page.list
      })
    })
  },
  lookImg(e) {
    let i = e.currentTarget.dataset.i;
    let arr = [];
    for(let v of this.data.imgList) {
      arr.push(this.data.imgUrl + v.id)
    }
    wx.previewImage({
      current: arr[i], // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  // 拒绝
  noClick() {
    let applyId = this.data.dataObj.applyId,
    createTime = new Date().getTime(),
    opinionType = '1',
    optionUserName = wx.getStorageSync('userInfo').userName,
    repairType = this.data.radio;
    http(url.applyopinionSave,{
      applyId,
      createTime,
      opinionType,
      optionUserName,
      repairType
    },res=>{
      app.showSuccess('成功！',()=>{
        var pages=getCurrentPages();//页面指针数组
        var prepage=pages[pages.length-2];//上一页面指针
        prepage.setData({
          page:1,
          dataList:[]
        });//操作上一页面
        prepage.getDataList()
        wx.navigateBack({
          delta: 2,
        });
      })
    },'POST','json')
  },
  // 确认
  sureClick() {
    let applyId = this.data.dataObj.applyId,
    createTime = new Date().getTime(),
    opinionType = '1',
    optionUserName = wx.getStorageSync('userInfo').userName,
    repairType = this.data.radio;
    http(url.applyopinionSave,{
      applyId,
      createTime,
      opinionType,
      optionUserName,
      repairType
    },res=>{
      app.showSuccess('成功！',()=>{
        var pages=getCurrentPages();//页面指针数组
        var prepage=pages[pages.length-2];//上一页面指针
        prepage.setData({
          page:1,
          dataList:[]
        });//操作上一页面
        prepage.getDataList()
        wx.navigateBack({
          delta: 2,
        });
      })
    },'POST','json')
  },
  // 下发
  xfClick() {
    wx.navigateTo({
      url: '/pages/repair/grList?applyDate='+this.data.dataObj.applyDate + '&professionId='+this.data.dataObj.applyId,
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