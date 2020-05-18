/**
 * [utils]
 * @author Kevin on 2018/05/16.
 */

import $projectConfig from '$projectConfig';

// 工具类方法
export const regExp = (p, t = 'mp') => {
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
};

export const setCdn = {
  methods: {
    setCdn(url) {
      if (url) {
        return `${$projectConfig.cdnURL}${url}`;
      }
      return '';
    },
  },
};

// 数据加载中全屏动画
export const loadInFull = (t = '正在加载...') => {
  if (window.load) {
    return;
  }
  window.load = document.createElement('div');
  window.load.className = 'load-block';
  window.load.innerHTML = `<div class="load"><i></i><span>${t}</span></div>`;
  document.body.appendChild(window.load);
};

// 数据加载中动画类zeplin
export const loadIn = () => {
  if (window.load) {
    return;
  }
  window.load = document.createElement('div');
  window.load.id = 'loading';
  window.load.innerHTML = '<div class="ripple ripple1"></div>'
    + '<div class="ripple ripple2"></div>'
    + '<div class="ripple ripple3"></div>'
    + '<div class="ripple ripple4"></div>';
  document.body.appendChild(window.load);
};

// 移除加载中动画
export const loadOut = () => {
  if (!window.load) {
    return;
  }
  window.load.classList.add('fade-out');
  setTimeout(() => {
    if (window.load) {
      document.body.removeChild(window.load);
    }
    window.load = undefined;
  }, 250);
};

// toast弹框
export const toast = (t, fn) => {
  if (window.tip) {
    return;
  }
  window.tip = document.createElement('div');
  window.tip.className = 'toast-block';
  window.tip.innerHTML = `<div class="toast"><p>${t}</p></div>`;
  document.body.appendChild(window.tip);
  setTimeout(() => {
    if (!window.tip) {
      return;
    }
    window.tip.classList.add('fade-out');
    setTimeout(() => {
      try {
        document.body.removeChild(window.tip);
      } catch (e) {
        console.log(e);
      } finally {
        window.tip = undefined;
      }
      if (fn) {
        fn();
      }
    }, 350);
  }, 2000);
};
