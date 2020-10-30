module.exports = function (url, data, fun, method='POST',header){
    data={
      ...data
    }
    const App = getApp();
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    })
    header = header == 'json'?'application/json':'application/x-www-form-urlencoded'
    wx.request({
      url: url,
      data:data,
      method: method,
      header: {
        "X-Requested-With":"WXCHART",
        "Cookie": wx.getStorageSync('cookie'),
        "Content-Type": header,
      },
      dataType: "json",
      success: function (e) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (e.statusCode !== 200 || typeof e.data !== 'object') {
         App.showError('网络请求出错');
          return false;
        }
        if (e.data.code == 500) {
          App.showError(e.data.msg);
          return false;
        }
        if (e.data.code == 403) {
          // let pages = getCurrentPages() // 获取加载的页面
          // let currentPage = pages[pages.length - 1]
          // wx.setStorageSync('page', currentPage.route)
          if(wx.getStorageSync('userInfo').wxOpenId) {
            App.loginMini();
          }else {
            App.showError(e.data.msg,()=>{
              wx.navigateTo({
                url: '/pages/login/login',
              })
            });
          }
          return false;
        }
        return "function" == typeof fun && fun(e.data);
      },
      fail: function (e) {
        wx.hideNavigationBarLoading();
        wx.hideLoading()
        return "function" == typeof fun && fun(!1);
      }
    })
  }