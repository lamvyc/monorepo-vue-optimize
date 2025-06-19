import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/optimization/memo',
    component: () => import('@vue-monorepo/optimization-perf-memo/src/App.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
}) 