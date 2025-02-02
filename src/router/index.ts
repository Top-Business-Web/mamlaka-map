import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useAuthStore } from '@/stores/AuthStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...routes
    //  // Error pages
    // {
    //     path: "/error-page",
    //     name: "error-page",
    //     component: ErrorPage,
    // },
    // {
    //     path: "/:pathMatch(.*)*",
    //     component: ErrorPage,
    // },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  }
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // if (to.meta.requireAuth && to.name !== 'auth.login' && !authStore.isVerified) {
  //   return next({ name: 'auth.login' });
  // }

  // if (authStore.isVerified && !authStore.user) {
  //   try {
  //     await authStore.updateUserData()
  //   } catch (error) {
  //     console.error('Fetching user data error!')
  //   }
  // }

  // if (to.meta.guest && to.name !== 'auth.login' && !authStore.isAuthenticated) {
  //   return next({ name: 'auth.login' });
  // }

  // if (to.meta.guest && authStore.isAuthenticated) {
  //   if (authStore.isVerified && to.name !== 'front.index') {
  //     return next({ name: 'front.index' });
  //   }

  //   // if (to.name !== 'auth.otp') {
  //   //   return next({ name: 'auth.otp' });
  //   // }
  // }

  return next();
});

export default router;
