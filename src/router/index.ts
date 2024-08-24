import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/shootfox',
      name: 'Shootfox',
      component: () => import('../views/ShootfoxView.vue')
    },
    {
      path: '/breakout',
      name: 'breakout',
      component: () => import('../views/BreakoutView.vue')
    },
    {
      path: '/analyzer',
      name: 'analyzer',
      component: () => import('../views/AudioView.vue')
    },
    {
      path: '/gameboard',
      name: 'gameboard',
      component: () => import('../views/GameBoardView.vue')
    },
    {
      path: '/sandbox',
      name: 'sandbox',
      component: () => import('../views/VRSandboxView.vue')
    },
  ]
})

export default router
