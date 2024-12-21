import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      meta: { breadcrumb: '404 | Not Found' },
      component: () => import('../views/NotFound.vue'),
    },
    {
      path: '/',
      name: 'dashboard',
      meta: { breadcrumb: 'Dashboard' },
      component: () => import('../views/AppDashboard.vue'),
    },
    {
      path: '/transactions',
      name: 'transactions',
      meta: { breadcrumb: 'Transactions' },
      children: [
        {
          path: 'new',
          name: 'new-transaction',
          meta: { breadcrumb: 'New Transaction' },
          component: () => import('../views/AppNewTransaction.vue'),
        },
      ],
      component: () => import('../views/AppTransactions.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      meta: { breadcrumb: 'Settings' },
      component: () => import('../views/AppSettings.vue'),
    },
  ],
})

export default router
