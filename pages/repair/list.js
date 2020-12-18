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
    tabList:['未处理','已处理'],
    active:0,
    type:''
  },
  refreshTap(e) {
    this.setData({
      page:1,
      dataList:[],
      text:'上拉加载更多'
    })
    this.getDataList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    let tabList = ['未处理','已处理'];
    if(options.type == 3) {
      tabList = ['未维修','已维修'];
    }
    this.setData({
      userInfo,
      type:options.type,
      tabList
    })
    let title = '';
    switch (options.type) {
      case '1':
        title = '申请列表';
        break;
      case '2':
        title = '维修列表';
        break;
      case '3':
        title = '任务列表';
        break;
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.getDataList();
  },
  // 跳转
  navTap(e) {
    let i = e.currentTarget.dataset.i;
    if(this.data.type == 3 && this.data.active == 0) {
      wx.setStorageSync('wxDetail', this.data.dataList[i])
      wx.navigateTo({
        url: '/pages/repair/apply?type=1',
      })
    }else {
      wx.setStorage({
        data: this.data.dataList[i],
        key: 'wxDetail',
      })
      wx.navigateTo({
        url: '/pages/repair/detail?type='+this.data.type+'&active='+this.data.active,
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
  // 切换
  tabClick(e) {
    let i = e.currentTarget.dataset.i;
    this.setData({
      active:i,
      page:1,
      dataList:[]
    })
    this.getDataList();
  },
  // 获取数据
  getDataList() {
    let  limit = this.data.limit,
    page = this.data.page,
    active = this.data.active,
    data = {},
    urls = '';
    if(this.data.type == 1 && active == 0) {
      data = {page,limit};
      data.isApply = '2';
      urls = url.manageListNo;
    }else if(this.data.type == 1 && active == 1) {
      data = {page,limit};
      urls = url.manageListYes;
    }else if(this.data.type == 2 && active == 0) {
      data = {page,limit};
      data.isApply = '3';
      urls = url.manageListNo;
    }else if(this.data.type == 2 && active == 1) {
      data = {page,limit};
      data.repairState = '2';
      urls = url.listMyRepair;
    }else if(this.data.type == 3 && active == 0) {
      data = {page,limit};
      data.repairState = '1';
      urls = url.listMyRepair;
    }else if(this.data.type == 3 && active == 1) {
      data = {page,limit};
      data.repairState = '2';
      urls = url.listMyRepair;
    }
    http(urls,data,res=>{
      if(res.code == 0) {
        const totalPage=res.page.totalPage
        if(page<totalPage){//第一页是最后一页
          this.setData({
            text:'上拉加载更多'
          })
        }else {
          this.setData({
            text:'没有更多!'
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