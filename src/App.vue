<!-- Layout.vue -->
<template>
  <main class="d-flex main-content-area">
    <!-- Sidebar -->
    <side-bar />
    <!-- Main Content Area -->
    <div class="d-flex flex-column flex-grow-1">
      <main-toolbar />
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
import SideBar from '@/components/SideBar.vue'
import MainToolbar from '@/components/MainToolbar.vue'
</script>
<style scoped>
.main-content-area {
  xoverflow: hidden;
}
</style>
