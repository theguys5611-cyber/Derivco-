import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
  { path: '/auth', name: 'Auth', component: () => import('../views/AuthView.vue') },
  { path: '/feed', name: 'Feed', component: () => import('../views/FeedView.vue') },
  { path: '/projects/new', name: 'NewProject', component: () => import('../views/NewProjectView.vue'), meta: { requiresAuth: true } },
  { path: '/projects/:id', name: 'ProjectDetail', component: () => import('../views/ProjectDetailView.vue') },
  { path: '/projects/:id/edit', name: 'EditProject', component: () => import('../views/EditProjectView.vue'), meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'Dashboard', component: () => import('../views/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/celebration', name: 'CelebrationWall', component: () => import('../views/CelebrationWallView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.user) {
    next({ name: 'Auth', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
