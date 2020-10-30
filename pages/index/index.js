//index.js
//获取应用实例
const app = getApp()
const url = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({
  data: {
    navList:[
      {
        name:'餐厅',
        src:'../../images/home/home_ct.png',
        url:'/pages/list/order',
      },
      {
        name:'理发店',
        src:'../../images/home/home_lf.png',
        url:'/pages/haircut/haircut',
      },
      {
        name:'药店',
        src:'../../images/home/home_yd.png',
        url:'/pages/chemist/chemist',
      },
      {
        name:'班车',
        src:'../../images/home/home_bc.png',
        url:'/pages/vehicle/vehicle',
      },
      {
        name:'洗衣店',
        src:'../../images/home/home_xy.png',
        url:'/pages/laundry/laundry',
      },
      {
        name:'运动场',
        src:'../../images/home/home_ydc.png',
        url:'/pages/playground/index',
      },
      {
        name:'警营维修',
        src:'../../images/home/home_jy.png',
        url:'/pages/repair/repair',
      },
      {
        name:'理疗',
        src:'../../images/home/home_ll.png',
        url:'/pages/physio/physio',
      }
    ],
    record:[
      {
        name:'订餐记录',
        src:'../../images/admin/Ordermeal.png',
        url:'/pages/recordlist/dining?status=1',
      },
      {
        name:'维修记录',
        src:'../../images/admin/maintain.png',
        url:'/pages/recordlist/maintain?type=1',
      },
      {
        name:'预约记录',
        src:'../../images/admin/makeAppointment.png',
        url:'/pages/recordlist/maintain?type=2',
      },
      {
        name:'消费记录',
        src:'../../images/home/home_xf.png',
        url:'/pages/recordlist/dining?status=2',
      },
      {
        name:'消息通知',
        src:'../../images/admin/buydrug.png',
        url:'/pages/recordlist/consume',
      }
    ],
    declare:[
      {
        name:'办公用品申报',
        src:'/images/home/bangong.png',
        url:'',
      },
      {
        name:'用车管理申报',
        src:'/images/home/yongche.png',
        url:'',
      }
    ],
    lunboList:[],
    userInfo:''
  },
  onLoad: function () {
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
    })
  },
  onReady: function () {
    console.log();
    if(wx.getStorageSync('cookie')) {
      this.getLunboList();
    }else {
      setTimeout(()=>{
        this.getLunboList();
      },2000)
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  navTo(e){
    if(!e.currentTarget.dataset.url) {
      app.showError('功能正在开发，敬请期待！');
      return false;
    }
    if(e.currentTarget.dataset.url == '/pages/index/code') {
      app.getDyInfo(['rgp_p1GDSy1k-FuoSzdGIFxslcu2s436wpUlHnLiKU8'],()=>{
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        })
      })
    }else if(e.currentTarget.dataset.url == '/pages/haircut/haircut' && (this.data.userInfo.position ==1||2)){
      wx.navigateTo({
        url: '/pages/haircut/list',
      })
    }else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  getLunboList() {
    // 每十分钟查询一次
    http(url.appnotice,{
      activeState:'1',
      noticeType:'1',
      limit:'2',
      page:1
    },res=>{
      if(res.code == 0) {
        this.setData({
          lunboList:res.page.list
        })
      }
    })
  },
})
