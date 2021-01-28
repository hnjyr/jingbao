// pages/visitor/visitor.js
const app = getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
const vt = require('../../utils/verify.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    columns: [
      {
        text:'身份证',
        value:1
      },
      {
        text:'军官证',
        value:2
      },
      {
        text:'驾驶证',
        value:3
      },
      {
        text:'其他证件',
        value:4
      },
    ],
    show:false,
    showBg:false,
    showTime:false,
    showTime1:false,
    listShow:false,
    form:{
      type:'身份证',
      carNumber:'',//车牌号
      deptId:'',
      deptName:'',
      certifyType:'1',
      mobile:'',
      userName:'',
      certifyNumber:'',
      visitorReason:'',
      visitorNumber:'',
      visitorMobile:'',
      visitorName:'',
      visitorDept:'',
      visitorTime:'',
      visitorRegisterLinkEntities:[]
    },
    listObj:{
			"certifyNumber": "",
			"certifyType": 1,
			"visitorDept": "",
			"visitorMobile": "",
			"visitorName": ""
    },
    peoName:'',
    dpList:[],
    dpObj:null,
    applyTime1:'',
    applyTime:'',
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    this.setData({
      currentDate: new Date().getTime(),
      currentDate1: new Date().getTime(),
      minDate: new Date().getTime(),
    })
    wx.login({
      success: (res) => {
        wx.request({
          url: url.getOpenId,
          data: {
            code: res.code
          },
          success: (res) => {
            console.log(333)
            if(res.data.code == 0) {
              _this.setData({
                openid:res.data.msg
              })
            }else {
              app.showError(res.data.msg)
            }
          }
        })
      },
      fail:(err) =>{
        console.log(err)
      }
    })
  },
  search(e) {
    let userName = this.data.peoName;
    console.log(userName);
    http(url.verify,userName,(res)=>{
      console.log(res)
      if(res.code == 0) {
        this.setData({
          dpList:res.data,
          listShow:true
        })
      }
    },'POST','json')
  },
  seTrue(e) {
    let i = e.currentTarget.dataset.i;
    let obj = this.data.dpList[i];
    this.setData({
      listShow:false,
      dpObj:obj
    })
  },
  submit() {
    // console.log(this.data.form)
    let form = this.data.form,
      dpObj = this.data.dpObj;
    
    if(!vt.isName(form.visitorName)) {
      app.showError('请输入正确的访客姓名！');
      return false;
    }
    if(!vt.isEmpty(form.certifyNumber)) {
      app.showError('请输入证件号！');
      return false;
    }
    if(!vt.isPhone(form.visitorMobile)) {
      app.showError('请输入正确的手机号码！');
      return false;
    }
    if(!vt.isEmpty(form.visitorDept)) {
      app.showError('请输入访客单位！');
      return false;
    }
    if(!vt.isEmpty(this.data.applyTime)) {
      app.showError('请选择开始时间！');
      return false;
    }
    if(!vt.isEmpty(this.data.applyTime1)) {
      app.showError('请选择结束时间！');
      return false;
    }
    if(!vt.isEmpty(form.visitorReason)) {
      app.showError('请输入来访事由！');
      return false;
    }
    if(!dpObj) {
      app.showError('请填写被访人信息！');
      return false;
    }
    form.deptId = dpObj.deptId;
    form.deptName = dpObj.deptName;
    form.mobile = dpObj.mobile;
    form.userId = dpObj.userId;
    form.userName = dpObj.nickName;
    form.visitorTime = `${this.data.applyTime} - ${this.data.applyTime1}`;
    form.visitorNumber = form.visitorRegisterLinkEntities.length + 1;
    form.openid = this.data.openid
    app.getDyInfo(['NQftdDKYwqs-KyBVo8Ld0W1nmQai7uCbgEFhjGZGp60'], () => {
      http(url.fkSave,form,(res)=>{
        console.log(res)
        if(res.code == 0) {
          app.showSuccess('预约成功',()=>{
            wx.navigateBack()
          })
        }
      },'POST','json')
    })
  },
  inputChange(e) {
    let str = e.currentTarget.dataset.name;
    this.setData({
      [str]:e.detail.value
    })
  },
  typeSelect() {
    this.setData({
      show:true
    })
  },
  onConfirm(event) {
    const { value, index } = event.detail;
    let type = 'form.type',
      certifyType = 'form.certifyType'
    this.setData({
      [type]:value.text,
      [certifyType]:value.value,
      show:false
    })
  },
  onCancel() {
    this.setData({
      show:false
    })
  },
  close() {
    this.setData({
      show:false
    })
  },
  add() {
    // 添加乘客
    this.setData({ 
      showBg: true,
      listObj:{
        "certifyNumber": "",
        "certifyType": 1,
        "visitorDept": "",
        "visitorMobile": "",
        "visitorName": ""
      }
    });
  },
  onClickHide() {
    this.setData({ showBg: false });
  },

  noop() {},
  delTap(e) {
    let i = e.currentTarget.dataset.i,
    arr = this.data.form.visitorRegisterLinkEntities,
    str = 'form.visitorRegisterLinkEntities';
    arr.splice(i,1);
    this.setData({
      [str]:arr
    })
  },
  onChangeusert(e) {
    let str = 'listObj.certifyType';
    this.setData({
      [str]:e.detail
    })
  },
  // 添加通行访客
  addInfo() {
    let listObj = this.data.listObj;
    let arr = this.data.form.visitorRegisterLinkEntities;
    let str = 'form.visitorRegisterLinkEntities';
    for(let key in listObj){
      if(listObj[key] === '') {
        app.showError('请填写完整！');
        return false;
      }
    }
    if(!vt.isPhone(listObj.visitorMobile)) {
      app.showError('请输入同行访客手机号！');
      return false;
    }
    arr.push(listObj)
    this.setData({
      [str]:arr,
      showBg:false
    })
  },
  // shijian
  timeSelect() {
    this.setData({
      showTime: true,
    })
  },
  // shijian2
  timeSelect1() {
    this.setData({
      showTime1: true,
    })
  },
  // 时间选择
  timeConfirm(e) {
    // let str = 'form.visitorTime';
    this.setData({
      showTime: false,
      applyDate: e.detail,
      applyTime: util.formatTime1(new Date(e.detail))
    })
  },
  // 时间选择2
  timeConfirm1(e) {
    // let str = 'form.visitorTime';
    this.setData({
      showTime1: false,
      applyDate1: e.detail,
      applyTime1: util.formatTime1(new Date(e.detail))
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