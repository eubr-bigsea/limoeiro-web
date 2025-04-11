<template>
  <div class="offcanvas" :class="[position, { show }]" tabindex="-1" @click.self="emit('close')">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Mais Informações</h5>
      <button type="button" class="btn-close text-reset" @click="emit('close')"></button>
    </div>
    <div class="offcanvas-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  position: {
    type: String,
    default: 'offcanvas-end',
  },
})

const emit = defineEmits(['close'])
</script>

<style>
.offcanvas {
  position: fixed;
  top: 0;
  width: 300px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition:
    transform 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
}
.offcanvas.show {
  transform: translateX(0);
  visibility: visible;
}
.offcanvas-end {
  right: 0;
}
.offcanvas-start {
  left: 0;
  transform: translateX(-100%);
}
</style>
