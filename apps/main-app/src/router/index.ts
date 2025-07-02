import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/memo',
      name: 'memo',
      component: () => import('./OptiPerfMemo.vue'),
    },
    {
      path: '/lazy-loading',
      name: 'lazy-loading',
      component: () => import('./LazyLoading.vue'),
    },
    {
      path: '/state-management',
      name: 'state-management',
      component: () => import('./StateManagement.vue'),
    },
    {
      path: '/resource-compression',
      name: 'resource-compression',
      component: () => import('./ResourceCompression.vue'),
    },
    {
      path: '/render-optimization',
      name: 'render-optimization',
      component: () => import('./RenderOptimization.vue'),
    },
  ],
});

export default router;
