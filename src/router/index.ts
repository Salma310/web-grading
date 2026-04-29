import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Ecommerce2',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'Dashboard',
      },
    },
    {
      path: '/batchpage',
      name: 'Batch Page',
      component: () => import('../views/BatchPage.vue'),
      meta: {
        title: 'Batch Page',
      },
    },
     {
      path: '/gradingdata',
      name: 'Grading Data',
      component: () => import('../views/GradingData.vue'),
      meta: {
        title: 'Grading Data',
      },
    },
    {
      path: '/qr',
      name: 'QR Print',
      component: () => import('../views/QRPrint.vue'), // Pastikan file ini ada di folder views
      meta: {
        title: 'QR Print',
        requiresAuth: true, // Tambahkan jika hanya user login yang boleh akses
      },
    },
    {
      path: '/farmer',
      name: 'Farmer Data',
      component: () => import('../views/FarmerList.vue'),
      meta: {
        title: 'Farmer Data',
      },
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
  // {
  //   path: '/batches/add',
  //   name: 'BatchAdd',
  //   component: () => import('../views/BatchListPage.vue'),
  //   meta: { requiresAuth: true },
  // },
  {
    path: '/batches/:id',
    name: 'BatchDetail',
    component: () => import('../views/BatchDetailPage.vue'),
    meta: { requiresAuth: true },
  },
    //     {
    //   path: '/batchpage',
    //   name: 'Batch Page',
    //   component: () => import('../views/BatchPage.vue'),
    // },
    {
      path: '/batches/add',
      name: 'Add Batch',
      component: () => import('../views/AddBatchPage.vue'),
      meta: {
        title: 'Add Batch',
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
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
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Bumiaji Sejahtera ${to.meta.title} | Grading System`
  next()
})
