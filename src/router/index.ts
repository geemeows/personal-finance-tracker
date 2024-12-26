import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      meta: { layout: AppLayout, breadcrumb: '404 | Not Found' },
      component: () => import('../views/NotFound.vue'),
    },
    {
      path: '/new-account',
      name: 'new-account',
      component: () => import('../views/AppCreateAccount.vue'),
    },
    {
      path: '/',
      name: 'dashboard',
      meta: { layout: AppLayout, breadcrumb: 'Dashboard' },
      component: () => import('../views/AppDashboard.vue'),
    },
    {
      path: '/transactions',
      name: 'transactions',
      meta: { layout: AppLayout, breadcrumb: 'Transactions' },
      component: () => import('../views/AppTransactions.vue'),
    },
    {
      path: '/transactions/new',
      name: 'new-transaction',
      meta: { layout: AppLayout, breadcrumb: 'New Transaction' },
      component: () => import('../views/AppNewTransaction.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      meta: { layout: AppLayout, breadcrumb: 'Settings' },
      component: () => import('../views/AppSettings.vue'),
    },
  ],
})

export default router
