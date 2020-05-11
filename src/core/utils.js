/**
 * [utils]
 * @author Kevin on 2018/05/16.
 */

const cdnURL = '';

// 工具类方法
export default {
  regExp: (p, t = 'mp') => {
    let s;
    switch (t) {
      case 'mp':
        s = /^1[3,4,5,7,8]{1}[0-9]{9}$/.test(p);
        // 验证手机号格式
        break;
      case 'em':
        s = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(p);
        // 验证email格式
        break;
      case 'qq':
        s = /^[1-9]{1}[0-9]{5,11}$/.test(p);
        // 验证qq号格式
        break;
      case 'wx':
        s = /^[a-zA-Z\d_]{5,}$/.test(p);
        // 验证微信号格式
        break;
      case 'pw':
        s = /^\w{6,16}$/.test(p);
        // 校验6-16位数字+英文密码+下划线
        break;
      default:
        s = true;
        break;
    }
    return s;
  },

};

export const setCdn = {
  methods: {
    setCdn(url) {
      if (url) {
        return `${cdnURL}${url}`;
      }
      return '';
    },
  },
};
