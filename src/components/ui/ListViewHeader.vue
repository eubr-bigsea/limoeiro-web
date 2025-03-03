<template>
  <div class="d-flex justify-content-between my-2 border-top border-bottom py-1">
    <h2>{{ title }}</h2>
    <div class="d-flex align-items-center">
      <button class="btn btn-sm btn-primary" @click="emit('add')">Adicionar <plus /></button>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
import { Plus } from 'lucide-vue-next'

const props = defineProps({
  title: { required: true, type: String },
})
const emit = defineEmits(['add'])
</script>
