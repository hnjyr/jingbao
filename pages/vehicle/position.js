const app=getApp();
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
// pages/vehicle/position.js
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lat:'',
    long:'',
    name:'',
    mLat:'',
    mLong:'',
    marker:[],
    userInfo:'',
    isOpenLocationAuth:2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // wx.getSetting({
    //   success(res) {
    //     console.log(res.authSetting['scope.userLocation'])
    //     if (!res.authSetting['scope.userLocation']) {
    //       wx.authorize({
    //         scope: 'scope.userLocation',
    //         success () {
    //           wx.startRecord()
    //         }
    //       })
    //     }
    //   }
    // })
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      name:options.name,
      userInfo
    })
    wx.getSetting({
      success(res) {
        if(!res.authSetting["scope.userLocation"]) {
          // 没有权限则通过 wx.authorize 授权
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              _this.getLotion()
            },fail: (res) => {
              _this.setData({
                isOpenLocationAuth: 3, // 定位失败
              })
            }
          })
        }else {
          _this.getLotion()
        }
      }
    })
    return false;
    
  },
  hqTap(e) {
    let _this = this;
    wx.authorize({
      scope: 'scope.userLocation',
      success(res) {
        _this.getLotion()
      },fail: (res) => {
        _this.setData({
          isOpenLocationAuth: 3, // 定位失败
        })
      }
    })
  },
  getLotion() {
    clearInterval(timer);
    let _this = this;
    wx.getLocation({
      type:'gcj02',
      success(res) {
        console.log(res)
        let arr = [
          {
            latitude:res.latitude,
            longitude:res.longitude,
            width:20,
            height:30,
            label:{
              content:_this.data.userInfo.nickName,
              color:'#2963E0',
              borderRadius:20,
              padding:5,
              bgColor:"#fff",
              anchorX:-30,
              fontSize:10
            }
          }
        ]
        _this.setData({
          // mLat:res.latitude,
          // mLong:res.longitude,
          marker:arr,
          isOpenLocationAuth:1
        })
        _this.getPosition(res.latitude,res.longitude)
      },
      fail(res) {
      }
    })
  },
  // 获取班车定位
  getPosition(lat,long) {
    let arr = this.data.marker;
    http(url.getOneBcLocation + this.data.name,{},(res)=>{
      if(res.length != 0) {
        // wx.chooseLocation({
        //   latitude:res[0].latt,
        //   longitude:res[0].longt
        // })
        arr.push({
            latitude:res[0].latt,
            longitude:res[0].longt,
            iconPath:'/images/car.png',
            width:43,
            height:19,
            // title:res[0].name
            label:{
              content:res[0].name,
              color:'#2963E0',
              borderRadius:20,
              padding:5,
              bgColor:"#fff",
              anchorX:-30,
              fontSize:10
            }
          })
        
        this.setData({
          marker:arr,
          name:res[0].name,
          mLat:res[0].latt,
          mLong:res[0].longt,
        })
        timer = setInterval(()=>{
          this.getLotion();
        },3000)
      }else {
        this.setData({
          mLat:lat,
          mLong:long,
        })
        app.showError('暂无该车辆位置');
        return false;
      }
    },'GET','',false)
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
    clearInterval(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer);
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