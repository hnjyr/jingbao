// pages/admin/health.js
const app = getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList:[],
    renxiang:'../../images/admin/renxiang.png',
    renxiangId:'',
    imgUrl: url.imgUrl,
    userInfo:'',
    unit:'',
    numberes:'',
    dateStart:'',
    dateEnd:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
    })
    http(url.infoUserId+this.data.userInfo.userId,{},(res)=>{
      console.log(res)
      if(res.code == 0) {
        this.setData({
          dateStart:res.data.dateStart,
          dateEnd:res.data.dateEnd,
          renxiang:this.data.imgUrl+res.data.imageId,
          renxiangId:res.data.imageId,
          numberes:res.data.number,
          unit:res.data.unit,
        })
      }
    },'Get','json')
  },
  submit() {
    let reg = /\d{4}-\d{2}-\d{2}/;
    if(this.data.dateStart == '') {
      app.showError('请输入发证日期');
      return false;
    }
    if(!reg.test(this.data.dateStart)) {
      app.showError('请输入发证日期格式错误');
      return false;
    }
    if(this.data.dateEnd == '') {
      app.showError('请输入到期日期');
      return false;
    }
    if(!reg.test(this.data.dateEnd)) {
      app.showError('请输入到期日期格式错误');
      return false;
    }
    if(this.data.unit == '') {
      app.showError('请输入发证单位');
      return false;
    }
    if(this.data.numberes == '') {
      app.showError('请输入证书编号');
      return false;
    }
    if(this.data.renxiang == '../../images/admin/renxiang.png') {
      app.showError('请先上传证件照图片');
      return false;
    }
    http(url.userhealthcertificate,{
      unit:this.data.unit,
      number:this.data.numberes,
      imageId:this.data.renxiangId,
      dateStart:this.data.dateStart,
      dateEnd:this.data.dateEnd,
      userId:this.data.userInfo.userId
    },(res)=>{
      console.log(res)
      if(res.code == 0) {
        app.showSuccess('上传成功',()=>{
          wx.navigateBack()
        })
      }
    },'Put','json')
  },
  // 正面上传
  afterRead(event) {
    const {
      file
    } = event.detail,
      _this = this;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: url.upload, // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'file',
      header: {
        "X-Requested-With": "WXCHART",
        "Cookie": wx.getStorageSync('cookie'),
        // "Content-Type":"application/form-data"
      },
      formData: {
        groupId: _this.data.attachmentGroupId
      },
      success(e) {
        let res = JSON.parse(e.data);
        console.log(res)
        // 上传完成需要更新 renxiang
        _this.setData({
          renxiang:_this.data.imgUrl+res.data.id,
          renxiangId:res.data.id
        });
      },
    });
  },
  // 发证时间
  dateStartInput(e){
    this.setData({
      dateStart: e.detail.value
    })
  },
  // 到期时间
  dateEndInput(e){
    this.setData({
      dateEnd: e.detail.value
    })
  },
  // 发证单位
  unitInput(e){
    this.setData({
      unit: e.detail.value
    })
  },
   // 证书编号
   numberInput(e){
    this.setData({
      numberes: e.detail.value
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