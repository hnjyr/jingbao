module.exports = {
  post: function (url, data, fun, method='POST'){
    const App = getApp();
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    })
    data.openId = wx.getStorageSync('openId');
    let content = method == 'GET' ? 'application/x-www-form-urlencoded' :'application/json'
    if(data.page) {
      if(data.page == 1) {
        data.page = 1
      }else {
        data.page = Number(`${(data.page - 1) * data.limit}`)
      }
    }
    wx.request({
      url: url,
      data:data,
      method: method,
      header: {
        // "Content-Type": "application/json"
        "Content-Type": content
      },
      dataType: "json",
      success: function (e) {
        wx.hideNavigationBarLoading();
        wx.hideLoading()
        if (e.statusCode !== 200 || typeof e.data !== 'object') {
         App.showError('网络请求出错');
          return false;
        }
        if (e.data.status == 800) {
          App.showError(e.data.msg);
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
  },
}