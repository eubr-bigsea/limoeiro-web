<template>
  <component
    v-if="editLink"
    :is="editLinkComponent"
    v-bind="editSharedAttributes"
    class="btn btn-sm btn-outline-secondary me-1 rounded-circle"
    title="Editar registro"
  >
    <pencil :size="16" />
  </component>

  <component
    :is="deleteLinkComponent"
    v-bind="deleteSharedAttributes"
    class="btn btn-outline-danger btn-sm rounded-circle"
    :title="confirmationTitle"
  >
    <trash2 :size="16" />
  </component>
  <confirmation-dialog ref="confirm" :message="confirmationMessage" @confirmed="handleConfirmed" />
</template>
<script setup>
import { Pencil, Trash2 } from 'lucide-vue-next'
import { defineEmits, defineProps, computed, ref } from 'vue'
import ConfirmationDialog from './ConfirmationDialog.vue'

const props = defineProps({
  row: { required: true, type: Object },
  editLink: { type: Object },
  deleteLink: { type: Object },
  confirmationMessage: { type: String, default: 'Deseja excluir este registro?' },
  confirmationTitle: { type: String, default: 'Remover registro' },
})
const emit = defineEmits(['edit', 'delete'])

const editLinkComponent = computed(() => (props.editLink ? 'router-link' : 'button'))
const deleteLinkComponent = computed(() => (props.deleteLink ? 'router-link' : 'button'))
const handleEditClick = () => {
  console.debug(props.row)
  emit('edit', props.row)
}
const editSharedAttributes = computed(() => {
  if (props.editLink) {
    return {
      to: props.editLink,
    }
  } else {
    return {
      type: 'button',
      onClick: handleEditClick,
    }
  }
})
const handleDeleteClick = () => {
  confirm.value.show()
}
const handleConfirmed = () => {
  emit('delete', props.row)
}
const confirm = ref()
const deleteSharedAttributes = computed(() => {
  if (props.deleteLink) {
    return {
      to: props.deleteLink,
    }
  } else {
    return {
      type: 'button',
      onClick: handleDeleteClick,
    }
  }
})
</script>
