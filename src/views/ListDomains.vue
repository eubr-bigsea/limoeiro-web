<template>
  <div class="mx-2 my-2">
    <bread-crumb :items="names" />
    <list-view-header title="Domínios" @add="handleAdd" />
    <v-server-table :options="options" :columns="columns" ref="listing">
      <template #actions="props">
        <row-list-action-buttons
          :row="props.row"
          :edit-link="{
            name: 'edit-domain',
            params: { id: props.row.id },
          }"
          @delete="handleDelete"
        />
      </template>
      <template #deleted="props">
        {{ props.row.deleted ? 'Sim' : 'Não' }}
      </template>
    </v-server-table>
  </div>
</template>
<script setup>
import { useFetch } from '@/composables/useFetch.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFetchResponseHandler } from '@/composables/useFetchResponseHandler'
import { useVServerTable } from '@/composables/useVServerTable'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import ListViewHeader from '@/components/ui/ListViewHeader.vue'

const router = useRouter()
const { handleFetchResponse } = useFetchResponseHandler()

const loadDomains = async (options) => {
  const { data, fetchData } = useFetch(
    `/domains/?query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}
const { columns, options } = useVServerTable()
  .name('domains')
  .columns('name', 'description', 'deleted', 'actions')
  .headSkin('table-secondary fw-bold')
  .headings({
    name: 'Nome',
    deleted: 'Desabilitado',
    description: 'Descrição',
    actions: 'Ações',
  })
  .requestFunction(loadDomains)
  .filterable('query')
  .sortable('name')
  .skin('table table-bordered table-sm table-hover align-middle')
  .columnsStyles({ actions: { width: '150px', 'text-align': 'center', background: 'red' } })
  .columnsClasses({ actions: ['text-center'] })
  .build()

const listing = ref()
const handleDelete = async (row) => {
  const { data, fetchData, error } = useFetch(`/domains/${row.id}`, { method: 'DELETE' })
  await fetchData()
  handleFetchResponse(error, data, {
    editing: false,
    state: null,
    successMessage: 'Registro excluído com sucesso!',
    redirectRoute: {
      name: 'domains',
    },
  })
  listing.value.refresh()
}
const handleAdd = () => {
  router.push({ name: 'add-domain' })
}
const names = ref([
  {
    label: 'Domínios',
    route: 'domains',
  },
])
</script>
