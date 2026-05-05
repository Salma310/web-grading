import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated, getStoredUser, type UserRole } from '@/services/authService'

// ─────────────────────────────────────────
// Extend RouteMeta with custom fields
// ─────────────────────────────────────────
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    guestOnly?: boolean
    roles?: UserRole[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    // ─────────────────────────────────────────
    // PUBLIC ROUTES
    // ─────────────────────────────────────────
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: { title: 'Sign In', guestOnly: true },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: { title: 'Sign Up', guestOnly: true },
    },
    // {
    //   path: '/reset-password',
    //   name: 'ResetPassword',
    //   component: () => import('../views/Auth/ResetPassword.vue'),
    //   meta: { title: 'Reset Password', guestOnly: true },
    // },

    // ─────────────────────────────────────────
    // PROTECTED ROUTES
    // ─────────────────────────────────────────
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Ecommerce.vue'),
      meta: { title: 'Dashboard', requiresAuth: true },
    },
    {
      path: '/batchpage',
      name: 'Batch Page',
      component: () => import('../views/BatchPage.vue'),
      meta: { title: 'Batch Page', requiresAuth: true },
    },
    {
      path: '/gradingdata',
      name: 'Grading Data',
      component: () => import('../views/GradingData.vue'),
      meta: { title: 'Grading Data', requiresAuth: true },
    },
    {
      path: '/qr',
      name: 'QR Print',
      component: () => import('../views/QRPrint.vue'),
      meta: { title: 'QR Print', requiresAuth: true },
    },
    {
      path: '/farmer',
      name: 'Farmer Data',
      component: () => import('../views/FarmerList.vue'),
      meta: { title: 'Farmer Data', requiresAuth: true },
    },
    {
      path: '/farmer/:id',
      name: 'Farmer Detail',
      component: () => import('../views/FarmerDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/batches',
      name: 'BatchList',
      component: () => import('../views/BatchListPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/batches/add',
      name: 'Add Batch',
      component: () => import('../views/AddBatchPage.vue'),
      meta: { title: 'Add Batch', requiresAuth: true },
    },
    {
      path: '/batches/:id',
      name: 'BatchDetail',
      component: () => import('../views/BatchDetailPage.vue'),
      meta: { requiresAuth: true },
    },

    // ─────────────────────────────────────────
    // ROLE-BASED ROUTES
    // ─────────────────────────────────────────
    // {
    //   path: '/users',
    //   name: 'User Management',
    //   component: () => import('../views/UserManagement.vue'),
    //   meta: { title: 'User Management', requiresAuth: true, roles: ['ADMIN'] },
    // },

    // ─────────────────────────────────────────
    // OTHERS
    // ─────────────────────────────────────────
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: { title: 'Calendar', requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: { title: 'Profile', requiresAuth: true },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: { title: 'Form Elements' },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: { title: 'Basic Tables' },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
      meta: { title: 'Line Chart' 
    }
  },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: { title: 'Alerts' },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: { title: 'Avatars' },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: { title: 'Badge' },
    },
    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: { title: 'Buttons' },
    },
    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: { title: 'Images' },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: { title: 'Videos' },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: { title: 'Blank' },
    },
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: { title: '404 Error' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error-404',
    },
  ],
})

// ─────────────────────────────────────────
// Navigation Guard
// ─────────────────────────────────────────
router.beforeEach((to, _from, next) => {
  document.title = `Bumiaji Sejahtera ${to.meta.title ?? ''} | Grading System`

  const loggedIn = isAuthenticated()

  // Route hanya untuk guest (belum login)
  if (to.meta.guestOnly && loggedIn) {
    return next('/')
  }

  // Route butuh auth
  if (to.meta.requiresAuth && !loggedIn) {
    return next({ path: '/signin', query: { redirect: to.fullPath } })
  }

  // Role-based guard
  if (to.meta.roles) {
    const user = getStoredUser()
    if (!user || !to.meta.roles.includes(user.role)) {
      return next('/error-404')
    }
  }

  next()
})

export default router