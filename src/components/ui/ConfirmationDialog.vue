<template>
  <div v-if="isVisible" class="confirmation-dialog">
    <div class="dialog-overlay" @click="close" />
    <div class="dialog-content">
      <p><LucideMessageCircleQuestion size="48px" /> {{ message }}</p>
      <div class="dialog-actions">
        <button class="btn btn-sm me-3 btn-secondary" @click="close">Cancelar</button>
        <button class="btn btn-sm btn-warning" @click="confirm">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideMessageCircleQuestion } from 'lucide-vue-next'
import { ref, defineEmits, defineProps } from 'vue'

// Props: message to display in the dialog
const props = defineProps({
  message: {
    type: String,
    default: 'Are you sure?',
  },
})

// Emits: an event when confirmed
const emit = defineEmits(['confirmed'])

// State: visibility of the dialog
const isVisible = ref(false)

// Methods
const close = () => {
  isVisible.value = false
}

const show = () => {
  isVisible.value = true
}

const confirm = () => {
  emit('confirmed')
  close()
}
defineExpose({
  show,
})
</script>

<style scoped>
.confirmation-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  background: white;
  padding: 20px 40px;
  border-radius: 8px;
  text-align: center;
  z-index: 1001;
}
</style>
