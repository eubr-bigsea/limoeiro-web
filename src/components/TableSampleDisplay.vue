<template>
  <table class="table table-striped table-bordered">
    <thead class="bg-primary text-white">
      <tr>
        <th>Data</th>
        <th>Visível?</th>
        <th class="text-center">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="sample in samples" :key="sample.id">
        <td>{{ $formatDateHour(sample.date) }}</td>
        <td>{{ sample.is_visible ? 'Sim' : 'Não' }}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-danger me-1" @click="handleDeleteClick(sample)">
            <LucideTrash2 size="15" />
          </button>
          <button
            v-if="sample.is_visible"
            class="btn btn-sm btn-primary me-1"
            @click="display(sample)"
          >
            <LucideEye size="15" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <ModalWindow
    ref="modal"
    :show-cancel-button="false"
    modal-class="modal-fullscreen"
    title="Amostra"
    ok-button-label="Fechar e retornar"
  >
    <template #modal-title>
      <LucideEye fill="lightblue" />
      <h5 class="modal-title">Amostra</h5>
    </template>
    <template #body>
      <p>{{ $formatDateHour(sampleData.date) }}</p>
      <div class="sample">
        <table class="table table-sm table-striped sample table-bordered">
          <thead>
            <tr>
              <th v-for="field in sampleData.content.fields" :key="field" class="sample">
                {{ field }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, i) in sampleData.content.records.slice(0, 100)" :key="i">
              <td v-for="(col, j) in record">{{ col }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </ModalWindow>
  <confirmation-dialog
    ref="confirm"
    message="Deseja excluir este registro?"
    @confirmed="handleConfirmed"
  />
</template>
<script setup>
import { useFetch } from '@/composables/useFetch'
import { LucideEye, LucideTrash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import ConfirmationDialog from './ui/ConfirmationDialog.vue'
import ModalWindow from './ui/ModalWindow.vue'
const props = defineProps({
  tableId: { required: true, type: String },
})

const samples = ref([])
const showSamples = async () => {
  const { data, fetchData } = useFetch(`/samples/?database_table_id=${props.tableId}&sort_by=date`)
  await fetchData()
  samples.value = data.value.items
}
const confirm = ref()
const selected = ref(null)
const handleDeleteClick = (item) => {
  confirm.value.show()
  selected.value = item
}
const handleConfirmed = async (item) => {
  await deleteSample()
}
const deleteSample = async () => {
  const { fetchData } = useFetch(`/samples/${selected.value.id}`, { method: 'DELETE' })
  await fetchData()
  showSamples()
}

const sampleData = ref()
const modal = ref()
const display = async (sample) => {
  const { data, fetchData } = useFetch(`/samples/${sample.id}`)
  await fetchData()
  
  data.value.content.records = data.value.content
  if (data.value.content.records.length > 0) {
    data.value.content.fields = Object.keys(data.value.content.records[0])
  } else {
    data.value.content.fields = []
  }

  sampleData.value = data.value
  modal.value.show()
}
onMounted(() => {
  showSamples()
})
</script>
<style scoped>
div.sample {
  overflow: auto;
}
table.sample {
  font-size: 0.9em;
}
table.sample td,
table.sample th {
  min-width: 80px;
}
table.sample th {
  vertical-align: top;
  text-align: center;
  background: #666;
  color: #fff;
}
</style>
