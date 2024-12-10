<template>
  <div class="mx-2">
    <list-view-header title="Tags" />
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
import ListViewHeader from '@/components/ui/ListViewHeader.vue'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'

const loadTags = async (options) => {
  const { data, fetchData } = useFetch(
    `/tags/?query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}

const { columns, options } = useVServerTable()
  .name('tags')
  .columns('name', 'description', 'actions')
  .headSkin('table-primary')
  .headings({
    name: 'Nome',
    description: 'Descrição',
    actions: 'Ações',
  })
  .skin('table table-bordered table-sm table-hover')
  .requestFunction(loadTags)
  .filterable('query')
  .sortable('name')
  .build()

const handleDelete = (row) => {
  console.debug(row)
}
const handleEdit = (row) => {
  console.debug(row)
}
</script>
