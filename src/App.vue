<template>
  <main class="d-flex main-content-area">
    <!-- Sidebar - Mostrar apenas se não for rota de login/auth -->
    <side-bar v-if="!isAuthRoute" />
    
    <!-- Main Content Area -->
    <div class="d-flex flex-column flex-grow-1">
      <main-toolbar v-if="!isAuthRoute" />
      
      <!-- Main Content -->
      <div class="main-content pt-3">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import MainToolbar from '@/components/MainToolbar.vue'

const route = useRoute()

const isAuthRoute = computed(() => {
  return route.path.startsWith('/login') || route.path.startsWith('/auth')
})
</script>

<style scoped>
.main-content-area {
  xoverflow: hidden;
}
</style>