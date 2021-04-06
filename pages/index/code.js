// pages/index/code.js
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const socket = require('../../utils/websocket.js');
const QRCode = require('../../utils/weapp-qrcode.js')
const sm4 = require('miniprogram-sm-crypto').sm4;
let qrcode;
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
    ordersId:'',
    srcSuccess:'/images/success.mp3',
    srcError:'/images/error.mp3',
    successCtx:'',
    errorCtx:'',
    ling_show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    // let decryptData = sm4.decrypt(encryptData, key)//解密
    // 网络切换的时候网络监测
   
    wx.onNetworkStatusChange(function (res) {
      console.log(res)
      // 没网的时候进行展示网络的二维码（生成）
      if(!res.isConnected){
          this.ling_code()
      }else{
        // 有网的时候进行展示网络的二维码
        _this.getCode()
        _this.setData({
          ling_show:false
        })
      }
    })
    let userInfo = wx.getStorageSync('userInfo');
    // 倒计时重新获取二维码
    timer = setInterval(()=>{
      this.setData({
        second:this.data.second - 1
      })
      if(this.data.second == 0) {
        if(!this.data.ling_show){
          this.getCode();
          this.setData({
            second:30
          })
        }else{
          this.ling_code();
          this.setData({
            second:30
          })
        }
      }
    },1000)
    if(!this.data.ling_show){
      this.getCode();
    }else{
      this.ling_code()
    }
    socket.connectSocket(userInfo.userId);
    socket.onSocketMessageCallback = function(res) {
      let data = JSON.parse(res),
        code = data.status;
        switch (code) {
          case 1:
            _this.successCtx.play();
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
            _this.errorCtx.play();
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
            _this.errorCtx.play();
            app.showError(data.message,()=>{
              wx.navigateBack();
            })
            break;
        }
    };
    
  },
  // 生成临时二维码
  ling_code(){
    let _this = this
    const key = [0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0xfe, 0xdc, 0xba, 0x98, 0x76, 0x54, 0x32, 0x10];
    let timestamp2 = (new Date()).valueOf();
    let second = timestamp2+''+wx.getStorageSync('userInfo').userId
    console.log(second)
    let encryptData = sm4.encrypt(second, key); // 加密
    qrcode = new QRCode('canvas', {
        text: encryptData,
        colorDark: "#DB2016",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
    });
    _this.setData({
      ling_show:true
    })
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
      },
      fail(){
        // 生成临时二维码
        _this.ling_code()
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
    // 获取音频标签
    this.successCtx = wx.createAudioContext('mySuccess');
    this.errorCtx = wx.createAudioContext('myError');
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