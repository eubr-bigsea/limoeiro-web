<template>
  <div class="text-start">
    <button
      class="btn btn-sm btn-outline-secondary me-1 rounded-circle"
      title="Editar registro"
      @click="emit('edit', row)"
    >
      <pencil :size="16" />
    </button>
    <button
      class="btn btn-outline-danger btn-sm rounded-circle"
      title="Remover registro"
      @click="emit('delete', row)"
    >
      <trash2 :size="16" />
    </button>
  </div>
</template>
<script setup>
import { Pencil, Trash2 } from 'lucide-vue-next'
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  row: { required: true, type: Object },
})
const emit = defineEmits(['edit', 'delete'])
</script>
