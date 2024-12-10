<!-- Layout.vue -->
<template>
  <main class="d-flex vh-100">
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
.main-content {
  max-height: calc(100vh - 55px);
  overflow: auto;
  overflow-x: hidden;
}
main {
  /* background: red; */
  /* overflow: hidden; */
}
</style>
