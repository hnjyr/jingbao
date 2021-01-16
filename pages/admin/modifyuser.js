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
    nickName:"",
    username: '',
    phone: '',
    emailt: '',
    flag: true,
    // radio: '1',
    deptlist: [],
    index: 0,
    policeNumber: "", //警员编号
  },
  // 性别切换
  onChange(event) {
    this.setData({
      sexindex: event.detail,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let res = wx.getStorageSync('userInfo')
    this.setData({
      name: res.userName,
      nickName: res.nickName,
      phone: res.mobile,
      emailt: res.email,
      ava: res.avatar,
      deptId: res.deptId, //是否需要完善  null要完善
      index: res.deptId,
      posindex: res.position,
      usertindex: res.userType,
      policeNumber: res.policeNumber,
      sexindex: res.sex
    })
    this.getdeptId()
    this.getslist('sex', 1)
    this.getslist('position', 2)
    this.getslist('userType', 3)
    this.showimg(this.data.ava)
    wx.setNavigationBarTitle({
      title: this.data.deptId == null ? '用户信息完善' : "个人信息"
    })
  },
  // 获取性别，职位，用户类型列表
  getslist(type, status) {
    const that = this
    http(url.listByCache + type, {}, res => {
      if (res.code == 0) {
        let list = []
        const lists = res.data
        lists.forEach((it, index) => {
          var obj = {
            text: it.value,
            value: it.code
          }
          list.push(obj)
          if (status == 1) {
            that.setData({
              sexlist: list,
            })
            if (that.data.deptId == null) {
              list.forEach((it, index) => {
                if (it.text == "男") {
                  that.setData({
                    sexindex: lists[index].code
                  })
                }
              })
            }
          } else if (status == 2) {
            that.setData({
              poslist: list,
            })
            if (that.data.deptId == null) {
              that.setData({
                posindex: lists[0].code
              })
            }
          } else {
            that.setData({
              usertlist: list,
            })
            if (that.data.deptId == null) {
              that.setData({
                usertindex: lists[0].code
              })
            }
          }
        });
      }
    }, 'POST', 'json')
  },
  // 获取用户部门列表
  getdeptId() {
    const that = this
    http(url.deptlist, {}, res => {
      let list = []
      res.forEach((it, index) => {
        var obj = {
          text: it.name,
          value: it.deptId
        }
        list.push(obj)
        that.setData({
          deptlist: list,
        })
        if (that.data.deptId == null) {
          that.setData({
            index: res[0].deptId
          })
        }
      });
    }, 'GET', 'json')
  },
  onChangepo(e) {
    this.setData({
      posindex: e.detail
    })
  },
  onChangedept(e) {
    this.setData({
      index: e.detail
    })
  },
  onChangeusert(e) {
    this.setData({
      usertindex: e.detail,
    })
  },
  /**
   * 匹配Email地址
   */
  isEmail(str) {
    if (str == null || str == "") return false;
    var result = str.match(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/);
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
      nickName: e.detail.value
    })
  },
  emailpoliceNumber(e) {
    this.setData({
      policeNumber: e.detail.value
    })
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  emailInput(e) {
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
    const that = this
    const {
      name,
      nickName,
      phone,
      emailt,
      ava,
      sexindex,
      posindex,
      usertindex,
      index,
      policeNumber
    } = this.data;
    if (nickName.trim() == '') {
      app.showError('姓名不能为空');
      return false;
    }
    if (!this.isPhone(phone)) {
      app.showError('手机号不能为空或格式不对');
      return false;
    }
    if (emailt == '') {
      app.showError('邮箱不能为空');
      return false;
    }
    if (!this.isEmail(emailt)) {
      app.showError('邮箱格式不正确');
      return false;
    }
    // if (policeNumber == '') {
    //   app.showError('警员编号不能为空');
    //   return false;
    // }
    http(url.updateInfo, {
      "avatar": ava,
      "email": emailt,
      "mobile": phone,
      "nickName": nickName,
      "userName": name,
      "sex": sexindex,
      "deptId": index,
      "position": posindex,
      "userType": usertindex,
      // "policeNumber": policeNumber
    }, res => {
      if (res.code == 0) {
        app.showSuccess('修改成功！')
        let userinfo = wx.getStorageSync('userInfo')
        userinfo.avatar = ava
        userinfo.email = emailt
        userinfo.nickName = nickName
        userinfo.mobile = phone
        userinfo.deptId = index, //是否需要完善  null要完善
        userinfo.position = posindex,
        userinfo.userType = usertindex,
        userinfo.policeNumber = policeNumber,
        userinfo.sex = sexindex
        wx.setStorageSync('userInfo', userinfo);
        // 获取用户信息
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/admin/index',
          })
        }, 150)
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
      if (res.code == 0) {
        that.setData({
          name: res.user.userName,
          nickName: res.user.nickName,
          phone: res.user.mobile,
          email: res.user.email,
          ava: res.user.avatar
        })
        wx.setStorageSync('userInfo', res.user);
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