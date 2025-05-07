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
import { authService } from '../services/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Bem-vindo', requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'Sobre', requiresAuth: true },
    },
    {
      path: '/domains',
      name: 'domains',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/ListDomains.vue'),
      meta: { title: 'Domínios', requiresAuth: true },
    },
    {
      path: '/domains/add',
      name: 'add-domain',
      component: () => import('@/views/EditDomain.vue'),
      meta: { title: 'Adicionar domínio', requiresAuth: true },
    },
    {
      path: '/domains/edit/:id',
      name: 'edit-domain',
      component: () => import('@/views/EditDomain.vue'),
      meta: { title: 'Editar domínio', requiresAuth: true },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
      meta: { title: 'Pesquisa de ativos', requiresAuth: true },
    },
    {
      path: '/explore',
      name: 'explore',
      component: ExploreView,
      meta: { title: 'Provedores de banco de dados', requiresAuth: true },
      children: [
        {
          path: 'database-providers/:id',
          name: 'explore-database-providers',
          component: DatabaseProviderView,
          meta: { title: 'Provedores de dados', requiresAuth: true },
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
          meta: { title: 'Edição de ingestão de dados', requiresAuth: true },
          props: true,
        },
        {
          path: 'database-providers/:id/ingestions/',
          name: 'explore-database-providers-add-ingestion',
          component: EditIngestion,
          meta: { title: 'Nova de ingestão de dados', requiresAuth: true },
        },

        {
          path: 'databases/:id',
          name: 'explore-databases',
          component: DatabaseView,
          meta: { title: 'Bancos de dados', requiresAuth: true },
        },
        {
          path: 'schemas/:id',
          name: 'explore-schemas',
          component: SchemaView,
          meta: { title: 'Esquemas', requiresAuth: true },
        },
        {
          path: 'tables/:id',
          name: 'explore-tables',
          component: TableView,
          meta: { title: 'Tabelas', requiresAuth: true },
        },
        {
          path: 'ia-models/:id',
          name: 'explore-ia-models',
          component: IAModelView,
          meta: { title: 'Modelos de aprendizado de máquina', requiresAuth: true },
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
      meta: { title: 'Camadas', requiresAuth: true },
    },
    {
      path: '/layers/add',
      name: 'add-layer',
      component: () => import('@/views/EditLayer.vue'),
      meta: { title: 'Adicionar camada', requiresAuth: true },
    },
    {
      path: '/layers/edit/:id',
      name: 'edit-layer',
      component: () => import('@/views/EditLayer.vue'),
      meta: { title: 'Editar camada', requiresAuth: true },
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('@/views/ListCompanies.vue'),
      meta: { title: 'Organizações', requiresAuth: true },
    },
    {
      path: '/companies/add',
      name: 'add-company',
      component: () => import('@/views/EditCompany.vue'),
      meta: { title: 'Adicionar organização', requiresAuth: true },
    },
    {
      path: '/companies/edit/:id',
      name: 'edit-company',
      component: () => import('@/views/EditCompany.vue'),
      meta: { title: 'Editar organização', requiresAuth: true },
    },
    {
      path: '/people',
      name: 'people',
      component: () => import('@/views/ListPeople.vue'),
      meta: { title: 'Pessoas', requiresAuth: true },
    },
    {
      path: '/people/add',
      name: 'add-person',
      component: () => import('@/views/EditPerson.vue'),
      meta: { title: 'Adicionar pessoa', requiresAuth: true },
    },
    {
      path: '/people/edit/:id',
      name: 'edit-person',
      component: () => import('@/views/EditPerson.vue'),
      meta: { title: 'Editar pessoa', requiresAuth: true },
    },

    {
      path: '/tags',
      name: 'tags',
      component: () => import('@/views/ListTags.vue'),
      meta: { title: 'Tags', requiresAuth: true },
    },
    {
      path: '/tags/add',
      name: 'add-tag',
      component: () => import('@/views/EditTag.vue'),
      meta: { title: 'Adicionar tag', requiresAuth: true },
    },
    {
      path: '/tags/edit/:id',
      name: 'edit-tag',
      component: () => import('@/views/EditTag.vue'),
      meta: { title: 'Editar tag', requiresAuth: true },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/ListUsers.vue'),
      meta: { title: 'Usuários', requiresAuth: true },
    },
    {
      path: '/users/add',
      name: 'add-user',
      component: () => import('@/views/EditUser.vue'),
      meta: { title: 'Adicionar usuário', requiresAuth: true },
    },
    {
      path: '/users/edit/:id',
      name: 'edit-user',
      component: () => import('@/views/EditUser.vue'),
      meta: { title: 'Editar usuário', requiresAuth: true },
    },
    {
<<<<<<< Updated upstream
      path: '/roles',
      name: 'roles',
      component: () => import('@/views/ListRoles.vue'),
      meta: { title: 'Grupos' },
    },
    {
      path: '/roles/add',
      name: 'add-role',
      component: () => import('@/views/EditRole.vue'),
      meta: { title: 'Adicionar grupo' },
    },
    {
      path: '/roles/add/:id',
      name: 'edit-role',
      component: () => import('@/views/EditRole.vue'),
      meta: { title: 'Editar grupo' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { title: 'Login'}
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/Auth.vue'),
      meta: { title: 'Login'}
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const title = document.querySelector('h2')
  document.title = to.meta.title + (title ? title.innerHTML : '') 

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = await authService.isAuthenticated();

    if (!isAuthenticated) {
      next({ name: 'auth' });
    } else {
      const user = await authService.getUser();
      localStorage.setItem('user', JSON.stringify(user.profile.name));      
      next();
    }
  } else {
    next();
  }
})

// router.afterEach((to, from, next) => {
//   const title = document.querySelector('h2')
// })

export default router
