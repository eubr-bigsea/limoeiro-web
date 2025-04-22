import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ExploreView from '@/views/ExploreView.vue'
import DatabaseView from '@/views/DatabaseView.vue'
import SchemaView from '@/views/SchemaView.vue'
import TableView from '@/views/TableView.vue'
import IAModelView from '@/views/IAModelView.vue'
import DatabaseProviderView from '@/views/DatabaseProviderView.vue'
import EditIngestion from '@/views/EditIngestion.vue'
import AddDatabaseProvider from '@/views/AddDatabaseProvider.vue'
import ListExecution from '@/views/ListExecution.vue'

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
      path: '/domains/add',
      name: 'add-domain',
      component: () => import('@/views/EditDomain.vue'),
      meta: { title: 'Adicionar domínio' },
    },
    {
      path: '/domains/edit/:id',
      name: 'edit-domain',
      component: () => import('@/views/EditDomain.vue'),
      meta: { title: 'Editar domínio' },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
      meta: { title: 'Pesquisa de ativos' },
    },
    {
      path: '/explore',
      name: 'explore',
      component: ExploreView,
      meta: { title: 'Provedores de banco de dados' },
      children: [
        {
          path: 'database-providers/:id',
          name: 'explore-database-providers',
          component: DatabaseProviderView,
          meta: { title: 'Provedores de dados' },
        },
        {
          path: 'database-providers/add',
          name: 'add-database-provider',
          component: AddDatabaseProvider,
          meta: { title: 'Provedor de dados' },
        },
        {
          path: 'database-providers/:id/ingestions/:ingestionId',
          name: 'explore-database-providers-edit-ingestion',
          component: EditIngestion,
          meta: { title: 'Edição de ingestão de dados' },
          props: true,
        },
        {
          path: 'database-providers/:id/ingestions/',
          name: 'explore-database-providers-add-ingestion',
          component: EditIngestion,
          meta: { title: 'Nova de ingestão de dados' },
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
      path: '/executions',
      name: 'executions',
      component: ListExecution,
      meta: { title: 'Exibir execuções de ingestão de dados' },
      props: true,
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
      path: '/layers/add',
      name: 'add-layer',
      component: () => import('@/views/EditLayer.vue'),
      meta: { title: 'Adicionar camada' },
    },
    {
      path: '/layers/edit/:id',
      name: 'edit-layer',
      component: () => import('@/views/EditLayer.vue'),
      meta: { title: 'Editar camada' },
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('@/views/ListCompanies.vue'),
      meta: { title: 'Organizações' },
    },
    {
      path: '/companies/add',
      name: 'add-company',
      component: () => import('@/views/EditCompany.vue'),
      meta: { title: 'Adicionar organização' },
    },
    {
      path: '/companies/edit/:id',
      name: 'edit-company',
      component: () => import('@/views/EditCompany.vue'),
      meta: { title: 'Editar organização' },
    },
    {
      path: '/people',
      name: 'people',
      component: () => import('@/views/ListPeople.vue'),
      meta: { title: 'Pessoas' },
    },
    {
      path: '/people/add',
      name: 'add-person',
      component: () => import('@/views/EditPerson.vue'),
      meta: { title: 'Adicionar pessoa' },
    },
    {
      path: '/people/edit/:id',
      name: 'edit-person',
      component: () => import('@/views/EditPerson.vue'),
      meta: { title: 'Editar pessoa' },
    },

    {
      path: '/tags',
      name: 'tags',
      component: () => import('@/views/ListTags.vue'),
      meta: { title: 'Tags' },
    },
    {
      path: '/tags/add',
      name: 'add-tag',
      component: () => import('@/views/EditTag.vue'),
      meta: { title: 'Adicionar tag' },
    },
    {
      path: '/tags/edit/:id',
      name: 'edit-tag',
      component: () => import('@/views/EditTag.vue'),
      meta: { title: 'Editar tag' },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/ListUsers.vue'),
      meta: { title: 'Usuários' },
    },
    {
      path: '/users/add',
      name: 'add-user',
      component: () => import('@/views/EditUser.vue'),
      meta: { title: 'Adicionar usuário' },
    },
    {
      path: '/users/edit/:id',
      name: 'edit-user',
      component: () => import('@/views/EditUser.vue'),
      meta: { title: 'Editar usuário' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const title = document.querySelector('h2')
  document.title = to.meta.title + (title ? title.innerHTML : '')
  next()
})

// router.afterEach((to, from, next) => {
//   const title = document.querySelector('h2')
// })

export default router
