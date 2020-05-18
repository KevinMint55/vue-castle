/**
 * [ajax.js]
 * @author Kevin on 2020/05/13.
 */

import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import $projectConfig from '$projectConfig';
import router from '../router';
import { loadOut } from './utils';

// 配置接口地址
axios.defaults.baseURL = $projectConfig.apiBaseURL;

// 配置超时时间
axios.defaults.timeout = 30e3;
// 配置请求头
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

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
  Message.error(error.message);
  return Promise.reject(error);
});

export default {
  get: (url, arg, config) => axios.get(arg ? `${url}?${qs.stringify(arg)}` : url, config),
  post: (url, arg, config) => axios.post(url, qs.stringify(arg), config),
  put: (url, arg, config) => axios.put(url, qs.stringify(arg), config),
  del: (url, arg, config) => axios.delete(arg ? `${url}?${qs.stringify(arg)}` : url, config),
  putForm: (url, arg, config) => {
    const formData = new FormData();
    if (arg) {
      Object.keys(arg).forEach((k) => formData.append(k, arg[k]));
    }
    return axios.put(url, formData, {
      'Content-Type': 'multipart/form-data',
      ...config,
    });
  },
  postForm: (url, arg, config) => {
    const formData = new FormData();
    if (arg) {
      Object.keys(arg).forEach((k) => formData.append(k, arg[k]));
    }
    return axios.post(url, formData, {
      'Content-Type': 'multipart/form-data',
      ...config,
    });
  },
  postBlob: (url, arg) => axios.post(url, arg, {
    responseType: 'blob',
  }),
};
