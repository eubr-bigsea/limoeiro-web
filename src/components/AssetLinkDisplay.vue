<template>
  <div class="position-relative">
    <h4 class="mt-2"><LucideLink2 stroke="orange" /> {{ title }}</h4>
    <button
      v-if="!editing && !loading"
      class="btn btn-success py-0 px-0 position-absolute top-0 end-0 rounded-circle me-1 float-end"
      @click="add"
    >
      <LucidePlus size="25px" />
    </button>
    <div v-if="loading" class="position-absolute top-0 end-0 bg-white">
      <LoadingIndicator message="Aguarde..." />
    </div>
    <div>
      <div v-if="editing" class="px-1">
        <label>URL</label>
        <input
          v-model="newLink.url"
          type="url"
          class="form-control form-control-sm"
          ref="input"
          maxlength="200"
        />
        <label>Tipo</label>
        <select v-model="newLink.type" class="form-control form-select form-select-sm">
          <option value="SOURCE_CODE">Código-fonte</option>
          <option value="DOCUMENTATION">Documentação</option>
          <option value="DEPLOYMENT">Implantação</option>
          <option value="OTHER">Outro</option>
        </select>
        <button class="btn btn-sm" title="Cancelar" @click="save">
          <LucideSave size="15px" color="green" />
        </button>
        <button class="btn btn-sm" title="Cancelar" @click="editing = false">
          <LucideUndo2 size="15px" />
        </button>
      </div>
      <div v-if="modelValue?.length">
        <div v-for="(group, key) in grouped" class="mb-3 mt-3" :key="key">
          <h6>
            <LucideNetwork v-if="key == 'DEPLOYMENT'" size="15px" color="navy" />
            <LucideFile v-else-if="key == 'DOCUMENTATION'" size="15px" color="purple" fill="#fee" />
            <LucideGitBranch v-else-if="key == 'SOURCE_CODE'" size="15px" />
            <LucideFileQuestion v-else size="15px" color="gray" />

            {{ getType(key) }}
          </h6>
          <div v-for="item in group" :key="item.id" class="d-flex mb-1">
            <DropdownLink v-if="!editing">
              <template #button="props">
                <button
                  class="btn p-0 btn-sm btn-light border-0 m-0 me-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  @click="props.toggle"
                >
                  <LucideChevronDown size="20px" fill="#222" stroke-width="0" />
                </button>
              </template>
              <template #default>
                <li>
                  <a class="dropdown-item" href="#" @click="edit(item)">
                    <LucideEdit3 size="15px" color="green" /> Editar
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="remove(item)">
                    <LucideTrash2 size="15px" color="#ff3333" /> Excluir
                  </a>
                </li>
              </template>
            </DropdownLink>
            <a :href="item.url" target="_blank">{{ item.url }}</a>
          </div>
        </div>
      </div>
      <div v-else>{{ missing }}</div>
    </div>
  </div>
</template>
<script setup>
import {
  LucideChevronDown,
  LucideEdit3,
  LucideFile,
  LucideFileQuestion,
  LucideGitBranch,
  LucideLink2,
  LucideNetwork,
  LucidePlus,
  LucideSave,
  LucideTrash2,
  LucideUndo2,
} from 'lucide-vue-next'
import { ref, defineEmits, defineProps, nextTick, computed } from 'vue'
import LoadingIndicator from './ui/LoadingIndicator.vue'
import DropdownLink from './ui/DropdownLink.vue'

const props = defineProps({
  title: { type: String, required: false, default: 'Tags' },
  missing: { type: String, required: false, default: 'Nenhum registro' },
  loading: { type: Boolean, required: false },
  modelValue: { type: Array, required: true },
})

const emit = defineEmits(['update:modelValue', 'change', 'save', 'remove'])
const grouped = computed(() => {
  var x = Object.fromEntries(
    Object.entries(Object.groupBy(props.modelValue, (item) => item.type)).sort((a, b) => {
      return getType(a[0]).localeCompare(getType(b[0]))
    }),
  )
  return x
})
const editing = ref(false)
const input = ref()
const newLink = ref({})

const getType = (type) => {
  switch (type) {
    case 'DOCUMENTATION':
      return 'Documentação'
    case 'SOURCE_CODE':
      return 'Código-fonte'
    case 'DEPLOYMENT':
      return 'Implantação'
    default:
      return 'Outro'
  }
}
const save = () => {
  emit('save', newLink.value) // 🔹 Emite o evento de mudança
  editing.value = false
}
const startEditing = () => {
  editing.value = true
  nextTick(() => {
    input.value.focus()
  })
}
const add = () => {
  newLink.value = {}
  startEditing()
}
const edit = (item) => {
  startEditing()
  newLink.value = { ...item }
}
const remove = (item) => {
  emit('remove', item)
}
</script>
