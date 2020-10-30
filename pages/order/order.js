// pages/order/order.js
//获取应用实例
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo: {},
    twoshow: false,
    show: false,
    veCode: new Array(),
    veCodetwo: [],
    inputFocus: false,
    opayPwds: '',
    npayPwds: '',
    keybord: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'X'],
    payPassword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dataInfo: wx.getStorageSync('orderDetail'),
    })
    wx.removeStorage({
      key: 'orderDetail',
    })
    this.getbalance()
  },
  // 键盘输入
  clickKeybord(e) {
    let text = e.currentTarget.dataset.text,
      cont = '',
      twoshow = this.data.twoshow;
    if (!twoshow) {
      cont = this.data.opayPwds
    } else {
      cont = this.data.npayPwds
    }

    if (text == "C") {
      cont = '';
    } else if (text == "X") {
      cont = cont.substr(0, cont.length - 1);
    } else {
      if (cont.length == 6) {
        return false;
      }
      cont += text;
    }

    if (!twoshow) {
      this.setData({
        opayPwds: cont
      })
    } else {
      this.setData({
        npayPwds: cont
      })
    }

    if (cont.length == 6) {
      if (this.data.payPassword == 0) {
        this.setData({
          twoshow: true
        })
      } else {
        this.setData({
          show: false,
          twoshow: false
        })
        this.verifymi();
      }
    }
  },
  // 点击支付
  payBtn() {
    const {
      exemptPassword,
      dataInfo,
      payPassword
    } = this.data
    // 判断是否免密支付
    if (exemptPassword.isExemptPassword == 0 || exemptPassword.exemptPasswordAmount < dataInfo.totalPrice) {
      // 没有开启免密支付或额度超过
      if (payPassword == 1) { //已设置过支付密码
        this.setData({
          show: true,
          npayPwds:'',
          opayPwds:'',
        })
      } else { //显示设置支付密码在输入密码
        this.setData({
          show: true,
          npayPwds:'',
          opayPwds:'',
        })
      }
    } else { //开启免密支付不显示输入密码
      this.payForUser()
    }
  },
  //确认收货
  shBtn() {
    http(url.finish, {
      id: this.data.dataInfo.ordersId
    }, res => {
      if (res.code == 0) {
        app.showSuccess('收货成功！', () => {
          wx.navigateBack()
        })
      } else {
        app.showError(res.msg)
      }
    }, 'POST', 'json')
  },
  setPayMi() {
    const that = this,
      a1 = this.data.opayPwds,
      a2 = this.data.npayPwds;
    wx.request({
      url: url.updatePayPassword,
      data: {
        newPayPassword: a2,
        oldPayPassword: a1
      },
      header: {
        "Cookie": wx.getStorageSync('cookie'),
      },
      method: 'POST',
      success: (res) => {
        that.setData({
          show: false,
          npayPwds: '',
          opayPwds: '',
          twoshow: false
        })
        if (res.data.code = 500) {
          app.showError(res.data.msg);
        } else {
          app.showSuccess(res.data.msg);
          that.getbalance()
        }
      }
    })
  },

  getbalance() {
    const that = this
    http(url.getPurse, {}, res => {
      if (res.code == 0) {
        console.log(res)
        wx.setStorageSync('payPassword', res.data.payPassword != null ? res.data.payPassword : 0)
        var exemptPassword = {
          'isExemptPassword': res.data.isExemptPassword,
          'exemptPasswordAmount': res.data.exemptPasswordAmount
        }
        that.setData({
          balance: res.data.balance,
          payPassword: res.data.payPassword != null ? res.data.payPassword : 0,
          exemptPassword: exemptPassword
        })
        wx.setStorageSync('exemptPassword', exemptPassword)
      }
    }, 'GET')
  },

  onClose() {
    this.setData({
      show: false,
      veCode: new Array(),
      veCodetwo: [],
      twoshow: false,
      inputFocus: false
    });
  },

  // 校验支付密码
  verifymi() {
    const that = this,
      opayPwds = this.data.opayPwds;
    http(url.verifyPayPassword, {
      payPassword: opayPwds
    }, res => {
      if (res.code == 0) {
        app.showSuccess(res.msg)
        that.payForUser()
        that.setData({
          show: false
        })
      }
    })
  },

  // 支付
  payForUser() {
    const that = this
    http(url.payForUser, {
      ordersId: that.data.dataInfo.ordersId,
      payPassword: that.data.opayPwds
    }, res => {
      if (res.code == 0) {
        app.showSuccess(res.msg,()=>{
          wx.navigateTo({
            url: '/pages/order/success',
          })
        });
        that.setData({
          show: false
        })
      }
    }, 'POST', 'json')
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