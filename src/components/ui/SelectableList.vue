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
    <li v-if="showCommands" class="p-2">
      <a href="#" @click.prevent="clean">Limpar</a>
      <a href="#" class="ms-2" @click.prevent="selectAll">Todos</a>
    </li>
    <li v-for="item in items" :key="item[keyProp]" class="dropdown-item px-2 py-1 overflow-hidden">
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
  </DropdownComponent>
</template>

<script setup>
import DropdownComponent from './DropdownComponent.vue'
import { computed, defineProps, defineEmits, useId } from 'vue'

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
})

const inputName = useId()
const emit = defineEmits(['update:modelValue'])

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
</script>
