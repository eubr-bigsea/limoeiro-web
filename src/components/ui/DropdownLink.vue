<template>
  <div class="dropstart" :class="{ show: isOpen }" ref="dropdown">
    <slot name="button" :toggle="toggle">
      {{ buttonText }}
    </slot>
    <ul
      class="dropdown-menu dropdown-menu-start"
      :class="{ show: isOpen }"
      @click="handleMenuClick"
    >
      <slot> </slot>
    </ul>
  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
const dropdown = ref(null)
const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}
const handleClickOutside = (event) => {
  if (isOpen.value && dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false
  }
}
const handleMenuClick = (event) => {
  if (event.target.tagName === 'A') {
    isOpen.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
