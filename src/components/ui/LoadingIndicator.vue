<template>
  <div class="loading-container">
    <LucideLoader2 class="loading-icon" />
    <span class="loading-text">{{ message }}</span>
  </div>
</template>

<script setup>
import { LucideLoader2 } from 'lucide-vue-next'

defineProps({
  message: {
    type: String,
    default: 'Carregando...',
  },
})
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #555;
}

.loading-icon {
  animation: spin 1s linear infinite;
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
