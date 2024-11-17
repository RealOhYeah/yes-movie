import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/member',
      name: 'member',
      component: () => import('@/views/member/MemberView.vue')
    },
    {
      path: '/tv',
      name: 'tv',
      component: () => import('@/views/video/TvView.vue')
    },
    {
      path: '/tv/:id',
      name: 'tvDetail',
      component: () => import('@/views/video/TvDetail.vue')
    },
    {
      path: '/movie',
      name: 'movie',
      component: () => import('@/views/video/MovieView.vue')
    },
    {
      path: '/free',
      name: 'free',
      component: () => import('@/views/special/FreeView.vue')
    },
    {
      path: '/short',
      name: 'short',
      component: () => import('@/views/video/ShortVideoView.vue')
    },
    {
      path: '/variety',
      name: 'variety',
      component: () => import('@/views/channel/VarietyView.vue')
    },
    {
      path: '/anime',
      name: 'anime',
      component: () => import('@/views/channel/AnimeView.vue')
    },
    {
      path: '/documentary',
      name: 'documentary',
      component: () => import('@/views/channel/DocumentaryView.vue')
    },
    {
      path: '/children',
      name: 'children',
      component: () => import('@/views/channel/ChildrenView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/error/NotFound.vue')
    }
  ]
})

export default router
