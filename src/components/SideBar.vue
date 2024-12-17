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
              <telescope-icon class="sidebar-icon" />
            </div>
            <span class="menu-text">Explorar catálogo</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'about' }"
            class="nav-link text-white text-nowrap active"
            aria-label="Exiba a lista de usuários"
            aria-current-value="page"
          >
            <div class="icon-wrapper">
              <Users class="sidebar-icon" />
            </div>
            <span class="menu-text">Users</span>
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
              <Layers2 class="sidebar-icon" />
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
      <ul class="nav flex-column mt-auto border-top mb-5">
        <li class="nav-item">
          <a class="nav-link text-white" href="#" aria-label="Editar configurações">
            <div class="icon-wrapper">
              <Settings class="sidebar-icon" />
            </div>
            <span class="menu-text">Settings</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-white" href="#" aria-label="Sair, encerrando a sessão do usuário">
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
  Users,
  Settings,
  TelescopeIcon,
  LogOut,
  Group,
  BriefcaseBusiness,
  Crown,
  Layers2,
  Tags,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['expandSidebar', 'collapseSidebar'])
const isCollapsed = ref(true)

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
  background: #445f7f;
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
