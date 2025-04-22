<template>
  <div>
    <!-- Modal -->
    <div
      v-if="isVisible"
      class="modal fade show"
      tabindex="-1"
      role="dialog"
      style="display: block; background: rgba(0, 0, 0, 0.5)"
      @click.self="close(false)"
    >
      <div :class="['modal-dialog', modalClass]" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <slot name="modal-title">
              <h5 class="modal-title">{{ title }}</h5>
            </slot>
            <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <slot name="body">
              <p>Modal body content goes here.</p>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button
                v-if="showCancelButton"
                type="button"
                class="btn btn-secondary"
                @click="close(false)"
              >
                {{ cancelButtonLabel }}
              </button>
              <button
                v-if="showOkButton"
                type="button"
                class="btn btn-success"
                @click="close(true)"
              >
                {{ okButtonLabel }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Modal Title',
  },
  okButtonLabel: {
    type: String,
    default: 'OK',
  },
  cancelButtonLabel: {
    type: String,
    default: 'Cancel',
  },
  showOkButton: {
    type: Boolean,
    default: true,
  },
  showCancelButton: {
    type: Boolean,
    default: true,
  },
  modalClass: {
    type: String,
    default: '',
  },
  okAction: {
    type: Function,
  },
})

const emits = defineEmits(['ok', 'cancel'])

const isVisible = ref(false)

const show = () => {
  isVisible.value = true
  document.body.classList.add('modal-open')
}

const close = (okClicked) => {
  if (okClicked) {
    if (props.okAction) {
      props.okAction()
    }
    emits('ok')
  } else {
    emits('cancel')
  }
  isVisible.value = false
  document.body.classList.remove('modal-open')
}

const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && isVisible.value) {
    close(false)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscapeKey)
})

defineExpose({ show })
</script>

<style scoped>
.modal-open {
  overflow: hidden;
}
</style>
