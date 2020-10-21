const url = 'http://122.51.69.116:8082/zhjb/', 
// const url = 'http://114.242.23.225:8086/zhjb/', 
g = {
  host:url,
  imgUrl:url + 'sys/attachment/open/download?attID=',
  login: url + 'sys/login',//登录
  repairrecordinfo:url+'logistics/apply/listMyApply',//维修记录
  appointment:url+'logistics/reserverecord/list',//预约记录
  orderTag:url + 'logistics/shopgoodseveryday/tomorrowOrderLable',//订餐标签
  ordering:url + 'logistics/shopgoodseveryday/list',//订餐列表
  saveForUser:url + 'logistics/shoporders/saveForUser',//结算（下单）
  shopgoodslabel:url + 'logistics/shopgoodslabel/list',//药店标签
  shopgoods:url + 'logistics/shopgoods/list',//药店列表
  listMyShop:url + 'logistics/shop/listMyShop',//班车列表
  manageTime:url + 'logistics/reservemanage/listResourceManageTime',//理发店预约详情-可预约资源 || 理疗预约
  saveRecord:url + 'logistics/reserverecord/saveRecord',//理发店预约 普通警员预约 理疗预约
  ydList:url + 'logistics/reserveresource/list',//运动场
  jyList:url + 'logistics/shop/list',//获取警营数据
  listLabelGoods:url + 'logistics/shopgoodslabel/listLabelGoods',//获取警营商品及标签
  sqSave:url + 'logistics/apply/save',//提交维修申请
  upload:url + 'sys/attachment/upload',//图片上传
  xiyiList:url + 'logistics/shopgoodslabel/list',//衣服标签接口
  saveWashRecord:url + 'logistics/reserverecord/saveWashRecord',//洗衣预约
  orderingList:url + 'logistics/shoporders/list',//订餐记录
  appnotice:url + 'app/appnotice/list',//公告  10分钟轮询一次 || 通知消息
  payQrcode:url + 'pay/purse/generatePayQrcode',//公告  10分钟轮询一次 || 通知消息
  updateByNoticeId:url + 'app/appnoticeuserlink/updateByNoticeId',//未读消息请求
  
} 
module.exports = g;