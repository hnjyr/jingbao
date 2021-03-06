// pages/list/order.js     
const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curid:1,
    tittext:'订餐列表',
    activeKey: 0,
    activeKey1: 0,
    tagList:[
      {text:'分类1',id:0},
      {text:'分类2',id:1},
      {text:'分类3',id:2},
      {text:'分类4',id:3},
      {text:'分类4',id:4},
    ],
    dcList:[],
    jcList:[
      {labelName:'早餐',labelId:1},
      {labelName:'午餐',labelId:2},
      {labelName:'晚餐',labelId:3},
    ],
    jcLists:[],
    page:1,
    limit:20,
    imgUrl:url.imgUrl,
    carList:[],
    allPrice:'',
    refresh:false,
    tolower:false,
    activeDate:1,
    jcDate:util.formatEndTime(new Date())
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShopList(1,1,1);
    this.getTagList();
  },
  toogleDate(e) {
    let i = e.currentTarget.dataset.i;
    let time = new Date().getTime();
    time = time + (i - 1)*60*24*60*1000;
    console.log(time)
    this.setData({
      activeDate:i,
      jcDate:util.formatEndTime(new Date(time))
    })
    this.getShopList(1,1,this.data.jcList[this.data.activeKey1].labelId)
  },
  // 下拉刷新
  refreshTap(e) {
    this.data.refresh = true
    this.setData({
      page:1,
      tolower:false
    })
    let labelId = this.data.curid == 1?this.data.jcList[this.data.activeKey1].labelId:this.data.tagList[this.data.activeKey].labelId
    this.getShopList(this.data.curid,1,labelId);
  },
  // 滑动加载
  tolower(e) {
    if(!this.data.tolower) {
      return false;
    }
    this.setData({
      page:this.data.page+1,
      tolower:true,
    })
    let labelId = this.data.curid == 1?this.data.jcList[this.data.activeKey1].labelId:this.data.tagList[this.data.activeKey].labelId
    this.getShopList(this.data.curid,this.data.page,labelId);
  },
  check(e){
    this.setData({
      curid:e.currentTarget.dataset.id,
      tolower:false,
      tittext:e.currentTarget.dataset.id==1?'订餐列表':'就餐'
    })
  },
  onChange(event) {
    this.setData({
      activeKey:event.detail,
      page:1,
      tolower:false,
    })
    let aIndex = this.data.activeKey,
    classify = this.data.curid,
    labelId = this.data.tagList[aIndex].labelId,
    page = this.data.page;
    this.getShopList(classify, page, labelId )
  },
  onChange1(event) {
    this.setData({
      activeKey1:event.detail,
      page:1,
      tolower:false
    })
    let aIndex1 = this.data.activeKey1,
    classify = this.data.curid,
    labelId = this.data.jcList[aIndex1].labelId,
    page = this.data.page;
    this.getShopList(classify, page, labelId )
  },
  back(){
    app.goback()
  },
  navTab(e) {
    // 就餐
    wx.setStorageSync('mealInfo', this.data.jcLists.list[e.currentTarget.dataset.i])
    wx.navigateTo({
      url: '/pages/list/detail?type=1',
    })
  },
  navTabs(e) {
    wx.setStorageSync('mealInfo', this.data.dcList.list[e.currentTarget.dataset.i]);
    wx.setStorageSync('carList', this.data.carList);
    wx.navigateTo({
      url: '/pages/list/detail?type=2',
    })
  },
  // 添加购物车
  addCar(e) {
    let list = JSON.parse(JSON.stringify(this.data.carList)),
    i = e.currentTarget.dataset.i,
    obj = this.data.dcList.list[i],
    allPrice = 0;
    obj.amount = 1;
    obj.price = parseFloat(obj.price);
    if(obj.remaining == 0) {
      app.showError('剩余库存不足！');
      return false;
    }
    if(list.length == 0) {
      list.push(obj)
    }else {
      let flag = list.findIndex((v)=>{
        return v.id == obj.id;
      })
      if(flag == -1) {
        list.push(obj)
      }else {
        if(list[flag].amount == obj.remaining) {
          app.showError('剩余库存不足！')
          return false;
        }
        let limitedQuantity = obj.shopGoodsEntity.limitedQuantity;
        if(limitedQuantity == list[flag].amount) {
          app.showError(`每人限购${limitedQuantity}份！`);
          return false;
        }
        list[flag].amount = list[flag].amount+1;
      }
    }
    for(let v of list) {
      allPrice += parseFloat(parseFloat(v.shopGoodsEntity.price) * parseFloat(v.amount || 1))
    }
    this.setData({
      carList:list,
      allPrice:allPrice
    })
  },
  // 结算
  jsTap() {
    wx.setStorageSync('carList', this.data.carList);
    wx.navigateTo({
      url: '/pages/list/car',
    })
  },
  // 获取订餐标签
  getTagList() {
    let _this = this;
    http(url.orderTag,{},(res)=>{
      if(res.code == 0) {
        _this.setData({
          tagList:res.data,
          tolower:false
        })
        _this.data.tagList[0].labelId?_this.getShopList(2,1,_this.data.tagList[0].labelId):''
      }
    },'GET')
  },
  // 获取餐厅标签下的列表
  getShopList(classify, page, labelId) {
    let _this = this,
    limit = this.data.limit,
    jcDate = this.data.jcDate,
    kayStr = classify == 2?'dcList':'jcLists',
    type = classify == 2?'labelId':'type';
    let data = {
      classify:classify,
      limit:limit,
      page:page,
      [type]:labelId
    }
    if(classify == 1) {
      data.date = jcDate;
    }
    http(url.ordering,data,(res)=>{
      if(res.code == 0) {
        if(!this.data.tolower) {
          _this.setData({
            [kayStr]:res.page,
            refresh:false,
            tolower:res.page.totalCount > limit?true:false
          })
        }else {
          let obj = this.data[kayStr];
          obj.list.push(...res.page.list);
          _this.setData({
            [kayStr]:obj,
            refresh:false,
            tolower:res.page.totalCount > this.data[kayStr].list.length?true:false
          })
        }
      }
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
    let list = wx.getStorageSync('carList')||[],
    allPrice = 0;
    for(let v of list) {
      allPrice += parseFloat(parseFloat(v.shopGoodsEntity.price) * parseFloat(v.amount || 1))
    }
    this.setData({
      carList:list,
      allPrice:allPrice
    })
    wx.removeStorage({
      key: 'carList',
    })
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