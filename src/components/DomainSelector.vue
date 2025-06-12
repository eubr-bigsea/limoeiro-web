<template>
  <div class="d-flex gap-1 align-items-center" :title="title">
    <template v-if="true || editable">
      <LookupComponent
        :fetchFunction="retrieveOptions"
        v-model="editable"
        label="name"
        value-property="id"
      />
    </template>
    <span v-else>{{ missing }}</span>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import LookupComponent from './ui/LookupComponent.vue'
import { useFetch } from '@/composables/useFetch'

const props = defineProps({
  modelValue: { type: Object, required: false },
  missing: { type: String, required: false },
  title: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue'])

const editable = ref(props.modelValue)

// Atualiza `editable` se a prop mudar
watch(
  () => props.modelValue,
  (newValue) => {
    editable.value = newValue
  },
)
watch(editable, (newValue) => {
  emit('update:modelValue', newValue)
})
const retrieveOptions = async (query) => {
  const { data, fetchData, error } = useFetch(`/domains/?sort_by=name&query=${query}`)
  await fetchData()
  return data.value.items
}
</script>
