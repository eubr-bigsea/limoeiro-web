<template>
  <div class="d-flex justify-content-between my-2">
    <h5>{{ title }}</h5>
    <button class="btn btn-sm btn-primary" @click="emit('add')">Adicionar <plus /></button>
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
