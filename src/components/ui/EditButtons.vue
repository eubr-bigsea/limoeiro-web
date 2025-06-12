<template>
  <div class="col-12">
    <button
      type="submit"
      class="btn btn-success btn-sm me-1 px-4"
      :disabled="saveDisabled"
      @click="emit('save')"
    >
      <LucideSave size="16px" />
      Salvar
    </button>
    <router-link class="btn btn-secondary btn-sm px-4" :to="cancelRoute"> Cancelar </router-link>
  </div>
</template>
<script setup>
import { LucideSave } from 'lucide-vue-next'
const props = defineProps({
  saveDisabled: { type: Boolean, default: false },
  cancelRoute: { type: Object, required: true },
})
const emit = defineEmits(['save'])
</script>
