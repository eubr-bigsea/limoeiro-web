<template>
  <div class="text-muted fs-5" title="Informação recuperada dos metadados">
    {{ notes }}
  </div>
  <div class="d-flex gap-2">
    <div class="w-40 p-2">
      Domínio
      <LucideCrown size="15px" fill="gold" stroke="#888" />
      <domain-selector title="Domínio" v-model="editDomain" missing="<nenhum domínio>" />
    </div>
    <div class="w-40 p-2">
      Camada
      <LucideLayers size="15px" fill="#ddd" stroke="#222" />
      <layer-selector title="Domínio" v-model="editLayer" missing="<nenhuma camada>" />
    </div>
    <div class="ms-auto mt-2">
      <div class="form-check form-switch mt-4">
        <input class="form-check-input" type="checkbox" role="switch" v-model="editDeleted" />
        <label class="form-check-label" for="deleted">Desabilitado</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import DomainSelector from '@/components/DomainSelector.vue'
import LayerSelector from '@/components/LayerSelector.vue'
import { LucideCrown, LucideInfo, LucideLayers } from 'lucide-vue-next'
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  domain: { type: Object, required: false },
  layer: { type: Object, required: false },
  deleted: { type: Boolean, required: true },
  notes: { type: String, required: false },
})
const editDomain = ref(props.domain)
const editLayer = ref(props.layer)
const editDeleted = ref(props.deleted)

const emit = defineEmits(['update:domain', 'update:layer', 'update:deleted'])

// Watch for parent prop changes
watch(
  () => props.domain,
  (newValue) => {
    editDomain.value = newValue
  },
)

watch(
  () => props.layer,
  (newValue) => {
    editLayer.value = newValue
  },
)

watch(
  () => props.deleted,
  (newValue) => {
    editDeleted.value = newValue
  },
)

// Watch for local changes and emit update events
watch(editDomain, (newValue) => {
  emit('update:domain', newValue)
})

watch(editLayer, (newValue) => {
  emit('update:layer', newValue)
})

watch(editDeleted, (newValue) => {
  emit('update:deleted', newValue)
})
</script>
<style scoped>
.w-20 {
  width: 20%;
}
.w-40 {
  width: 40%;
}
</style>
