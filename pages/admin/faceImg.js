// pages/admin/faceImg.js
const app = getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    imgUrl: url.imgUrl,
    fileList: [],
    attachmentGroupId: '',
    srcs: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    if (wx.getStorageSync('userInfo').faceImg) {
      let arr = this.data.fileList
      arr.push({
        url:this.data.imgUrl + wx.getStorageSync('userInfo').faceImg,
        name:'rl',
        isImage: true,
        imgId:wx.getStorageSync('userInfo').faceImg
      })
      this.setData({
        fileList: arr
      })
    } else {
      this.setData({
        srcs: ''
      })
    }
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      attachmentGroupId: new Date().getTime(),
    })
  },
  submit() {
    if(this.data.fileList.length == 0) {
      app.showError('请先上传图片');
      return false;
    }
    http(url.updateFace,{
      userId:this.data.userInfo.userId,
      faceImg:this.data.fileList[0].imgId
    },(res)=>{
      console.log(res)
      if(res.code == 0) {
        app.showSuccess('上传成功',()=>{
          this.data.userInfo.faceImg = this.data.fileList[0].imgId
          wx.setStorageSync('userInfo', this.data.userInfo)
          wx.navigateBack()
        })
      }
    },'POST','json')
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
                  _this.data.userInfo.faceImg = '';
                  wx.setStorageSync('userInfo', _this.data.userInfo)
                })
              }
            }, "DELETE", "json")
        } else if (res.cancel) {}
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