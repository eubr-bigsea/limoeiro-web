<template>
  <DropdownComponent :buttonClass="buttonClass">
    <template #button-content>
      <span
        v-if="displayBadge && selectedItems?.length > 0"
        class="badge text-dark border fw-normal border-success m-0"
        >{{ selectedItems.length }}</span
      >
      <span v-if="single && selectedItems.length > 0">
        {{ selectedItems[0][valueProp] }}
      </span>
      <span v-else class="ps-1">{{ buttonTitle }}</span>
    </template>

    <!-- Search Area -->
    <div v-if="mode === 'search'" class="px-2 py-1">
      <input
        type="text"
        class="form-control form-control-sm"
        placeholder="Pesquisar..."
        v-model="searchQuery"
        @input="debouncedSearch"
      />
    </div>

    <!-- Horizontal Layout for Items -->
    <div class="d-flex">
      <!-- Search Retrieved Items -->
      <div class="flex-grow-1">
        <ul class="list-unstyled mb-0">
          <li v-if="showCommands" class="p-2">
            <a href="#" @click.prevent="clean">Limpar</a>
            <a href="#" class="ms-2" @click.prevent="selectAll">Todos</a>
          </li>
          <li
            v-if="items.length > 0"
            v-for="item in items"
            :key="item[keyProp]"
            class="dropdown-item px-2 py-1 overflow-hidden"
          >
            <input
              class="form-check-input me-2"
              :type="single ? 'radio' : 'checkbox'"
              :name="inputName"
              :id="item[keyProp]"
              :value="item[keyProp]"
              :checked="isSelected(item)"
              @change="toggleItemSelection(item)"
            />
            <label class="form-check-label w-100 fw-normal" :for="item[keyProp]">
              <slot :item="item">{{ item[valueProp] }}</slot>
            </label>
          </li>
          <li v-else-if="searchQuery != ''" class="dropdown-item px-2 py-1 overflow-hidden">
            A busca não retornou registros
          </li>
          <li v-else class="dropdown-item px-2 py-1 overflow-hidden">
            Digite para iniciar a busca
          </li>
        </ul>
      </div>

      <!-- Previously Selected Items -->
      <div v-if="mode === 'search'" class="p-2 border-start">
        <span v-if="!selectedItems.length > 0">nada selecionado</span>
        <strong v-else>Selecionado(s)</strong>
        <ul class="list-unstyled mb-0">
          <li
            v-for="item in selectedItems"
            :key="item[keyProp]"
            class="dropdown-item px-2 py-1 overflow-hidden d-flex justify-content-between align-items-center"
          >
            <span>{{ item[valueProp] }}</span>
            <LucideTrash2
              alt="Remover"
              @click.stop="removeSelectedItem(item)"
              role="button"
              size="12"
              color="red"
            />
          </li>
        </ul>
      </div>
    </div>
  </DropdownComponent>
</template>

<script setup>
import { debounce } from '@/util'
import DropdownComponent from './DropdownComponent.vue'
import { computed, defineProps, defineEmits, useId, ref } from 'vue'
import { LucideTrash2 } from 'lucide-vue-next'

// Props
const props = defineProps({
  items: Array,
  modelValue: { type: Array, required: true },
  keyProp: { type: String, required: true },
  valueProp: { type: String, required: true },
  buttonClass: { type: String, default: '' },
  buttonTitle: { type: String, required: true },
  showCommands: { type: Boolean, required: false, default: false },
  displayBadge: { type: Boolean, required: false, default: true },
  single: { type: Boolean, required: false, default: false },
  mode: { type: String, required: false, default: '' }, // New prop
})

const inputName = useId()
const emit = defineEmits(['update:modelValue', 'search'])

const searchQuery = ref('')
const debouncedSearch = debounce(() => {
  emit('search', searchQuery.value)
}, 500)

const selectedItems = computed(() => props.modelValue)

const isSelected = (item) => {
  return selectedItems.value.some((selected) => selected[props.keyProp] === item[props.keyProp])
}

const toggleItemSelection = (item) => {
  let updatedSelection = [...selectedItems.value]
  const index = updatedSelection.findIndex(
    (selected) => selected[props.keyProp] === item[props.keyProp],
  )
  if (props.single) {
    updatedSelection = [item]
  } else if (index !== -1) {
    updatedSelection.splice(index, 1)
  } else {
    updatedSelection.push(item)
  }

  emit('update:modelValue', updatedSelection)
}

const clean = () => {
  emit('update:modelValue', [])
}

const selectAll = () => {
  emit('update:modelValue', props.items)
}

const removeSelectedItem = (item) => {
  const updatedSelection = selectedItems.value.filter(
    (selected) => selected[props.keyProp] !== item[props.keyProp],
  )
  emit('update:modelValue', updatedSelection)
}
</script>
