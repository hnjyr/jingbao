// pages/admin/wallet.js
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    show: false,
    veCode: new Array(),
    veCodetwo: [],
    time: 60,
    twoshow: false,
    inputFocus: false,
    opayPwds: '',
    npayPwds: '',
    keybord: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'X'],
  },

  onClose() {
    this.setData({
      show: false,
      opayPwds: '',
      npayPwds: '',
    });
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
      if (!twoshow) {
        this.setData({
          twoshow: true
        })
      } else {
        this.setData({
          show: false,
          twoshow: false
        })
        this.setPayMi();
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbalance()
  },
  
  paypwd() {
    this.setData({
      show: true,
      opayPwds: '',
      npayPwds: '',
    });
  },

  // a1 新密码  a2旧密码  type 1添加 2修改
  setPayMi() {
    const that = this,
      a1 = this.data.opayPwds,
      a2 = this.data.npayPwds;
    http(url.updatePayPassword, {
      newPayPassword: a2,
      oldPayPassword: a1
    }, res => {
      if (res.code = 500) {
        app.showSuccess(res.msg);

      }
    }, 'POST', 'json')
  },

  getbalance() {
    const that = this
    http(url.getPurse, {}, res => {
      if (res.code == 0) {
        that.setData({
          balance: res.data.balance,
          isExemptPassword: res.data.payPassword
        })
        // wx.setStorageSync('payPassword', res.data.payPassword!=null?res.data.payPassword:0)
        // var exemptPassword={
        //   'isExemptPassword':res.data.isExemptPassword,
        //   'exemptPasswordAmount':res.data.exemptPasswordAmount
        // }
        // wx.setStorageSync('exemptPassword', exemptPassword)
      }
    }, 'GET')
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