// pages/visitor/handle.js
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList:['未处理','已处理','今日来访'],
    dataList:[],
    refresh:false,
    page:1,
    active:0,
    result:[],
    show:false,
    remark:'',
    yij:'1',//1 同意  2拒绝
    allNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onClose() {
    this.setData({ show: false });
  },
  textInp(e) {
    this.setData({
      remark:e.detail.value
    })
  },
  onLoad: function (options) {
    this.getDataList()
  },
  onChange(e) {
    console.log(e)
    this.setData({
      result: e.detail
    });
  },
  tabClick(e) {
    this.setData({
      active:e.currentTarget.dataset.i,
      page:1,
      dataList:[]
    })
    this.getDataList()
  },
  refreshTap(e) {
    this.data.refresh = true
    this.setData({
      page:1,
      dataList:[]
    })
    this.getDataList();
  },
  spClick(e) {
    if(this.data.result.length == 0) {
      app.showError('请选择访客！');
      return false;
    }
    let i = e.currentTarget.dataset.i;
    this.setData({
      show:true,
      yij:i,
      remark:''
    })
  },
  confirm() {
    let yij = this.data.yij,
      ids = this.data.result;
    app.getDyInfo(['NQftdDKYwqs-KyBVo8Ld0W1nmQai7uCbgEFhjGZGp60'], () => {
      http(url.agreeOrRefuse,{
        registerState:yij == 1?3:2,
        remark:this.data.remark,
        ids:ids.join(',')
      },res=>{
        if(res.code == 0) {
          app.showSuccess('成功！',()=>{
            this.setData({
              page:1,
              dataList:[]
            })
            this.getDataList()
          })
        }
      },'GET','json')
    })
    
  },
  // 获取通知列表
  getDataList() {
    let data = {
      limit:'10',
      page:this.data.page
    };
    switch (Number(this.data.active)) {
      case 0:
        data.registerState = 1;
      break;
      case 1:
        data.noRegisterState = 1;
      break;
      case 2:
        data.visitorStartTime='today';
      break;
    }
    http(url.todayList,data,res=>{
      if(res.code == 0) {
        const totalPage=res.page.totalPage
        if(this.data.page<totalPage){//第一页是最后一页
          this.setData({
            text:'上拉加载更多'
          })
        }
        for(let v of res.page.list) {
          v.flag = false;
          if(v.visitorStartTime) {
            v.visitorStartTime = v.visitorStartTime.substring(0,16);
          }
        }
        this.setData({
          dataList:this.data.dataList.concat(res.page.list),
          refresh:false,
          totalPage:totalPage,
          allNum:res.page.totalCount
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