<template>
  <div class="mx-2 my-2">
    <bread-crumb :items="names" />
    <list-view-header title="Execuções" :showAdd="false" />
    <v-server-table :options="options" :columns="columns" ref="listing" name="executions" :use-form="false">
      <template #afterFilter>
        <div class="d-flex">
          <div class="ms-4 w-50">
            <label for="provider" class="font-weight-bold">Provedor</label>
            <LookupComponent
              class="mb-2"
              v-model="provider"
              :fetchFunction="retrieveProviders"
              label="name"
              value="id"
              @change="handleProviderChange"
            />
          </div>
          <div class="ms-4 w-50">
            <label for="ingestion" class="font-weight-bold">Processo de Ingestão</label>
            <select
              v-model="ingestion"
              class="form-control form-select form-select-sm"
              name="ingestions"
              :disabled="provider == null"
            >
              <option key="" value=""></option>
              <option v-for="ingestion in ingestionsList" :key="ingestion.id" :value="ingestion.id">
                {{ ingestion.name }}
              </option>
            </select>
          </div>
        </div>
      </template>
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
          :to="{ name: 'explore-database-providers', params: { id: props.row.ingestion.provider_id } }"
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
import LookupComponent from '@/components/ui/LookupComponent.vue'
import { useFetch } from '@/composables/useFetch.js'
import { useFetchResponseHandler } from '@/composables/useFetchResponseHandler'
import { useVServerTable } from '@/composables/useVServerTable'
import IngestionLogView from '@/views/IngestionLogView.vue'
import { LucideEye } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { handleFetchResponse } = useFetchResponseHandler()

const loadExecutions = async (options) => {
  const { data, fetchData } = useFetch(
    `/executions/?query=${options.query || ''}${ingestion.value ? "&ingestion_id="+ingestion.value : ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}`,
  )
  await fetchData()
  
  return { data: data.value.items, count: data.value.count }
}

const provider = ref(null)
const ingestionsList = ref([])
const ingestion = ref(null)

const loadProvider = async (id) => {
  const { data, fetchData } = useFetch(`/database-providers/${id}`)
  await fetchData()
  provider.value = data.value
  await loadIngestions()
  ingestion.value = route.query.ingestionId || null
}

const loadIngestions = async () => {
  const { data, fetchData } = useFetch(`/ingestions/?${provider.value ? "provider_id="+provider.value.id : ''}&sort_by=name`)
  await fetchData()
  ingestionsList.value = data.value.items
}

const retrieveProviders = async (query) => {
  const { data, fetchData } = useFetch(
    `/database-providers/?query=${query}&sort_by=name&page_size=10`,
  )
  await fetchData()
  return data.value.items.map(({ id, name }) => ({ id, name }))

}

const handleProviderChange = () => {  
  if (provider.value == null){
    ingestion.value = null
    ingestionsList.value = []
  }
  else {
    loadIngestions()
  }
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
  .requestFunction(loadExecutions)
  .filterable('query')
  .skin('table table-bordered table-sm table-hover align-middle')
  .columnsStyles({})
  .columnsClasses({ actions: ['text-center'] })
  .build()

const listing = ref()

const handleIngestionChange = () => {
  listing.value.refresh()
}

watch(ingestion, handleIngestionChange)

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

onMounted(() => {
  if (route.query.id) {
    loadProvider(route.query.id)
  }
  else {
    provider.value = null
    ingestionsList.value = []
  }
  //setInterval(()=>{listing.value.refresh()},3000);
  //loadIngestions()
})
</script>
