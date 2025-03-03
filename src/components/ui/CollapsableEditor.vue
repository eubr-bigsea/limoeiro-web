<template>
  <div v-if="!isEditing" class="text-muted py-1 px-2">
    {{ modelValue ? modelValue : missing }}
    <button class="btn btn-sm" title="Editar" @click="isEditing = true">
      <LucidePencilLine size="14px" />
    </button>
  </div>
  <div v-else>
    <textarea class="form-control form-control-sm" v-model="editableText"></textarea>
    <button class="btn btn-sm" title="Salvar" @click="save">
      <LucideSave size="20px" />
    </button>
    <button class="btn btn-sm" title="Cancelar" @click="cancel">
      <LucideUndo2 size="20px" />
    </button>
  </div>
</template>

<script setup>
import { LucidePencilLine, LucideSave, LucideUndo2 } from 'lucide-vue-next'
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, required: false },
  missing: { type: String, required: false },
})
const emit = defineEmits(['update:modelValue', 'change'])

const isEditing = ref(false)
const editableText = ref(props.modelValue)

// Atualiza `editableText` se a prop mudar
watch(
  () => props.modelValue,
  (newValue) => {
    editableText.value = newValue
  },
)

const cancel = () => {
  editableText.value = props.modelValue
  isEditing.value = false
}

const save = () => {
  if (editableText.value !== props.modelValue) {
    emit('update:modelValue', editableText.value)
    emit('change', editableText.value) // 🔹 Emite o evento de mudança
  }
  isEditing.value = false
}
</script>
