// pages/repair/apply.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:url.imgUrl,
    fileList: [],
    show: false,
    userInfo:'',
    goodsName:'',
    address:'指挥中心',
    applyDate:'',
    applyContent:'',
    attachmentGroupId:new Date().getTime(),
    

    showTime:false,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },

  onClickShow() {
    // 提交
    let { applyContent, applyDate, userInfo, fileList, goodsId, attachmentGroupId } = this.data;
    if(applyDate == '') {
      app.showError('请选择维修预约时间');
      return false;
    }
    if(applyContent == '') {
      app.showError('请填写维修内容');
      return false;
    }
    if(fileList.length == 0) {
      app.showError('请上传维修图片');
      return false;
    }
    app.getDyInfo(['rgp_p1GDSy1k-FuoSzdGIFxslcu2s436wpUlHnLiKU8', 'c9zdy_jyFcQbbNCVEKcqMAcHEPBfliETU_reu7yo5Vg','jmZ8_5pdORt1YJ9v2nk2msDFmY4fWw74U3jfJ0eDvk4'], () => {
      http(url.sqSave,{
        applyContent,
        applyDate,
        applyState:'1',
        approvalId:'1',
        attachmentGroupId:attachmentGroupId - 0,
        createTime:new Date().getTime(),
        deptId:userInfo.deptId,
        petitioner:userInfo.userName,
        petitionerPhone:userInfo.mobile,
        shopGoodsId:goodsId
      },res=>{
        if(res.code == 0) {
          this.setData({ show: true });
        }else {
          app.showError(res.msg)
        }
      },'POST','json')
    })
    
  },

  onClickHide() {
    this.setData({ show: false });
  },
  contInput(e) {
    this.setData({
      applyContent:e.detail
    })
  },
  // shijian
  timeSelect() {
    this.setData({
      showTime:true,
    })
  },
  // 时间选择
  timeConfirm(e) {
    this.setData({
      showTime:false,
      applyDate:e.detail,
      applyTime:util.formatEndTime(new Date(e.detail))
    })
  },
  // 返回
  backTap() {
    wx.navigateBack()
  },
  noop() {
    this.setData({ show: false });
    wx.navigateBack()
  },
  afterRead(event) {
    const { file } = event.detail,
      _this = this;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: url.upload, // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'file',
      header:{
        "X-Requested-With":"WXCHART",
        "Cookie":wx.getStorageSync('cookie'),
        // "Content-Type":"application/form-data"
      },
      formData: { 
        groupId:_this.data.attachmentGroupId
       },
      success(e) {
        let res = JSON.parse(e.data);
        console.log(res)
        // 上传完成需要更新 fileList
        const { fileList = [] } = _this.data;
        fileList.push({ ...file, url: _this.data.imgUrl + res.data.id, imgId:res.data.id });
        _this.setData({ fileList });
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo:userInfo,
      goodsName:options.goodsName,
      goodsId:options.goodsId,
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