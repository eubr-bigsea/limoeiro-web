<template>
  <div class="position-relative">
    <h4 class="mt-2"><LucideKeySquare fill="silver" stroke="gray" /> {{ title }}</h4>
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
    <div>
      <!-- -->
      <div v-if="editing" class="px-1">
        <label>Contato</label>
        <span v-if="alreadyExists" class="text-danger"> já cadastrado</span>
        <LookupComponent
          :fetchFunction="retrieveContacts"
          v-model="newResponsibility.contact"
          v-model:value="newResponsibility.contact_id"
          label="name"
          :value-property="'id'"
          :value="'id'"
          type="value"
        />
        <label>Tipo</label>
        <select v-model="newResponsibility.type_id" class="form-control form-select form-select-sm">
          <option v-for="type in responsibilityTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
        <button v-if="!alreadyExists" class="btn btn-sm" title="Salvar" @click="save">
          <LucideSave size="15px" color="green" />
        </button>
        <button class="btn btn-sm" title="Cancelar" @click="editing = false">
          <LucideUndo2 size="15px" />
        </button>
      </div>
      <div v-if="modelValue?.length">
        <div v-for="(group, key) in grouped" class="mb-3 mt-3" :key="key">
          <h6>
            {{ group[0].type.name }}
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
                <!-- <li>
                  <a class="dropdown-item" href="#" @click="edit(item)">
                    <LucideEdit3 size="15px" color="green" /> Editar
                  </a>
                </li> -->
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="remove(item)">
                    <LucideTrash2 size="15px" color="#ff3333" /> Excluir
                  </a>
                </li>
              </template>
            </DropdownLink>
            <a :href="item.url" target="_blank">{{ item.contact.name }}</a>
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
  LucideKeySquare,
  LucidePlus,
  LucideSave,
  LucideTrash2,
  LucideUndo2,
} from 'lucide-vue-next'
import { ref, defineEmits, defineProps, computed, onMounted, nextTick } from 'vue'
import LoadingIndicator from './ui/LoadingIndicator.vue'
import DropdownLink from './ui/DropdownLink.vue'
import { useFetch } from '@/composables/useFetch'
import LookupComponent from './ui/LookupComponent.vue'
import { getContacts } from '@/services/contact'

const props = defineProps({
  title: { type: String, required: false, default: 'Responsabilidade' },
  missing: { type: String, required: false, default: 'Nenhum registro' },
  loading: { type: Boolean, required: false, default: true },
  modelValue: { type: Array, required: true },
  assetId: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue', 'change', 'save', 'remove'])

onMounted(async () => {
  await loadResponsibilityTypes()
})
const grouped = computed(() => {
  var x = Object.fromEntries(
    Object.entries(Object.groupBy(props.modelValue, (item) => [item.type.id, item.type.name])).sort(
      (a, b) => {
        return a[1][0].type.name.localeCompare(b[1][0].type.name)
      },
    ),
  )
  return x
})
const selected = computed(() => {
  return props.modelValue.map((v) => `${v.type.id},${v.contact.id}`)
})
const editing = ref(false)
const newResponsibility = ref({})
const responsibilityTypes = ref([])
const alreadyExists = computed(() => {
  const { contact_id, type_id } = newResponsibility.value
  return selected.value.includes(`${type_id},${contact_id}`)
})

const save = () => {
  const { contact_id, type_id } = newResponsibility.value
  emit('save', { contact_id, type_id, asset_id: props.assetId }) // 🔹 Emite o evento de mudança
  editing.value = false
}

const loadResponsibilityTypes = async () => {
  const { data, fetchData } = useFetch('/responsibility-types/?sort_by=name')
  await fetchData()
  responsibilityTypes.value = data.value.items
}
const startEditing = () => {
  editing.value = true
  nextTick(() => {
    //input.value.focus()
  })
}
const add = () => {
  newResponsibility.value = {}
  startEditing()
}
const remove = (item) => {
  emit('remove', item)
}

const retrieveContacts = async (query) => {
  const { contacts, error } = await getContacts(query)
  return contacts
}
</script>
