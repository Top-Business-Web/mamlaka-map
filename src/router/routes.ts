const routes = [
  {
    path: '',
    component: () => import('@/layouts/map.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/map/index.vue'),
        name: 'dashboard',
        children: []
      },
      {
        path: '/login',
        component: () => import('@/views/login/login.vue')
      }
    ]
  },
  {
    path: '/auth',
    meta: {
      guest: true
    },
    children: []
  },
];

export default routes;
