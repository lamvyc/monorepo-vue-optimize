import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/memo',
      name: 'memo',
      component: () => import('./OptiPerfMemo.vue')
    },
    {
      path: '/lazy-loading',
      name: 'lazy-loading',
      component: () => import('./LazyLoading.vue')
    }
  ]
})

export default router 