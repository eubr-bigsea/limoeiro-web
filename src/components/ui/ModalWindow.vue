<template>
  <div>
    <!-- Modal -->
    <div
      v-if="isVisible"
      class="modal fade show"
      tabindex="-1"
      role="dialog"
      style="display: block; background: rgba(0, 0, 0, 0.5)"
    >
      <div :class="['modal-dialog', modalClass]" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
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
                @click="closeModal"
              >
                {{ cancelButtonLabel }}
              </button>
              <button v-if="showOkButton" type="button" class="btn btn-success">
                {{ okButtonLabel }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'ModalComponent',
  props: {
    modalTitle: {
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
  },
  setup(props, { expose }) {
    const isVisible = ref(false)

    const openModal = () => {
      isVisible.value = true
      document.body.classList.add('modal-open')
    }

    const closeModal = () => {
      isVisible.value = false
      document.body.classList.remove('modal-open')
    }

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isVisible.value) {
        closeModal()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleEscapeKey)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleEscapeKey)
    })

    expose({ openModal })

    return {
      isVisible,
      closeModal,
    }
  },
}
</script>

<style scoped>
.modal-open {
  overflow: hidden;
}
</style>
