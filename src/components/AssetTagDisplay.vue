<template>
  <div class="position-relative">
    <h4 class="mt-2"><LucideTags stroke="darkgreen" /> {{ title }}</h4>
    <button
      v-if="!editing && !loading"
      class="btn btn-success py-0 px-0 position-absolute top-0 end-0 rounded-circle me-1 float-end"
      @click="add"
      title="Adicionar"
    >
      <LucidePlus size="25px" />
    </button>
    <div v-if="loading" class="position-absolute top-0 end-0 bg-white">
      <LoadingIndicator message="Aguarde..." />
    </div>
    <div class="d-flex flex-wrap">
      <div
        v-for="tag in editable"
        v-if="editable?.length"
        :key="tag.id"
        class="xbadge text-dark me-4"
        role="button"
        @click="remove(tag)"
      >
        #{{ tag.name }} <LucideTrash2 color="#FF4136" size="14px" />
      </div>
      <div v-else>{{ missing }}</div>
    </div>
    <div v-if="editing" class="mx-1">
      <label>Associar tag</label>
      <LookupComponent
        :fetchFunction="retrieveOptions"
        v-model="newTag"
        label="name"
        value="id"
        mode="control"
        ref="lookup"
        @change="save"
        @cancel="editing = false"
      />
      <button class="btn btn-sm" title="Cancelar" @click="editing = false">
        <LucideUndo2 size="15px" />
      </button>
    </div>
  </div>
</template>
<script setup>
import { LucidePlus, LucideSave, LucideTags, LucideTrash2, LucideUndo2 } from 'lucide-vue-next'
import { computed, ref, defineEmits, defineProps, watch, nextTick } from 'vue'
import LoadingIndicator from './ui/LoadingIndicator.vue'
import LookupComponent from './ui/LookupComponent.vue'
import { useFetch } from '@/composables/useFetch'

const props = defineProps({
  title: { type: String, required: false, default: 'Tags' },
  missing: { type: String, required: false, default: 'Nenhuma tag associada' },
  loading: { type: Boolean, required: false, default: true },
  modelValue: { type: Array, required: true },
})

const emit = defineEmits(['update:modelValue', 'change', 'remove', 'save'])
const editable = ref(props.modelValue)
const editing = ref(false)
const newTag = ref({})
const lookup = ref()

const selectedIds = computed(() => {
  return editable.value.map((v) => v.id)
})
watch(
  () => props.modelValue,
  (newValue) => {
    editable.value = newValue
  },
)
const save = () => {
  emit('save', newTag.value)
  editing.value = false
}
const remove = (tag) => {
  emit('remove', tag)
}
const add = () => {
  editing.value = true
  nextTick(() => {
    lookup.value.focus()
  })
}
const retrieveOptions = async (query) => {
  const { data, fetchData } = useFetch(`/tags/?query=${query}&sort_by=name&page_size=10`)
  await fetchData()
  return data.value.items.filter((v) => !selectedIds.value.includes(v.id))
}
</script>
