import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DashboardPage from '@/components/HomeView/DashboardPage.vue'
import AuthenticationPage from '@/components/HomeView/AuthenticationPage.vue'
import ConnectionPage from '@/components/HomeView/ConnectionPage.vue'
import MessagesPage from '@/components/HomeView/MessagesPage.vue'
import PostsView from '@/views/PostsView.vue'
import PostPage from '@/components/PostsView/PostPage.vue'
import ManagementPage from '@/components/PostsView/ManagementPage.vue'
import HelpView from '@/views/HelpView.vue'
import HelpTutorialPage from '@/components/HelpView/HelpTutorialPage.vue'
import HelpAuthenticationPage from '@/components/HelpView/HelpAuthenticationPage.vue'
import HelpConnectionPage from '@/components/HelpView/HelpConnectionPage.vue'
import HelpManualPage from '@/components/HelpView/HelpManualPage.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: { path: '/dashboard' },
    component: HomeView,
    children: [
      {
        path: '/dashboard',
        component: DashboardPage,
      },
      {
        path: '/authentication',
        component: AuthenticationPage,
      },
      {
        path: '/connection',
        component: ConnectionPage,
      },
      {
        path: '/messages',
        component: MessagesPage,
      },
    ],
  },
  {
    path: '/help',
    name: 'help',
    redirect: { path: '/help/tutorial' },
    component: HelpView,
    children: [
      {
        path: '/help/tutorial',
        component: HelpTutorialPage,
      },
      {
        path: '/help/authentication',
        component: HelpAuthenticationPage,
      },
      {
        path: '/help/connection',
        component: HelpConnectionPage,
      },
      {
        path: '/help/manual',
        component: HelpManualPage,
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/posts',
    redirect: { path: '/posts/manage' },
    component: PostsView,
    // 'manage' is matched before :post_uuid
    children: [
      {
        path: 'manage',
        component: ManagementPage,
      },
      {
        path: ':post_uuid',
        name: 'post_id',
        component: PostPage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
