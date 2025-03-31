<template>
  <div ref="dropdownRef" class="dropdown position-relative">
    <button class="btn dropdown-toggle" :class="buttonClass" type="button" @click="toggleDropdown">
      <slot name="button-content"></slot>
    </button>
    <ul v-if="isVisible" class="dropdown-menu show">
      <slot></slot>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  buttonClass: { type: String, default: '' },
})

const isVisible = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isVisible.value = !isVisible.value
}

const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

defineExpose({
  toggleDropdown,
})
</script>

<style scoped>
.dropdown-menu {
  font-size: 0.9em;
  min-width: 200px;
  max-height: 250px;
  overflow-y: auto;
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  z-index: 10;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-menu.show {
  display: block;
}

.dropdown > button {
  font-size: 1em;
}
</style>
