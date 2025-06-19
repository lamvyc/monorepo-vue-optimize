import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/memo',
      name: 'memo',
      component: () => import('@vue-monorepo/optimization-perf-memo/src/App.vue')
    },
    {
      path: '/lazy-loading',
      name: 'lazy-loading',
      component: () => import('@vue-monorepo/lazy-loading/src/App.vue')
    }
  ]
})

export default router 