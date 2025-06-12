<template>
  <ModalWindow
    ref="modal"
    :show-cancel-button="false"
    modal-class="modal-xl"
    title="Registros de execução"
  >
    <template #body>
      <div class="modal-content border p-2">
        <table class="table table-striped table-bordered table-sm align-middle">
          <thead>
            <tr>
              <th>Data</th>
              <th>Situação</th>
              <th>Mensagem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td>{{ $formatDateHourSeconds(log.updated_at) }}</td>
              <td>{{ log.status }}</td>
              <td class="fs-6">
                <pre>{{ log.log }}</pre>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </ModalWindow>
</template>
<script setup>
import ModalWindow from '@/components/ui/ModalWindow.vue'
import { useFetch } from '@/composables/useFetch'
import { ref, defineExpose } from 'vue'

const logs = ref([])
const modal = ref()
const displayModal = async (executionId) => {
  const { data, fetchData } = useFetch(`/ingestion-logs/?execution_id=${executionId}`)
  await fetchData()
  logs.value = data.value.items
  modal.value.show()
}

defineExpose({
  displayModal,
})
</script>
<style scoped>
.modal-content {
  max-height: 75vh;
  overflow-y: auto;
}
</style>
