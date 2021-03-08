// pageA/pages/emergency/index.js
const app=getApp();
const url = require('../../../utils/config.js');
const http = require('../../../utils/http.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pTop:"",
    pHei:"",
    active:2,
    activeKey: 0,
    tagList:[],
    dataList:[],
    page:1,
    limit:20,
    imgUrl:url.imgUrl,
    carList:[],
    allPrice:'',
    refresh:false,
    tolower:false,
    activeDate:1,
    jcDate:util.formatEndTime(new Date()),
    carList:[],
    searchText:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTagList();
    this.setData({
      userInfo:wx.getStorageSync('userInfo'),
      pTop:wx.getSystemInfoSync().statusBarHeight,
      pHei:wx.getMenuButtonBoundingClientRect().height,
    })

  },
  // 下拉刷新
  refreshTap(e) {
    this.data.refresh = true
    this.setData({
      page:1,
      tolower:false
    })
    this.getShopList();
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
    this.getShopList();
  },
  navTabs(e) {
    wx.setStorageSync('wzInfo', this.data.dataList.list[e.currentTarget.dataset.i]);
    wx.setStorageSync('wzList', this.data.carList);
    wx.navigateTo({
      url: '/pageA/pages/emergency/detail',
    })
  },
  // 搜索
  onChange1(e) {
    this.setData({
      searchText:e.detail
    })
  },
  onSearch() {
    wx.navigateTo({
      url: '/pageA/pages/emergency/search?search='+this.data.searchText,
    })
  },
  // 添加购物车
  addCar(e) {
    let list = JSON.parse(JSON.stringify(this.data.carList)),
    i = e.currentTarget.dataset.i,
    obj = this.data.dataList.list[i],
    allPrice = 0;
    obj.amount = 1;
    // if(obj.inventory == 0) {
    //   app.showError(obj.goodsName+'剩余库存不足！');
    //   return false;
    // }
    if(list.length == 0) {
      list.push(obj)
    }else {
      let flag = list.findIndex((v)=>{
        return v.goodsId == obj.goodsId;
      })
      if(flag == -1) {
        list.push(obj)
      }else {
        // if(list[flag].amount == obj.inventory) {
        //   app.showError(obj.goodsName+'剩余库存不足！')
        //   return false;
        // }
        // let limitedQuantity = obj.limitedQuantity;
        // if(limitedQuantity == list[flag].amount) {
        //   app.showError(`每人限购${limitedQuantity}份！`);
        //   return false;
        // }
        list[flag].amount = list[flag].amount+1;
      }
    }
    for(let v of list) {
      allPrice += parseFloat(v.amount || 1)
    }
    this.setData({
      carList:list,
      allPrice:allPrice
    })
  },
  // 结算
  jsTap() {
    wx.setStorageSync('wzList', this.data.carList);
    wx.navigateTo({
      url: '/pageA/pages/emergency/car',
    })
  },
  titToogle(e) {
    let i = e.currentTarget.dataset.i;
    this.setData({
      active:i
    })
    if(i == 1) {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
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
  // 获取订餐标签
  getTagList() {
    let _this = this;
    http(url.yjTag,{
      shopId:21
    },(res)=>{
      console.log(res)
      if(res.code == 0) {
        _this.setData({
          tagList:res.page.list,
          tolower:false
        })
        _this.data.tagList[0].labelId?_this.getShopList(2,1,_this.data.tagList[0].labelId):''
      }
    },'GET')
  },
  // 获取餐厅标签下的列表
  getShopList() {
    let _this = this,
    limit = this.data.limit,
    page = this.data.page,
    labelId = this.data.tagList[this.data.activeKey].labelId;
    let data = {
      publishState:1,
      limit:limit,
      page:page,
      shopId:21,
      labelId:labelId
    }
    http(url.yjTagList,data,(res)=>{
      if(res.code == 0) {
        if(!this.data.tolower) {
          _this.setData({
            dataList:res.page,
            refresh:false,
            tolower:res.page.totalCount > limit?true:false
          })
        }else {
          let obj = this.data.dataList;
          obj.list.push(...res.page.list);
          _this.setData({
            dataList:obj,
            refresh:false,
            tolower:res.page.totalCount > this.data.dataList.list.length?true:false
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
    let list = wx.getStorageSync('wzList')||[],
    allPrice = 0;
    for(let v of list) {
      allPrice += parseFloat(v.amount || 1)
    }
    this.setData({
      carList:list,
      allPrice:allPrice
    })
    wx.removeStorage({
      key: 'wzList',
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