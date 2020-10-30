// pages/index/code.js
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const socket = require('../../utils/websocket.js');
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer:'',
    second:30,
    imgSrc:url.imgUrl,
    src:'',
    twoshow: false,
    show: false,
    opayPwds: '',
    npayPwds: '',
    keybord: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'X'],
    payPassword: '1',
    ordersId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let userInfo = wx.getStorageSync('userInfo');
    timer = setInterval(()=>{
      this.setData({
        second:this.data.second - 1
      })
      if(this.data.second == 0) {
        this.getCode();
        this.setData({
          second:30
        })
      }
    },1000)
    this.getCode();
    
    socket.connectSocket(userInfo.userId);
    socket.onSocketMessageCallback = function(res) {
      let data = JSON.parse(res),
        code = data.status;
        console.log(data)
        switch (code) {
          case 1:
            app.showError(data.message,()=>{
              wx.navigateBack()
            })
            break;
          case 2:
            app.showError(data.message,()=>{
              _this.setData({
                show:true,
                ordersId:data.data.ordersId
              })
            })
            break;
          case 3:
            app.showError(data.message,()=>{
              wx.navigateTo({
                url: '/pages/admin/type',
              })
            })
            break;
          case 4:
            app.showError(data.message,()=>{
              _this.setData({
                show:true,
              })
            })
            break;
          case 5:
            app.showError(data.message,()=>{
              wx.navigateBack();
            })
            break;
        }
    };
    
  },
  // 获取支付码
  getCode() {
    let _this = this;
    wx.request({
      url: url.payQrcode,
      method:'GET',
      responseType: 'arraybuffer',
      header:{
        "X-Requested-With":"WXCHART",
        "Cookie": wx.getStorageSync('cookie'),
      },
      success(res) {
        let url ='data:image/png;base64,'+wx.arrayBufferToBase64(res.data)
        _this.setData({
          src:url,
        })
      }
    })
  },
  // 校验支付密码
  verifymi() {
    const that = this,
      opayPwds = this.data.opayPwds;
    socket.sendSocketMessage({
      msg: JSON.stringify({
        payPassword:opayPwds,
        ordersId:that.data.ordersId,
        userId:wx.getStorageSync('userInfo').userId
      }),
      success(res) {
        console.log(res)
      }
    })
    // http(url.verifyPayPassword, {
    //   payPassword: opayPwds
    // }, res => {
    //   if (res.code == 0) {
    //     app.showSuccess(res.msg)
    //     // that.payForUser()
    //     that.setData({
    //       show: false
    //     })
    //   }
    // })
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
  onClose() {
    this.setData({
      show: false,
      twoshow: false,
    });
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
    socket.closeSocket();
    // socket.stopHeartBeat();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    socket.closeSocket();
    clearInterval(timer)
    // socket.stopHeartBeat();
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