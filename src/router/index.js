import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('../views/index.vue'),
    },
    {
      path: '/info',
      component: () => import('../views/info/index.vue'),
    },
    {
      path: '/action',
      component: () => import('../views/action/index.vue'),
    },
  ],
});
