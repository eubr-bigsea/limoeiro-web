<template>
  <div class="lookup">
    <div class="input-container">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control form-control-sm"
        :placeholder="placeholder"
        :disabled="!!selectedOption && !isEditing"
        ref="input"
      />
      <template v-if="mode === 'form'">
        <button
          class="btn btn-sm btn-link p-0 m-0"
          v-if="isEditing"
          @click="cancelEdit"
          title="Cancelar"
        >
          <LucideUndo2 size="15px" />
        </button>
        <button
          class="btn btn-sm btn-link p-0 m-0"
          v-if="selectedOption && !isEditing"
          @click="clearSelection"
          title="Limpar"
        >
          <LucideTrash2 size="15px" :color="immediate ? '#FF4136' : '#222'" />
        </button>
        <button
          class="btn btn-sm btn-link p-0 m-0"
          v-if="selectedOption && !isEditing"
          @click="editSelection"
          title="Editar"
        >
          <LucideEdit3 size="15px" :color="immediate ? '#FF851B' : '#222'" />
        </button>
      </template>
    </div>

    <!-- Lista de opções -->
    <ul v-if="options && options.length > 0 && (isEditing || !selectedOption)" class="options">
      <li
        v-for="(option, index) in options"
        :key="option[valueProperty]"
        :class="{ active: index === activeIndex }"
        @click="selectOption(option)"
      >
        {{ option[label] }}
      </li>
    </ul>
    <ul v-else-if="notFound" class="options">
      <li @click="emit('cancel')">Nenhum registro encontrado</li>
    </ul>
  </div>
</template>

<script setup>
import { LucideEdit3, LucideTrash2, LucideUndo2 } from 'lucide-vue-next'
import { ref, watch, onMounted, onUnmounted, defineEmits, computed, defineExpose } from 'vue'

const props = defineProps({
  fetchFunction: Function, // Função assíncrona para buscar dados
  modelValue: {
    // Para suportar v-model
    type: [Object, null],
    default: null,
  },
  label: {
    // Propriedade para determinar qual campo será exibido como texto
    type: String,
    default: 'label',
  },
  type: {
    // Propriedade para determinar o que será retornado, o objeto ou um valor
    type: String,
    default: 'object',
  },
  valueProperty: {
    // Propriedade para determinar qual campo será exibido como valor
    type: String,
    default: '?????',
  },
  placeholder: {
    type: String,
    default: 'Digite para buscar...',
  },
  immediate: {
    type: Boolean,
    default: true,
  },
  mode: {
    type: String,
    default: 'form',
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'update:value', 'cancel'])

// Estado local do componente
const searchQuery = ref('')
const options = ref([])
const notFound = ref(false)
const activeIndex = ref(-1) // Índice da opção destacada
const isEditing = ref(false || props.mode !== 'form') // Estado de edição

// Manter uma referência local ao valor selecionado
const selectedOption = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    isEditing.value = false
    emit('update:modelValue', newValue)
    emit('change', newValue)
    emit(
      'update:value',
      props.type === 'object' || newValue === null ? newValue : newValue[props.valueProperty],
    )
  },
})

// Inicializa o searchQuery com o label do valor inicial
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && !isEditing.value) {
      searchQuery.value = newValue[props.label] || ''
    } else if (!newValue && !isEditing.value) {
      searchQuery.value = ''
    }
  },
  { immediate: true },
)

// Função de debounce para evitar requisições excessivas
const useDebounce = (value, delay = 500) => {
  const debouncedValue = ref(value.value)
  let timeout

  watch(value, (newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}

const debouncedQuery = useDebounce(searchQuery, 500)

// Monitora mudanças no campo de busca e chama a API
watch(debouncedQuery, async (newQuery) => {
  if (!newQuery || newQuery.length < 3) {
    options.value = []
    activeIndex.value = -1
    return
  }

  // Só busca se não estiver selecionado ou estiver no modo de edição
  if (!selectedOption.value || isEditing.value) {
    try {
      options.value = await props.fetchFunction(newQuery)
      notFound.value = options.value.length === 0
    } catch (error) {
      console.error('Erro ao buscar opções:', error)
    }
  }
})

// Seleciona um item
const selectOption = (option) => {
  searchQuery.value = option[props.label] // Exibe o nome da opção no input
  options.value = []
  activeIndex.value = -1
  isEditing.value = false // Sai do modo de edição ao selecionar
  // Must be the last line, because it triggers the watcher
  // that updates the modelValue
  // and the searchQuery
  selectedOption.value = option
}

// Limpa a seleção
const clearSelection = () => {
  selectedOption.value = null
  searchQuery.value = ''
  options.value = []
  activeIndex.value = -1
  isEditing.value = false
}

const input = ref()
// Ativa edição, recarregando as opções
const editSelection = async () => {
  isEditing.value = true // Ativa o modo de edição

  // Mantém o texto da opção selecionada no campo
  searchQuery.value = selectedOption.value ? selectedOption.value[props.label] || '' : ''

  // Recarregar as opções com o texto atual
  try {
    options.value = await props.fetchFunction(searchQuery.value)
    activeIndex.value = -1 // Reinicia o índice ativo
  } catch (error) {
    console.error('Erro ao buscar opções ao editar:', error)
  }
  input.value.focus()
}

const cancelEdit = (explicit) => {
  if (explicit || isEditing.value) {
    if (selectedOption.value) {
      searchQuery.value = selectedOption.value[props.label] || ''
    } else {
      searchQuery.value = ''
    }
    isEditing.value = false
    options.value = []
  }
}

// Captura eventos de teclado
const handleKeyDown = (event) => {
  // Se não estiver em modo de edição e não houver opções, não faz nada
  if (options.value.length === 0) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % options.value.length
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + options.value.length) % options.value.length
  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (activeIndex.value >= 0 && activeIndex.value < options.value.length) {
      selectOption(options.value[activeIndex.value])
    }
  } else if (event.key === 'Escape') {
    event.preventDefault()
    cancelEdit()
  }
}
const focus = () => {
  input.value.focus()
}
defineExpose({ focus, clearSelection, cancelEdit })
// Adiciona/remover evento de teclado globalmente
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.lookup {
  width: 100%;
  position: relative;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

input {
  width: 100%;
  padding: 2px 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.options {
  list-style: none;
  padding: 0;
  margin: 1px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  position: absolute;
  width: 100%;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.options li {
  padding: 5px;
  cursor: pointer;
}

.options li.active {
  background: #e0e0e0;
}

.options li:hover {
  background: #f0f0f0;
}
</style>
