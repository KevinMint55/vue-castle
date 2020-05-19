import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
});

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: () => import('../views/login/index.vue'),
      meta: { title: '登录' },
    },
    {
      path: '/register',
      component: () => import('../views/register/index.vue'),
      meta: { title: '注册' },
    },
    {
      path: '/list',
      component: () => import('../views/list/index.vue'),
      meta: { title: '项目列表' },
    },
    {
      name: 'tables',
      path: '/tables/:pId',
      component: () => import('../views/tables/index.vue'),
      meta: { title: '表格内容' },
      children: [
        {
          name: 'view',
          path: 'views/:vId',
          component: () => import('../views/tables/views/index.vue'),
          meta: { title: '项目视图' },
        },
      ],
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '*',
      component: () => import('../views/404/index.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach((to) => {
  NProgress.done();
  if (to.meta.title) {
    document.title = `Castle-${to.meta.title}`;
  } else {
    document.title = 'Castle';
  }
});

export default router;
