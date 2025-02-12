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
    ]
  },
  {
    path: '/auth',
    meta: {
      guest: true
    },
    children: []
  },
  // {
  //   path: '/map',
  //   component: () => import('@/layouts/map.vue'),
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('@/views/map/index.vue'),
  //       name: 'dashboard.map',
  //       children: [],
  //     }
  //   ]
  // }
];

export default routes;
