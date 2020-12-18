// pages/recordlist/dining.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:url.imgUrl,
    userInfo:'',
    limit:20,
    page:1,
    dataList:[],
    refresh:false,
    text:'上拉加载更多',
    radio:0,
    professionId:'',
    createUserId:'',
  },
  refreshTap(e) {
    this.setData({
      page:1,
      dataList:[],
      text:'上拉加载更多'
    })
    this.getDataList();
  },
  onChange(event) {
    this.setData({
      radio: Number(event.detail),
    });
  },
  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: Number(name),
    });
  },
  // 返回
  back() {
    wx.navigateBack()
  },
  // 发送
  send() {
    let data = this.data.dataList[this.data.radio],
    operation = data.userName,
    operationId = data.userId,
    operationPhone = data.mobile,
    professionId = this.data.professionId,
    repairDate = this.data.repairDate;
    http(url.repairrecordSave,{
      operation,
      operationId,
      operationPhone,
      professionId,
      repairDate,
    },res=>{
      app.showSuccess('成功！',()=>{
        var pages=getCurrentPages();//页面指针数组
        var prepage=pages[pages.length-3];//上一页面指针
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo,
      status:options.status,
      professionId:options.professionId,
      repairDate:new Date(options.applyDate).getTime()
    })
    wx.setNavigationBarTitle({
      title: options.status==1?'订餐记录':'消费记录',
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
  // 获取数据
  getDataList() {
    this.setData({
      text:''
    })
    let deptId = this.data.userInfo.deptId,
    isDisables = '1',
    position = this.data.userInfo.position,
    noRole = '1',
    page = this.data.page;
    http(url.sysList,{
      deptId,
      isDisables,
      position,
      noRole
    },res=>{
      if(res.code == 0) {
        const totalPage=res.page.totalPage
        if(page<totalPage){//第一页是最后一页
          this.setData({
            text:'上拉加载更多'
          })
        }
        this.setData({
          dataList:this.data.dataList.concat(res.page.list),
          refresh:false,
          totalPage:totalPage,
        })
      }
    })
  },
  bottom(){
    if(this.data.page<this.data.totalPage){
      this.setData({
        page:this.data.page+1
      })
      this.getDataList()
    }else{
      this.setData({
        text:'没有更多!'
      })
    }
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