/**
 * 验证类
 */
module.exports = {

  /**
   * 是否为空
   */
  isEmpty(str) {
    return str !== '';
    // if(str !== '') {
    //   return str.trim() == '';
    // }else {
    //   return true;
    // }
  },

  /**
   * 匹配phone
   */
  isPhone(str) {
    let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
    return reg.test(str);
  },

  /**
   * 匹配身份证号
   */
  isIdno(str) {
    let reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    return reg.test(str);
  },

  /**
   * 匹配姓名
   */
  isName(str) {
    let reg = /^[\u4E00-\u9FA5]{2,4}$/;
    return reg.test(str);
  },
  /**
   * 匹配年龄
   */
  isAge(str) {
    let reg = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
    return reg.test(str);
  },

  /**
   * 匹配Email地址
   */
  isEmail(str) {
    if (str == null || str == "") return false;
    var result = str.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (result == null) return false;
    return true;
  },

  /**
   * 判断数值类型，包括整数和浮点数
   */
  isNumber(str) {
    if (isDouble(str) || isInteger(str)) return true;
    return false;
  },

  /**
   * 判断是否为正整数(只能输入数字[0-9])
   */
  isPositiveInteger(str) {
    return /(^[0-9]\d*$)/.test(str);
  },

  /**
   * 判断是否为正整数(只能输入数字[1-9])
   */
  isPositiveInteger1(str) {
    return /(^[1-9]\d*$)/.test(str);
  },

  /**
   * 匹配integer
   */
  isInteger(str) {
    if (str == null || str == "") return false;
    var result = str.match(/^[-\+]?\d+$/);
    if (result == null) return false;
    return true;
  },

  /**
   * 匹配double或float
   */
  isDouble(str) {
    if (str == null || str == "") return false;
    var result = str.match(/^[-\+]?\d+(\.\d+)?$/);
    if (result == null) return false;
    return true;
  },
  /**
   * 匹配金额
   */
  isPrice(str) {
    if (str == null || str == "") return false;
    var result = str.match(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/);
    if (result == null) return false;
    return true;
  },
};