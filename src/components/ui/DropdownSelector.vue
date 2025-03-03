<template>
  <div class="dropdown-container" :class="{ 'is-open': isOpen }">
    <div class="dropdown-header" @click="toggleDropdown">
      <div v-if="selectedOption" class="selected-option">
        <slot name="selected-option" :option="selectedOption">
          <slot name="option" :option="selectedOption">
            {{ selectedOption.label }}
          </slot>
        </slot>
      </div>
      <div v-else class="placeholderx">
        {{ placeholder }}
      </div>
      <div class="dropdown-arrow">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>

    <ul v-if="isOpen" class="dropdown-options">
      <li v-if="loading" class="dropdown-loading">Loading options...</li>
      <li v-else-if="error" class="dropdown-error">{{ error }}</li>
      <li v-else-if="options.length === 0" class="dropdown-empty">No options available</li>
      <template v-else>
        <li
          v-for="option in options"
          :key="option.id"
          class="dropdown-option"
          :class="{ 'is-selected': isSelected(option) }"
          @click="selectOption(option)"
        >
          <slot name="option" :option="option">
            {{ option.label }}
          </slot>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Object, null],
    default: null,
  },
  apiUrl: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
  params: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'option-selected'])

// State
const options = ref([])
const loading = ref(false)
const error = ref(null)
const isOpen = ref(false)

// Computed
const selectedOption = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Methods
const fetchOptions = async () => {
  loading.value = true
  error.value = null

  try {
    const queryParams = new URLSearchParams(props.params).toString()
    const url = queryParams ? `${props.apiUrl}?${queryParams}` : props.apiUrl

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch options: ${response.statusText}`)
    }

    const data = await response.json()
    options.value = Array.isArray(data) ? data : data.items || data.results || data.data || []
  } catch (err) {
    console.error('Error fetching options:', err)
    error.value = 'Failed to load options. Please try again.'
  } finally {
    loading.value = false
  }
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const selectOption = (option) => {
  selectedOption.value = option
  emit('option-selected', option)
  closeDropdown()
}

const isSelected = (option) => {
  if (!selectedOption.value) return false
  return selectedOption.value.id === option.id
}

// Event listener to close dropdown when clicking outside
const handleClickOutside = (event) => {
  const dropdownEl = event.target.closest('.dropdown-container')
  if (!dropdownEl) {
    closeDropdown()
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchOptions()
  document.addEventListener('click', handleClickOutside)
})

// Clean up event listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Reload when apiUrl or params change
watch(
  [() => props.apiUrl, () => props.params],
  () => {
    fetchOptions()
  },
  { deep: true },
)
</script>

<style scoped>
.dropdown-container {
  position: relative;
  width: 100%;
  min-width: 200px; /* Ensures minimum width */
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.2rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
}

.selected-option {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-container.is-open .dropdown-header {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-color: transparent;
}

.dropdown-arrow {
  transition: transform 0.2s ease;
}

.dropdown-container.is-open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: white;
  border: 1px solid #ccc;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  max-height: 250px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 0.9em;
}

.dropdown-option {
  padding: 0.2rem 0.5rem;
  cursor: pointer;
}

.dropdown-option:hover {
  background-color: #f5f5f5;
}

.dropdown-option.is-selected {
  background-color: #e6f7ff;
}

.dropdown-loading,
.dropdown-error,
.dropdown-empty {
  padding: 0.75rem 1rem;
  color: #888;
  font-style: italic;
}

.dropdown-error {
  color: #f56c6c;
}

.placeholder {
  color: #888;
}
</style>
