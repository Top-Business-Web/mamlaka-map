const routes = [
  {
    path: '',
    component: () => import('@/layouts/app.vue'),
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '',
        component: () => import('@/views/index.vue'),
        name: 'dashboard',
        children: []
      },
    ]
  },
  {
    path: '/auth',
    meta: {
      guest: true
    },
    children: [
      // {
      //   path: 'login',
      //   component: () => import('@/pages/auth/Login.vue'),
      //   name: 'auth.login'
      // }
    ]
  },
  {
    path: '/map',
    component: () => import('@/layouts/map.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/map/index.vue'),
        name: 'dashboard.map',
        meta: {
          requireAuth: true
        },
        children: [],
      }
    ]
  }
];

export default routes;
