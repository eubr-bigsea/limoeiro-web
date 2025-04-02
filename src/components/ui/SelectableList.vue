<template>
  <div ref="dropdownRef" class="dropdown position-relative">
    <!-- Toggle Button -->

    <button class="btn dropdown-toggle" :class="buttonClass" type="button" @click="toggleDropdown">
      <span
        v-if="displayBadge && selectedItems.length > 0"
        class="badge text-dark border fw-normal border-success"
        >{{ selectedItems.length }}</span
      >
      <span class="ps-1">{{ buttonTitle }}</span>
    </button>

    <!-- Selected Items Display -->
    <!-- <div v-if="selectedItems.length" class="mt-2">
      <slot name="selected" :selected="selectedItems">
        <p><strong>Selected:</strong> {{ selectedItems.map((o) => o[valueProp]).join(', ') }}</p>
      </slot>
    </div> -->

    <!-- Floating Dropdown List -->
    <ul v-if="isVisible" class="dropdown-menu show ps-3 pe-1">
      <li v-if="showCommands">
        <a href="#" @click.prevent="clean">Limpar</a>
        <a href="#" class="ms-2" @click.prevent="selectAll">Todos</a>
      </li>
      <li
        v-for="item in items"
        :key="item[keyProp]"
        class="dropdown-item px-2 py-1 overflow-hidden"
      >
        <input
          class="form-check-input me-2"
          type="checkbox"
          :id="item[keyProp]"
          :value="item[keyProp]"
          :checked="isSelected(item)"
          @change="toggleItemSelection(item)"
        />
        <label class="form-check-label w-100 fw-normal" :for="item[keyProp]">
          <slot :item="item">{{ item[valueProp] }}</slot>
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  items: Array, // List of objects
  modelValue: { type: Array, required: true }, // Selected items list (array of objects)
  keyProp: { type: String, required: true }, // Key property name
  valueProp: { type: String, required: true }, // Value property name
  buttonClass: { type: String, default: '' },
  buttonTitle: { type: String, required: true },
  showCommands: { type: Boolean, required: false, default: false },
  displayBadge: { type: Boolean, required: false, default: true },
})

// Emits
const emit = defineEmits(['update:modelValue'])

// State
const isVisible = ref(false)

// Compute selected objects based on selected values
const selectedItems = computed(() => props.modelValue)

// Check if an item is selected
const isSelected = (item) => {
  return selectedItems.value.some((selected) => selected[props.keyProp] === item[props.keyProp])
}

// Toggle item selection
const toggleItemSelection = (item) => {
  const updatedSelection = [...selectedItems.value]
  const index = updatedSelection.findIndex(
    (selected) => selected[props.keyProp] === item[props.keyProp],
  )

  if (index !== -1) {
    updatedSelection.splice(index, 1) // Deselect item
  } else {
    updatedSelection.push(item) // Select item
  }

  emit('update:modelValue', updatedSelection)
}

// Toggle dropdown visibility
const toggleDropdown = () => {
  isVisible.value = !isVisible.value
}

const dropdownRef = ref(null)
// Close dropdown when clicking outside
const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
const clean = () => {
  emit('update:modelValue', [])
}
const selectAll = () => {
  emit('update:modelValue', props.items)
}
</script>

<style scoped>
/* Ensure dropdown appears above other content */
.dropdown-menu {
  font-size: 0.9em;
  min-width: 200px;
  max-height: 250px;
  overflow-y: auto;
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  z-index: 10;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-menu.show {
  display: block;
}
.dropdown > button {
  font-size: 1em;
}
.badge {
  font-size: 0.6em;
}
</style>
