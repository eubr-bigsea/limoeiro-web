<template>
  <div class="mx-2">
    <bread-crumb :items="names" />
    <list-view-header title="Tags" @add="handleAdd" />
    <v-server-table :options="options" :columns="columns" ref="listing">
      <template #actions="props">
        <row-list-action-buttons
          :row="props.row"
          :edit-link="{
            name: 'edit-tag',
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
import { useVServerTable } from '@/composables/useVServerTable'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import ListViewHeader from '@/components/ui/ListViewHeader.vue'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import { useFetchResponseHandler } from '@/composables/useFetchResponseHandler'

const router = useRouter()
const { handleFetchResponse } = useFetchResponseHandler()

const loadTags = async (options) => {
  const queryParams = {
    query: options.query || '',
    sort_by: options.orderBy,
    sort_order: options.ascending ? 'asc' : 'desc',
    page: options.page,
    page_size: options.limit,
  }
  const { data, fetchData } = useFetch(
    `/tags/?${new URLSearchParams(queryParams).toString()}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}

const { columns, options } = useVServerTable()
  .name('tags')
  .columns('name', 'description', 'deleted', 'applicable_to', 'actions')
  .headSkin('table-secondary fw-bold')
  .headings({
    name: 'Nome',
    description: 'Descrição',
    deleted: 'Desabilitado',
    applicable_to: 'Aplicável a',
    actions: 'Ações',
  })
  .requestFunction(loadTags)
  .filterable('query')
  .sortable('name')
  .skin('table table-bordered table-sm table-hover align-middle')
  .columnsStyles({ actions: { width: '150px' } })
  .columnsClasses({ actions: ['text-center'] })
  .build()
const listing = ref()
const handleDelete = async (row) => {
  const { data, fetchData, error } = useFetch(`/tags/${row.id}`, { method: 'DELETE' })
  await fetchData()
  handleFetchResponse(error, data, {
    editing: false,
    state: null,
    successMessage: 'Registro excluído com sucesso!',
    redirectRoute: {
      name: 'tags',
    },
  })
  listing.value.refresh()
}
const handleAdd = () => {
  router.push({ name: 'add-tag' })
}
const names = ref([
  {
    label: 'Tags',
    route: 'tags',
  },
])
</script>
