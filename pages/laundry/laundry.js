// pages/laundry/laundry.js
const app = getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
let submitFlag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '1',
    active: 1,
    weekList: [],
    activeTime: 0,
    yifuList: [],
    seleList1: [],
    seleList2: [],
    userInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
    this.getWeekDay();
    this.getClothesTag("3");
  },
  radioClick(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      radio: name,
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
  submit() {
    let seleList1 = this.data.seleList1,
      seleList2 = this.data.seleList2,
      clothesCasualLabel = '', //便服
      clothesPoliceLabel = '', //警服
      reserveTime = this.data.weekList[this.data.activeTime].date;
    for (let v of seleList1) {
      if (v.num > 1) {
        for (let i = 0; i < v.num; i++) {
          clothesCasualLabel += `${v.labelName},`;
        }
      } else {
        clothesCasualLabel += `${v.labelName},`;
      }
    }
    for (let v of seleList2) {
      if (v.num > 1) {
        for (let i = 0; i < v.num; i++) {
          clothesPoliceLabel += `${v.labelName},`;
        }
      } else {
        clothesPoliceLabel += `${v.labelName},`;
      }
    }
    // 去掉最后一个逗号
    clothesCasualLabel = clothesCasualLabel.substring(0, clothesCasualLabel.length - 1);
    clothesPoliceLabel = clothesPoliceLabel.substring(0, clothesPoliceLabel.length - 1);
    if (!clothesCasualLabel && !clothesPoliceLabel) {
      app.showError('请先选择一件衣服！');
      return false;
    }
    if (!submitFlag) {
      return false;
    }
    submitFlag = false;
    app.getDyInfo(['5JWugDNNHLwmdQGqr0JLrZqTh7-2WuRXI2JC3vH8tYs', 'w9YYPOrqNy0QL_d7JlWi2q54MCJo-GzvRQVmz4We0BU'], () => {
      http(url.saveWashRecord, {
        clothesCasualLabel,
        clothesPoliceLabel,
        reserveTime,
        shopId: 10,
        isAgent: this.data.radio == 2 ? 1 : '',
        thePrincipalId: this.data.radio == 2 ? this.data.userInfo.leaderId : '',
      }, res => {
        if (res.code == 0) {
          app.showSuccess('预约成功', () => {
            wx.navigateBack()
          })
        } else {
          app.showError(res.msg)
        }
      }, 'POST', 'json')
    })
    setTimeout(res => {
      submitFlag = true
    }, 1000)
  },
  // 删除选择
  delYf1(e) {
    let i = e.currentTarget.dataset.i,
      yfList = this.data.yifuList,
      seleList1 = this.data.seleList1,
      seleList2 = this.data.seleList2,
      cont = yfList[i];
    if (this.data.active == 1) {
      if (seleList1[i].num > 1) {
        seleList1[i].num = seleList1[i].num - 1
      } else {
        seleList1.splice(i, 1)
      }
    } else {
      if (seleList2[i].num > 1) {
        seleList2[i].num = seleList2[i].num - 1
      } else {
        seleList2.splice(i, 1)
      }
    }
    this.setData({
      seleList1,
      seleList2
    })
  },
  // 点击选择
  seleYf(e) {
    let i = e.currentTarget.dataset.i,
      yfList = this.data.yifuList,
      seleList1 = this.data.seleList1,
      seleList2 = this.data.seleList2,
      cont = yfList[i];
    if (this.data.active == 1) {
      if (seleList1.length == 0) {
        seleList1.push(cont)
      } else {
        let index = seleList1.findIndex(v => {
          return v.labelName == cont.labelName
        })
        if (index != -1) {
          let num = seleList1[index].num ? seleList1[index].num : 1
          seleList1[index].num = Number(num) + 1
        } else {
          seleList1.push(cont)
        }
      }
    } else {
      if (seleList2.length == 0) {
        seleList2.push(cont)
      } else {
        let index = seleList2.findIndex(v => {
          return v.labelName == cont.labelName
        })
        if (index != -1) {
          let num = seleList2[index].num ? seleList2[index].num : 1
          seleList2[index].num = Number(num) + 1
        } else {
          seleList2.push(cont)
        }
      }
    }
    this.setData({
      seleList1,
      seleList2
    })
  },
  // 切换警服便服
  toogle(e) {
    let i = e.currentTarget.dataset.i;
    this.setData({
      active: i
    })
    this.getClothesTag(i == 1 ? 3 : 2)
  },
  // 获取衣服标签接口
  getClothesTag(labelType) {
    // labelType 3便服  2警服
    http(url.xiyiList, {
      labelType: labelType,
      shopType: "4"
    }, res => {
      if (res.code == 0) {
        this.setData({
          yifuList: res.page.list
        })
      }
    })
  },
  // 点击选择时间
  seleTime(e) {
    let i = e.currentTarget.dataset.i;
    this.setData({
      activeTime: i
    })
  },
  // 获取一周
  getWeekDay() {
    let weekList = [],
      list = ['日', '一', '二', '三', '四', '五', '六'],
      currentDay = new Date(),
      timesStamp = currentDay.getTime();
    for (let i = 0; i < 7; i++) {
      let date = new Date(timesStamp + 24 * 60 * 60 * 1000 * i).getTime();
      let day = new Date(timesStamp + 24 * 60 * 60 * 1000 * i).getDate();
      let week = new Date(timesStamp + 24 * 60 * 60 * 1000 * i).getDay();
      weekList.push({
        day: day,
        week: `周${list[week]}`,
        date: date
      })
    }
    this.setData({
      weekList: weekList
    })
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