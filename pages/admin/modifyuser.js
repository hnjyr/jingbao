// pages/admin/modifyuser.js
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    username: '',
    phone: '',
    emailt:'',
    flag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let res = wx.getStorageSync('userInfo')
    console.log(res)
    this.setData({
      name: res.userName,
      username: res.nickName,
      phone: res.mobile,
      emailt: res.email,
      ava: res.avatar
    })
    // console.log(this.data.email)
    this.getinfo()
    this.showimg(this.data.ava)
  },
  /**
   * 匹配Email地址
   */
  isEmail(str) {
    if (str == null || str == "") return false;
    var result = str.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (result == null) return false;
    return true;
  },
  /**
   * 匹配phone
   */
  isPhone(str) {
    let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
    return reg.test(str);
  },
  usernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  emailInput(e) {
    console.log(e)
    this.setData({
      emailt: e.detail.value
    })
  },
  btn() {
    this.setData({
      flag: false
    })
  },
  close() {
    this.setData({
      flag: true
    })
  },
  ok() {
    const {
      name,
      username,
      phone,
      emailt,
      ava,
    } = this.data;
    if (username.trim() == '') {
      app.showError('姓名不能为空');
      return false;
    }
    if (!this.isPhone(phone)) {
      app.showError('手机号不能为空或格式不对');
      return false;
    }
    if (this.data.emailt!=''&&this.data.emailt!=null){
      if(!this.isEmail(emailt)) {
        app.showError('邮箱格式不正确');
        return false;
      }
    }
    http(url.updateInfo, {
      "avatar": ava,
      "email": emailt,
      "mobile": phone,
      "nickName": username,
      "userName": name
    }, res => {
      if (res.code == 0) {
        app.showSuccess('修改成功！')
        let userinfo = wx.getStorageSync('userInfo')
        userinfo.avatar = ava
        userinfo.email = emailt
        userinfo.nickName = username
        userinfo.mobile = phone
        wx.setStorageSync('userInfo', userinfo)
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/admin/index',
          })
        }, 300)
      }
    }, 'POST', 'json')
  },

  uploadimg() {
    if (!this.data.flag) {
      var that = this;
      wx.showActionSheet({
        itemList: ["拍照", "选取相册图片"],
        success: function (e) {
          0 == e.tapIndex ? that.chooseimage() : that.chooseimage();
        }
      });
    }

  },

  chooseimage: function () {
    var that = this;
    that.setData({
      face: "none"
    }), (that.chooseWxImage(), that.setData({}));
  },

  chooseWxImage: function () {
    var that = this,
      l = "camera";
    (l = "album"), wx.chooseImage({
      sizeType: ["original", "compressed"],
      sourceType: [l],
      success: function (res) {
        that.setData({
          avatar: res.tempFilePaths[0],
          src: res.tempFilePaths[0]
        })
        that.upload(res.tempFilePaths[0])
      }
    });
  },

  upload(src) {
    wx.showLoading({
      mask: true
    })
    const _this = this;
    wx.uploadFile({
      url: url.upload, // 仅为示例，非真实的接口地址
      filePath: src,
      name: 'file',
      header: {
        "X-Requested-With": "WXCHART",
        "Cookie": wx.getStorageSync('cookie'),
      },
      formData: {
        groupId: _this.data.attachmentGroupId
      },
      success(e) {
        let res = JSON.parse(e.data);
        _this.setData({
          ava: res.data.id
        })
        wx.hideLoading()
      },
    });
  },

  // 获取用户信息
  getinfo() {
    const that = this
    http(url.getuserinfo, {}, res => {
      console.log(res)
      if (res.code == 0) {
        that.setData({
          name: res.user.userName,
          username: res.user.nickName,
          phone: res.user.mobile,
          email: res.user.email,
          ava: res.user.avatar
        })
      }
    }, 'GET', 'json')
  },
  showimg(src) {
    const that = this
    wx.request({
      url: url.download + src,
      method: 'get',
      responseType: 'arraybuffer',
      header: {
        "Cookie": wx.getStorageSync('cookie'),
        "Content-Type": "application/form-data"
      },
      success: (res) => {
          let url = 'data:image/png;base64,' + wx.arrayBufferToBase64(res.data)
          that.setData({
            src: url
          })
          // var userInfo=wx.getStorageSync('userInfo')
          // // let newuserInfo={...userInfo,imgsrc:url}
          // // console.log('新',newuserInfo)
          // // return false
          // wx.setStorageSync('userInfo', newuserInfo)
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