<template>
  <div class="mx-2 my-2">
    <bread-crumb :items="names" />
    <list-view-header title="Execuções" :showAdd="false" />
    <v-server-table :options="options" :columns="columns" ref="listing" name="executions">
      <template #actions="props">
        <row-list-action-buttons :row="props.row" @delete="handleDelete" />
        <button
          class="btn btn-outline-success ms-1 btn-sm rounded-5"
          @click="displayLogs(props.row.id)"
          title="Ver detalhes"
        >
          <LucideEye size="15" /> Detalhes
        </button>
      </template>
      <template #created_at="props">
        {{ $formatDateHourSeconds(props.row.created_at) }}
      </template>
      <template #updated_at="props">
        {{ $formatDateHourSeconds(props.row.created_at) }}
      </template>
      <template #ingestion="props">
        <router-link
          :to="{ name: 'explore-database-providers', params: { id: props.row.ingestion.id } }"
        >
          {{ props.row.ingestion.name }}
        </router-link>
      </template>
    </v-server-table>
    <ingestion-log-view ref="logInfo" />
  </div>
</template>
<script setup>
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import ListViewHeader from '@/components/ui/ListViewHeader.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import VServerTable from '@/components/VServerTable.vue'
import { useFetch } from '@/composables/useFetch.js'
import { useFetchResponseHandler } from '@/composables/useFetchResponseHandler'
import { useVServerTable } from '@/composables/useVServerTable'
import IngestionLogView from '@/views/IngestionLogView.vue'
import { LucideEye } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { handleFetchResponse } = useFetchResponseHandler()

const loadDomains = async (options) => {
  const { data, fetchData } = useFetch(
    `/executions/?query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}
const { columns, options } = useVServerTable()
  .name('executions')
  .columns('id', 'created_at', 'updated_at', 'status', 'ingestion', 'actions')
  .sortable('id', 'created_at', 'updated_at', 'status', 'ingestion')
  .headSkin('table-secondary fw-bold')
  .headings({
    created_at: 'Criado em',
    updated_at: 'Atualizado em',
    ingestion: 'Ingestão',
    actions: 'Ações',
    status: 'Situação',
  })
  .requestFunction(loadDomains)
  .filterable('query')
  .skin('table table-bordered table-sm table-hover align-middle')
  .columnsStyles({})
  .columnsClasses({ actions: ['text-center'] })
  .build()

const listing = ref()
const handleDelete = async (row) => {
  const { data, fetchData, error } = useFetch(`/executions/${row.id}`, { method: 'DELETE' })
  await fetchData()
  handleFetchResponse(error, data, {
    editing: false,
    state: null,
    successMessage: 'Registro excluído com sucesso!',
    redirectRoute: {
      name: 'executions',
    },
  })
  listing.value.refresh()
}
const names = ref([
  {
    label: 'Execuções',
    route: 'executions',
  },
])
const logInfo = ref()

const displayLogs = (executionId) => {
  logInfo.value.displayModal(executionId)
}
</script>
