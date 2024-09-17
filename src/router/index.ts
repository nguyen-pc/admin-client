import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
      // meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/',
          name: 'user',
          component: () => import('../views/auth/UserView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/borrow',
          name: 'borrow',
          children: [
            {
              path: '',
              name: 'allborrow',
              component: () => import('../views/borrow/BorrowView.vue')
            }
          ]
        },
        {
          path: '/users',
          name: 'users',
          // meta: { requiresAuth: true },
          children: [
            { path: '', name: 'authUser', component: () => import('../views/user/UserView.vue') },
            {
              path: 'create',
              name: 'authUser:create',
              component: () => import('../views/user/UserCreate.vue')
            },
            {
              path: ':id',
              name: 'authUser:edit',
              component: () => import('../views/user/UserCreate.vue')
            }
          ]
        },
        {
          path: 'books',
          children: [
            { path: '', name: 'book', component: () => import('../views/bookview/BookView.vue') },
            {
              path: 'create',
              name: 'book:create',
              component: () => import('../views/bookview/BookCreate.vue')
            },
            {
              path: ':id',
              name: 'book:edit',
              component: () => import('../views/bookview/BookCreate.vue')
            }
          ]
        },
        {
          path: 'author',
          children: [
            { path: '', name: 'author', component: () => import('../views/author/AuthorView.vue') },
            {
              path: 'create',
              name: 'author:create',
              component: () => import('../views/author/AuthorCreate.vue')
            },
            {
              path: ':id',
              name: 'author:edit',
              component: () => import('../views/author/AuthorCreate.vue')
            }
          ]
        },
        {
          path: 'publisher',
          children: [
            {
              path: '',
              name: 'publisher',
              component: () => import('../views/publisher/PublisherView.vue')
            },
            {
              path: 'create',
              name: 'publisher:create',
              component: () => import('../views/publisher/PublisherCreate.vue')
            },
            {
              path: ':id',
              name: 'publisher:edit',
              component: () => import('../views/publisher/PublisherCreate.vue')
            }
          ]
        }
      ]
    },

    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },

    {
      path: '/:pathMath(.*)',
      name: 'notfound',
      component: () => import('../views/NotFoundView.vue')
    }
    // {
    //   path: '/user',
    //   name: 'user',
    //   component: () => import('../views/auth/UserView.vue'),
    //   meta: { requiresAuth: true }
    // }
  ]
})

router.beforeResolve(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'home' })
  } else {
    return next()
  }
})

export default router
