// pages/list/car.js
const url = require('../../../utils/config.js');
const http = require('../../../utils/http.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  /**
   * 页面的初始数据
   */
  data: {
    adminShow: true, //编辑或完成      
    totalPrice: 0, //总金额 
    allselect: true, //是否全选    
    selectArr: [], //已选择的商品  
    cartData: [{
        "id": 1,
        "amount": 2,
        "price": 50,
        "name": "手机",
        "checked": false,
        "image": "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640"
      },
      {
        "id": 2,
        "amount": 1,
        "price": 10,
        "name": "显示器",
        "checked": false,
        "image": "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640"
      },
      {
        "id": 3,
        "amount": 5,
        "price": 120,
        "name": "可乐",
        "checked": false,
        "image": "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640"
      },
      {
        "id": 4,
        "amount": 10,
        "price": 50,
        "name": "手机",
        "checked": false,
        "image": "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640"
      },
      {
        "id": 4,
        "amount": 1,
        "price": 10,
        "name": "芝麻",
        "checked": false,
        "image": "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640"
      },
    ],
    imgUrl:url.imgUrl,
    show: false,
    radio: '1',
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },
  // 提交
  onConfirm(e) {
    let { selectArr, radio, userInfo } = this.data;
    let list = [];
    if(radio == 1) {
      for(let v of selectArr) {
        if(v.amount > v.inventory) {
          app.showError(v.goodsName+'库存不足！');
          return false;
        }
      }
    }
    for(let v of selectArr) {
      list.push({
        goodsId:v.goodsId,
        goodsName:v.goodsName,
        piece:v.amount,
        shopId:v.shopId,
        remark:v.remark,
      })
    }
    http(url.saveForZhuangbei,{
      createUserName:userInfo.nickName,
      mobile:userInfo.mobile,
      ordersLinkEntityList:list,
      shopId:21,
      ordersType:radio == 1?8:7
    },res=>{
      if(res.code == 0) {
        app.showSuccess(`${radio == 1?'出库':'入库'}成功！`,()=>{
          wx.removeStorageSync('wzList')
          wx.redirectTo({
            url: '/pageA/pages/emergency/listDetail?id='+res.data.ordersId,
          })
        })
      }
    },'post','json')
  },
  onClose() {
    this.setData({ show: false });
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
    let list = wx.getStorageSync('wzList'),
    totalPrice = 0,
    list1 = [];
    for(let v of list) {
      v.checked = true;
      totalPrice += parseFloat(v.amount || 1)
      list1.push(v)
    }
    this.setData({
      cartData:list,
      totalPrice:totalPrice,
      selectArr:list1
    })
  },
  //计算价格
  calculateTotal: function () {
    var selectArr = this.data.selectArr; //已选择的商品
    var totalPrice = 0;
    if (selectArr.length) { //如果存在商品就计算价格
      for (var i = 0; i < selectArr.length; i++) {
        totalPrice += parseFloat(selectArr[i].amount);
      }
      // totalPrice = parseFloat(totalPrice.toFixed(2)); //乘法有点问题, 需要保留一下小数
      this.setData({
        totalPrice: totalPrice
      })
    } else { //不存在商品就把总价格置为 0
      this.setData({
        totalPrice: 0
      })
    }
  },
  //判断是否为全选  
  judgmentAll: function () {
    var cartData = this.data.cartData; //初始数据
    var selectArr = this.data.selectArr; //已选择的商品
    if (selectArr.length == cartData.length) { //长度相等就是全部选上了
      this.setData({
        allselect: true
      })
    } else {
      this.setData({
        allselect: false
      })
    }
  },
  //全选
  allcheckTap: function () {
    var that = this;
    var cartData = that.data.cartData; //初始数据
    var selectArr = []; //定义空数组
    var allselect = !that.data.allselect; //data里的是否全选先改变状态存着

    if (allselect) { //如果为真, 初始数据里的每条checked变为true, 然后push到定义的空数组里
      for (var i = 0; i < cartData.length; i++) {
        cartData[i].checked = true;
        selectArr.push(cartData[i])
      }
    } else { //不为真就变成false, 定义的数组再置空一次
      for (var i = 0; i < cartData.length; i++) {
        cartData[i].checked = false;
      }
      selectArr = [];
    }
    that.setData({ //重新设置数据
      cartData: cartData, //初始的数据
      allselect: allselect, //全选的状态
      selectArr: selectArr //已选择的商品
    })
    that.calculateTotal(); // 最后计算一次价格 (计算价格放到重置数据之前会出问题)
  },
  //单个商品选择
  checkTap: function (e) {
    var index = e.currentTarget.dataset.index; //取到渲染的下标
    var cartData = this.data.cartData; //初始数据
    var selectArr = this.data.selectArr; //已选择的商品数组
    cartData[index].checked = !cartData[index].checked //没选中的就要选中, 选中了的就取消选中状态
    if (cartData[index].checked) { //如果选中了, 就放到一选择的商品数组里
      // for (var i = 0; i < selectArr.length; i++) {
      //   if (cartData[i] == selectArr[index]) {
      //     selectArr.push(cartData[index])
      //   }
      // }
      selectArr.push(cartData[index])
      this.judgmentAll(); //计算价格
    } else { //取消选中就从已选择的商品数组里移除
      for (var i = 0; i < selectArr.length; i++) {
        if (selectArr[i].goodsId == cartData[index].goodsId) {
          selectArr.splice(i, 1)
        }
      }
      this.judgmentAll(); //选择的时候要判断是不是已经选择了全部的
    }
    this.calculateTotal(); //计算一次价格

    this.setData({ //重置数据
      cartData: cartData,
      selectArr: selectArr
    })
  },
  //数量加减
  numchangeTap: function (e) {
    var types = e.currentTarget.dataset.types; //加和减的两张图片上分别设置了types属性
    var index = e.currentTarget.dataset.index; //获取下标
    var cartData = this.data.cartData; //初始数据
    if (types == 'minus') { //减
      var amount = cartData[index].amount;
      if (amount <= 1) { //不允许商品数量小于1 ,  都添加到购物车了还要减到0是几个意思? 反正有个删除按钮
        cartData.splice(index,1)
      } else {
        cartData[index].amount--;
      }
      let selectArr = JSON.parse(JSON.stringify(cartData));
      this.setData({
        cartData: cartData.length == 0?[]:cartData,
        selectArr:selectArr
      })
      this.calculateTotal(); //计算价格
    }
    if (types == "add") { //加
      if(cartData[index].inventory == cartData[index].amount) {
        app.showError('剩余库存不足！');
        return false;
      }
      let limitedQuantity = cartData[index].limitedQuantity;
      if(limitedQuantity == cartData[index].amount) {
        app.showError(`每人限购${limitedQuantity}份！`);
        return false;
      }
      cartData[index].amount++; //加就不判断了, 加到二十二世纪去都行
      this.setData({
        cartData: cartData
      })
      this.calculateTotal(); //计算价格
    }
    wx.setStorageSync('carList', this.data.cartData);
  },
  //删除商品 
  deleteshopTap: function () { //要删除 肯定是已经选中了的商品, 所以肯定在 selectArr里面
    //这里好像有一点小BUG, 不过, 我忘记了.  
    var cartData = this.data.cartData; //初始数据
    var selectArr = this.data.selectArr; //已选择的商品数组
    if (selectArr.length) { //如果以选择的商品数组里有长度
      for (var i = 0; i < cartData.length; i++) {
        for (var j = 0; j < selectArr.length; j++) {
          if (cartData[i].goodsId == selectArr[j].goodsId) { //把初始数据的对应id的数据删掉就好了
            cartData.splice(i, 1);
          }
        }
      }
      this.setData({ //重置一下数据
        cartData: cartData,
        selectArr: [] //已选择的数组置空
      })
      this.calculateTotal(); //计算价格
    }
  },
  //编辑或完成
  adminTap: function () { //切换四个按钮的显示
    this.setData({
      adminShow: !this.data.adminShow
    })
  },
  //结算
  toApply: function () {
    if(this.data.selectArr.length != 0) {
      this.setData({
        show:true
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