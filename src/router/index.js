import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ExploreView from '@/views/ExploreView.vue'
import DatabaseView from '@/views/DatabaseView.vue'
import SchemaView from '@/views/SchemaView.vue'
import TableView from '@/views/TableView.vue'
import IAModelView from '@/views/IAModelView.vue'
import DatabaseProviderView from '@/views/DatabaseProviderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Bem-vindo' },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'Sobre' },
    },
    {
      path: '/domains',
      name: 'domains',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/ListDomains.vue'),
      meta: { title: 'Domínios' },
    },
    {
      path: '/explore',
      name: 'explore',
      component: ExploreView,
      meta: { title: 'Explorar catálogo' },
      children: [
        {
          path: 'database-providers/:id',
          name: 'explore-database-providers',
          component: DatabaseProviderView,
          meta: { title: 'Provedores de dados' },
        },
        {
          path: 'databases/:id',
          name: 'explore-databases',
          component: DatabaseView,
          meta: { title: 'Bancos de dados' },
        },
        {
          path: 'schemas/:id',
          name: 'explore-schemas',
          component: SchemaView,
          meta: { title: 'Esquemas' },
        },
        {
          path: 'tables/:id',
          name: 'explore-tables',
          component: TableView,
          meta: { title: 'Tabelas' },
        },
        {
          path: 'ia-models/:id',
          name: 'explore-ia-models',
          component: IAModelView,
          meta: { title: 'Modelos de aprendizado de máquina' },
        },
      ],
    },
    {
      path: '/layers',
      name: 'layers',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/ListLayers.vue'),
      meta: { title: 'Camadas' },
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('@/views/ListTags.vue'),
      meta: { title: 'Tags' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const title = document.querySelector('h2')
  console.debug(title)
  document.title = to.meta.title + (title ? title.innerHTML : '')
  next()
})

router.afterEach((to, from, next) => {
  const title = document.querySelector('h2')
  console.debug(title)
})

export default router
