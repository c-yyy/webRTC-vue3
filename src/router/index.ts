import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "userManager" */'@/views/Home.vue')
  },
  {
    path: '/webRTC',
    name: 'WebRTC',
    component: () => import(/* webpackChunkName: "userManager" */'@/views/WebRTC.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export default router
