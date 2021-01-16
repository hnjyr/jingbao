// pages/bank/binding.js
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: false, // 是否显示已选择的银行卡
    show: false, //添加银行卡弹窗
    value: {},
    banklist: [],
    showChooseBank: false, //选择银行卡弹窗
    cardnum: '', // 银行卡号
    codeFlag: true,
    phone: '',
    codes: '获取',
    number: 60,
    balance: '0.00', //余额
    amount: '',
    code: '',
    id: '', //银行卡id
    bandCard: '',
    idCard: '',
    name: '',
    bankName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBalance()
    this.getBanklist()
    this.setData({
      phone: wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo').mobile : ''
    })
  },
  showAddbank() {
    if (this.data.banklist.length < 1) {
      this.setData({
        show: true
      })
    } else {
      this.setData({
        showChooseBank: true
      })
    }
  },
  submitData() {
    this.setData({
      bandCard: '',
      idCard: '',
      name: '',
      bankName: ''
    })
  },
  // 点击弹出层消失
  onClose() {
    this.setData({
      show: false,
      showChooseBank: false
    })
  },

  // 删除银行卡号
  deleteBankCard(e) {
    const _this = this
    const {
      id
    } = e.currentTarget.dataset
    let arr = []
    arr.push(id)
    wx.showModal({
      title: '删除',
      content: '确定删除该银行卡吗？',
      confirmColor: '#2963E0',
      success(res) {
        if (res.confirm) {
          http(url.deletebank, arr, res => {
            if (res.code == 0) {
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                success: function (resq) {
                  _this.setData({
                    showChooseBank: false
                  })
                  _this.getBanklist()
                }
              })
            }
          }, 'DELETE', 'json')
        }
      }
    })
  },
  // 添加银行卡
  addNew() {
    this.setData({
      show: true,
      showChooseBank: false,
      bandCard: '',
      idCard: '',
      name: '',
      bankName: ''
    })
  },

  // 点击银行卡列表
  chooseBank(e) {
    const {
      banknum,
      banname,
      id
    } = e.currentTarget.dataset
    this.setData({
      flag: true,
      cardnum: banname + '(' + banknum + ')',
      showChooseBank: false,
      id
    })
  },

  // 获取提现金额
  getAmount(e) {
    this.setData({
      amount: e.detail.value
    })
  },

  // 验证码
  getVerificationCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 获取验证码
  getCode() {
    const _this = this
    if (!this.data.codeFlag) {
      return false;
    }
    this.setData({
      codeFlag: false,
    })
    if (this.data.codes == '获取') {
      http(url.sendVerificationCode, {
        mobile: this.data.phone
      }, res => {
        if (res.code == 0) {
          let timer = setInterval(resq => {
            _this.setData({
              number: _this.data.number - 1,
              codes: _this.data.number + 's'
            })
            if (_this.data.number == 0) {
              _this.setData({
                codes: '获取'
              })
              clearInterval(timer)
              _this.setData({
                number: 60,
                codeFlag: true
              })
            }
          }, 1000)
        }
      })
    }
  },

  // 查询余额
  getBalance() {
    http(url.getPurse, {}, res => {
      if (res.code == 0) {
        this.setData({
          balance: res.data.balance,
          isExemptPassword: res.data.payPassword
        })
      }
    }, 'GET')
  },

  // 获取银行卡列表
  getBanklist() {
    http(url.getbanklist, {
      userId: wx.getStorageSync('userInfo').userId
    }, res => {
      if (res.code == 0) {
        this.setData({
          banklist: res.page.list
        })
      }
    })
  },

  // 获取提交表单值
  getValue(e) {
    var name = e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value
    })
  },

  // 提交添加银行卡
  _submit(e) {
    const _this = this
    const {
      bandCard,
      idCard,
      name,
      bankName
    } = this.data
    let reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
    if (bandCard.trim() == '') {
      wx.showToast({
        title: '请填写银行卡号',
        icon: 'none'
      })
      return false
    } else if (!util.checkBankno(bandCard)) {
      wx.showToast({
        title: '请输入正确的银行卡号',
        icon: 'none'
      })
      return false
    } else if (idCard.trim() == '') {
      wx.showToast({
        title: '请填写身份证号码',
        icon: 'none'
      })
      return false
    } else if (!reg.test(idCard)) {
      wx.showToast({
        title: '请填写正确的身份证号码',
        icon: 'none'
      })
      return false
    } else if (name.trim() == '') {
      wx.showToast({
        title: '请填写用户名',
        icon: 'none'
      })
      return false
    } else if (bankName.trim() == '') {
      wx.showToast({
        title: '请填写所属银行',
        icon: 'none'
      })
      return false
    }
    http(url.addbankcard, {
      bandCard,
      idCard,
      name,
      bankName
    }, res => {
      if (res.code == 0) {
        wx.showToast({
          title: '添加成功',
          success: function (resq) {
            _this.setData({
              show: false,
              bandCard: '',
              idCard: '',
              name: '',
              bankName: ''
            })
            _this.getBanklist()
          }
        })
      }
    }, 'POST', 'json')
  },

  // 提现
  withdrawal() {
    if (this.data.amount.trim() == '') {
      wx.showToast({
        title: '请填写提现金额',
        icon: 'none'
      })
      return false
    }
    if (Number(this.data.amount) > Number(this.data.balance)) {
      wx.showToast({
        title: '提现金额不能大于当前余额',
        icon: 'none'
      })
      return false
    }
    if (this.data.id == '') {
      wx.showToast({
        title: '请选择银行卡',
        icon: 'none'
      })
      return false
    }
    if (this.data.code.trim() == '') {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none'
      })
      return false
    }

    http(url.withdrawal, {
      amount: this.data.amount,
      bandCardId: this.data.id,
      verificationCode: this.data.code
    }, res => {
      if (res.code == 0) {
        wx.showToast({
          title: '提现成功'
        })
      }
      // console.log(res)
    }, 'POST', 'json')
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})