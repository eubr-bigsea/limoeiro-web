<template>
  <div
    class="sidebar bg-lemonade pt-3 vh-100"
    :class="{ 'sidebar-collapsed': isCollapsed }"
    @mouseenter="expandSidebar"
    @mouseleave="collapseSidebar"
    @click="collapseSidebar"
  >
    <div class="d-flex sidebar-content flex-column vh-100">
      <ul class="nav flex-column mt-none">
        <li class="nav-item">
          <router-link
            :to="{ name: 'explore' }"
            class="nav-link text-white text-nowrap active"
            aria-label="Navegue pelo catálogo de dados e de modelos"
            aria-current-value="page"
          >
            <div class="icon-wrapper">
              <telescope-icon class="sidebar-icon" aria-labelledby="explore" />
            </div>
            <span id="explore" class="menu-text">Explorar catálogo</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            :to="{ name: 'people' }"
            class="nav-link text-white text-nowrap active"
            aria-label="Listar e gerenciar pessoas"
            aria-current-value="page"
          >
            <div class="icon-wrapper">
              <LucideContact2 class="sidebar-icon" />
            </div>
            <span class="menu-text">Pessoas</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'companies' }"
            class="nav-link text-white text-nowrap active"
            aria-label="Listar e gerenciar organizações"
            aria-current-value="page"
          >
            <div class="icon-wrapper">
              <LucideBuilding class="sidebar-icon" />
            </div>
            <span class="menu-text">Organizações</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'domains' }"
            class="nav-link text-white text-nowrap active"
            aria-label="Listar e gerenciar domínios"
            aria-current-value="page"
          >
            <div class="icon-wrapper">
              <LucideLaptopMinimal class="sidebar-icon" />
            </div>
            <span class="menu-text">Sistemas</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'domains' }"
            class="nav-link text-white text-nowrap active"
            aria-label="Listar e gerenciar domínios"
            aria-current-value="page"
          >
            <div class="icon-wrapper">
              <Crown class="sidebar-icon" />
            </div>
            <span class="menu-text">Domínios</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'layers' }"
            class="nav-link text-white text-nowrap active"
            aria-label="Listar e gerenciar camadas"
            aria-current-value="page"
          >
            <div class="icon-wrapper">
              <Layers class="sidebar-icon" />
            </div>
            <span class="menu-text">Camadas</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'tags' }"
            class="nav-link text-white text-nowrap active"
            aria-label="Listar e gerenciar tags"
          >
            <div class="icon-wrapper">
              <Tags class="sidebar-icon" />
            </div>
            <span class="menu-text">Marcadores (Tags)</span>
          </router-link>
        </li>
      </ul>
      <ul class="nav flex-column border-top mb-5">
        <li class="nav-item">
          <router-link
            :to="{ name: 'search' }"
            class="nav-link text-white text-nowrap active"
            aria-label="Pesquisar ativos"
          >
            <div class="icon-wrapper">
              <LucideSearch class="sidebar-icon" />
            </div>
            <span class="menu-text">Pesquisar ativos</span>
          </router-link>
        </li>
      </ul>

      <li class="nav-item">
        <button
          class="nav-link text-white text-nowrap bg-transparent border-0"
          aria-label="Chamar endpoint seguro"
          @click="fetchData"
        >
          <div class="icon-wrapper">
            <LockIcon class="sidebar-icon" />
          </div>
          <span class="menu-text">Secure Endpoint</span>
        </button>
      </li>
     
      <ul class="nav flex-column mt-auto border-top mb-5">
        <li class="nav-item">
          <router-link
            :to="{ name: 'users' }"
            class="nav-link text-white text-nowrap active"
            aria-label="Listar e gerenciar usuários"
          >
            <div class="icon-wrapper">
              <LucideUsers class="sidebar-icon" />
            </div>
            <span class="menu-text">Usuários</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'roles' }"
            class="nav-link text-white text-nowrap active"
            aria-label="Listar e gerenciar grupos"
          >
            <div class="icon-wrapper">
              <Award class="sidebar-icon" />
            </div>
            <span class="menu-text">Grupos</span>
          </router-link>
        </li>
        <!--
        <li class="nav-item">
          <a class="nav-link text-white" href="#" aria-label="Editar configurações">
            <div class="icon-wrapper">
              <Settings class="sidebar-icon" />
            </div>
            <span class="menu-text">Configurações</span>
          </a>
        </li>
      -->
        <li class="nav-item">
          <a class="nav-link text-white" @click="authService.logout" aria-label="Sair, encerrando a sessão do usuário">
            <div class="icon-wrapper">
              <log-out class="sidebar-icon" />
            </div>
            <span class="menu-text">Sair</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
  <template> </template>
</template>
<script setup>
import {
  Award,
  Users,
  Settings,
  TelescopeIcon,
  LogOut,
  Group,
  BriefcaseBusiness,
  Crown,
  Layers2,
  Tags,
  LucideSquareUser,
  LucideBuilding,
  LucideLaptopMinimal,
  Layers,
  LucideContact2,
  LucideUsers,
  LucideSearch,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth';
import { useFetch } from '@/composables/useFetch'


const emit = defineEmits(['expandSidebar', 'collapseSidebar'])
const isCollapsed = ref(true)

const { data, error, isLoading, fetchData } = useFetch('/collector/secure-endpoint')

const expandSidebar = () => {
  isCollapsed.value = false
}

const collapseSidebar = () => {
  isCollapsed.value = true
}

const router = useRouter()

const currentRoute = ref(router.currentRoute.value.name)
</script>
<style scoped>
.router-link-active {
  xbackground: #8f599e;
  xbackground: #445f7f;
  background-color: #235c00;
  margin: 0;
}
a.nav-link:hover {
  background-color: #235c00;
  margin: 0;
}
.sidebar {
  min-height: 100vh;
  transition: all 0.3s ease;
  width: 250px;
  position: fixed;
  height: 100%;
  z-index: 1000;
}

.sidebar-collapsed {
  width: 60px;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 30px;
  height: 30px;
}

.sidebar-icon {
  width: 28px;
  height: 28px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  gap: 1rem;
  padding-left: 14px;
}

.sidebar-collapsed .nav-link {
  justify-content: flex-start;
}

.sidebar-collapsed .menu-text {
  display: none;
}

.sidebar-content {
  padding-top: 4rem;
}
</style>
