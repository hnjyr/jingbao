// pages/repair/apply.js
const app = getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
let submitFlag = true;
let submitFlags = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: url.imgUrl,
    fileList: [],
    show: false,
    userInfo: '',
    goodsName: '',
    address: '指挥中心',
    applyDate: '',
    applyContent: '',
    attachmentGroupId: '',
    currentDate: '',
    minDate: '',
    showTime: false,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    type: '',
    imgList: []
  },
  lookImg(e) {
    let i = e.currentTarget.dataset.i;
    let arr = [];
    for (let v of this.data.imgList) {
      arr.push(this.data.imgUrl + v.id)
    }
    wx.previewImage({
      current: arr[i], // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  onClickShow() {
    // 提交
    let {
      applyContent,
      applyDate,
      userInfo,
      fileList,
      goodsId,
      attachmentGroupId
    } = this.data;
    if (applyDate == '') {
      app.showError('请选择维修预约时间');
      return false;
    }
    if (applyContent == '') {
      app.showError('请填写维修内容');
      return false;
    }
    if (fileList.length == 0) {
      app.showError('请上传维修图片');
      return false;
    }
    if (!submitFlag) {
      return false;
    }
    submitFlag = false;
    app.getDyInfo(['5JWugDNNHLwmdQGqr0JLrZqTh7-2WuRXI2JC3vH8tYs', 'j2JPba9YRtG9h1_JqfbqwKANOjaDp6EPRuLbTIR8sbw', 'hEgwPm64nLGyxZttSBN8oqMjnMO27n-Lq0G_5onTBSs'], () => {
      http(url.sqSave, {
        applyContent,
        applyDate,
        applyState: '1',
        approvalId: '1',
        attachmentGroupId: attachmentGroupId - 0,
        createTime: new Date().getTime(),
        deptId: userInfo.deptId,
        petitioner: userInfo.nickName,
        petitionerPhone: userInfo.mobile,
        shopGoodsId: goodsId
      }, res => {
        if (res.code == 0) {
          this.setData({
            show: true
          });
        } else {
          app.showError(res.msg)
        }
      }, 'POST', 'json')
      setTimeout(res => {
        submitFlag = true
      }, 1000)
    })

  },
  // 删除图片
  deleteImgs(event) {
    let i = event.detail.index,
      fileList = this.data.fileList,
      _this = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          http(url.deleteImg,
            JSON.stringify([_this.data.fileList[i].imgId]), data => {
              if (data.code == 0) {
                app.showSuccess('删除成功！', () => {
                  fileList.splice(i, 1);
                  _this.setData({
                    fileList: fileList
                  })
                })
              }
            }, "DELETE", "json")
        } else if (res.cancel) {}
      }
    })

  },
  // 维修员
  onClickShows() {
    // 提交
    let {
      applyDate,
      fileList,
      attachmentGroupId
    } = this.data;
    if (applyDate == '') {
      app.showError('请选择维修完成时间');
      return false;
    }
    if (fileList.length == 0) {
      app.showError('请上传维修图片');
      return false;
    }
    if (!submitFlags) {
      return false;
    }
    submitFlags = false;
    app.getDyInfo(['5JWugDNNHLwmdQGqr0JLrZqTh7-2WuRXI2JC3vH8tYs', 'j2JPba9YRtG9h1_JqfbqwKANOjaDp6EPRuLbTIR8sbw', 'hEgwPm64nLGyxZttSBN8oqMjnMO27n-Lq0G_5onTBSs'], () => {
      http(url.repairrecordUpdate, {
        finishDate: applyDate,
        groupId: attachmentGroupId - 0,
        recordId: this.data.dataInfo.repairRecordEntity.recordId,
        repairState: '2',
      }, res => {
        if (res.code == 0) {
          this.setData({
            show: true
          });
        } else {
          app.showError(res.msg)
        }
        setTimeout(res => {
          submitFlags = true
        }, 1000)
      }, 'PUT', 'json')
    })

  },

  onClickHide() {
    this.setData({
      show: false
    });
  },
  contInput(e) {
    this.setData({
      applyContent: e.detail
    })
  },
  // shijian
  timeSelect() {
    this.setData({
      showTime: true,
    })
  },
  // 时间选择
  timeConfirm(e) {
    this.setData({
      showTime: false,
      applyDate: e.detail,
      applyTime: util.formatEndTime(new Date(e.detail))
    })
  },
  // 返回
  backTap() {
    wx.navigateBack();
  },
  noop() {
    this.setData({
      show: false
    });
    var pages = getCurrentPages(); //页面指针数组
    var prepage = pages[pages.length - 2]; //上一页面指针
    prepage.setData({
      page: 1,
      dataList: []
    }); //操作上一页面
    prepage.getDataList()
    wx.navigateBack({
      delta: 2,
    });
    // wx.navigateBack()
  },
  afterRead(event) {
    const {
      file
    } = event.detail,
      _this = this;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: url.upload, // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'file',
      header: {
        "X-Requested-With": "WXCHART",
        "Cookie": wx.getStorageSync('cookie'),
        // "Content-Type":"application/form-data"
      },
      formData: {
        groupId: _this.data.attachmentGroupId
      },
      success(e) {
        let res = JSON.parse(e.data);
        // 上传完成需要更新 fileList
        const {
          fileList = []
        } = _this.data;
        fileList.push({
          ...file,
          url: _this.data.imgUrl + res.data.id,
          imgId: res.data.id,
          deletable: true
        });
        _this.setData({
          fileList
        });
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      attachmentGroupId: new Date().getTime(),
      currentDate: new Date().getTime(),
      minDate: new Date().getTime(),
      address:userInfo.deptName || ''
    })
    this.setData({
      userInfo: userInfo,
      goodsName: options.goodsName,
      goodsId: options.goodsId,
      type: options.type ? options.type : '',
      dataInfo: options.type == 1 ? wx.getStorageSync('wxDetail') : ''
    })
    if (options.type == 1) {
      http(url.attachmentList, {
        groupId: this.data.dataInfo.attachmentGroupId
      }, res => {
        this.setData({
          imgList: res.page.list
        })
      })
    }
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