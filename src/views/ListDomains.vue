<template>
  <div class="mx-2 my-2">
    <list-view-header title="Domínios" />
    <v-server-table :options="options" :columns="columns">
      <template #actions="props">
        <row-list-action-buttons @edit="handleEdit" @delete="handleDelete" :row="props.row" />
      </template>
    </v-server-table>
  </div>
</template>
<script setup>
import { useFetch } from '@/composables/useFetch.js'

import { useVServerTable } from '@/composables/useVServerTable'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import ListViewHeader from '@/components/ui/ListViewHeader.vue'

const loadDomains = async (options) => {
  const { data, fetchData } = useFetch(
    `/domains/?query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}
const { columns, options } = useVServerTable()
  .name('domains')
  .columns('display_name', 'actions')
  .headSkin('table-secondary fw-bold')
  .headings({
    display_name: 'Nome',
    actions: 'Ações',
  })
  .skin('table table-bordered table-sm table-hover')
  .requestFunction(loadDomains)
  .filterable('query')
  .sortable('display_name')
  .build()

const handleDelete = (row) => {
  console.debug(row)
}
const handleEdit = (row) => {
  console.debug(row)
}
</script>
