import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './style/reset.less';
import './core';
import './assets/iconfont/iconfont.css';

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
