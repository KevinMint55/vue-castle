/**
 * [ajax config]
 * @author Kevin on 2018/05/16.
 */

import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import router from '../router';

// 配置接口地址
axios.defaults.baseURL = '';

// 配置超时时间
axios.defaults.timeout = 30e3;
// 配置请求头
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

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
const loadOut = () => {
  if (!window.load) {
    return;
  }
  window.load.classList.add('fade-out');
  setTimeout(() => {
    try {
      document.body.removeChild(window.load);
    } catch (e) {
      console.log(e);
    } finally {
      window.load = undefined;
    }
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

// 控制台输出内容
export const log = (content, title = 'res: ') => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${title}:`, content);
  }
};

// 添加请求拦截器
axios.interceptors.request.use((req) => {
  // 若是有做鉴权token , 就给头部带上token
  if (localStorage.userinfo) {
    const { token } = JSON.parse(localStorage.userinfo);
    req.headers.common.Authorization = `Bearer ${token}`;
  }
  return req;
}, (error) => Promise.reject(error));

// 添加响应拦截器
axios.interceptors.response.use((response) => {
  loadOut();
  const res = response.data;
  const { config } = response;
  if (res.status === 200) {
    log(res.data, config.url.replace(config.baseURL, ''));
    return res.data;
  }
  if (!config.noMessage) {
    Message.error(res.message);
    if (res.status === 4001) {
      setTimeout(() => {
        localStorage.clear();
        router.push({ path: '/login' });
      }, 2000);
    }
  }
  return Promise.reject(res);
}, (error) => {
  loadOut();
  log(error, 'err => ');
  Message.error(error.message);
  return Promise.reject(error);
});

export const get = (url, arg, config) => axios.get(arg ? `${url}?${qs.stringify(arg)}` : url, config);

export const post = (url, arg, config) => axios.post(url, qs.stringify(arg), config);

export const put = (url, arg, config) => axios.put(url, qs.stringify(arg), config);

export const del = (url, arg, config) => axios.delete(arg ? `${url}?${qs.stringify(arg)}` : url, config);

export const putForm = (url, arg, config) => {
  const formData = new FormData();
  if (arg) {
    Object.keys(arg).forEach((k) => formData.append(k, arg[k]));
  }
  return axios.put(url, formData, {
    'Content-Type': 'multipart/form-data',
    ...config,
  });
};

export const postForm = (url, arg, config) => {
  const formData = new FormData();
  if (arg) {
    Object.keys(arg).forEach((k) => formData.append(k, arg[k]));
  }
  return axios.post(url, formData, {
    'Content-Type': 'multipart/form-data',
    ...config,
  });
};

export const postBlob = (url, arg) => axios.post(url, arg, {
  responseType: 'blob',
});
