<template>
  <div class="mx-2">
    <bread-crumb :items="names" />
    <list-view-header title="Grupos" @add="handleAdd" />
    <v-server-table :options="options" :columns="columns" ref="listing">
      <template #actions="props">
        <row-list-action-buttons
          :row="props.row"
          :edit-link="{
            name: 'edit-user',
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
import ListViewHeader from '@/components/ui/ListViewHeader.vue'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useFetchResponseHandler } from '@/composables/useFetchResponseHandler'

const router = useRouter()
const { handleFetchResponse } = useFetchResponseHandler()

const loadLayers = async (options) => {
  const { data, fetchData } = useFetch(
    `/users/?query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}

const { columns, options } = useVServerTable()
  .name('users')
  .columns('name', 'login', 'deleted', 'actions')
  .headSkin('table-secondary fw-bold')
  .headings({
    name: 'Nome',
    login: 'Login',
    deleted: 'Desabilitado',
    actions: 'Ações',
  })
  .requestFunction(loadLayers)
  .filterable('query')
  .sortable('name')
  .skin('table table-bordered table-sm table-hover align-middle')
  .columnsStyles({ actions: { width: '150px', 'text-align': 'center', background: 'red' } })
  .columnsClasses({ actions: ['text-center'] })
  .build()

const listing = ref()
const handleDelete = async (row) => {
  const { data, fetchData, error } = useFetch(`/users/${row.id}`, { method: 'DELETE' })
  await fetchData()
  handleFetchResponse(error, data, {
    editing: false,
    state: null,
    successMessage: 'Registro excluído com sucesso!',
    redirectRoute: {
      name: 'users',
    },
  })
  listing.value.refresh()
}
const handleAdd = () => {
  router.push({ name: 'add-role' })
}
const names = ref([
  {
    label: 'Usuários',
    route: 'users',
  },
])
</script>
