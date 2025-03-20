<template>
  <div class="mx-2 my-2 user-select-none">
    <bread-crumb :items="names" />
    <list-view-header title="Pesquisa de ativos" :show-add="false" />

    <div>
      <v-server-table :options="options" :columns="columns" ref="listing" :show-filter="false">
        <template #deleted="props">
          {{ props.row.deleted ? 'Sim' : 'Não' }}
        </template>
        <template #customFilter="props">
          <div class="d-flex gap-1 border-bottom pb-3 pt-2">
            <div class="w-25">
              <input
                type="text"
                ref="queryInput"
                v-model="query"
                class="form-control form-control-sm"
                placeholder="parte do nome ou descrição"
              />
            </div>
            <div>
              <SelectableList
                :items="assetTypes"
                :show-commands="true"
                v-model="types"
                keyProp="id"
                valueProp="name"
                button-class="btn-sm btn-light"
                button-title="Tipos"
              >
                <template #default="{ item }">
                  {{ item.name }}
                </template>
              </SelectableList>
            </div>
            <div>
              <SelectableList
                :items="options1"
                v-model:modelValue="selectedItems"
                keyProp="id"
                valueProp="name"
                button-class="btn-sm btn-light"
                button-title="Domínios"
              >
                <template #default="{ item }">
                  {{ item.name }}
                </template>
              </SelectableList>
            </div>
            <div>
              <SelectableList
                :items="options1"
                v-model:modelValue="selectedItems"
                keyProp="id"
                valueProp="name"
                button-class="btn-sm btn-light"
                button-title="Camadas"
              >
                <template #default="{ item }">
                  {{ item.name }}
                </template>
              </SelectableList>
            </div>
            <div>
              <SelectableList
                :items="options1"
                v-model:modelValue="selectedItems"
                keyProp="id"
                valueProp="name"
                button-class="btn-sm btn-light"
                button-title="Tags"
              >
                <template #default="{ item }">
                  {{ item.name }}
                </template>
              </SelectableList>
            </div>
            <div>
              <SelectableList
                :items="options1"
                v-model:modelValue="selectedItems"
                keyProp="id"
                valueProp="name"
                button-class="btn-sm btn-light"
                button-title="Responsáveis"
              >
                <template #default="{ item }">
                  {{ item.name }}
                </template>
              </SelectableList>
            </div>
            <div class="float-end ms-auto">
              <button class="btn btn-sm btn-success" @click="search">Pesquisar</button>
            </div>
          </div>
        </template>
      </v-server-table>
    </div>
  </div>
</template>
<script setup>
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import ListViewHeader from '@/components/ui/ListViewHeader.vue'
import SelectableList from '@/components/ui/SelectableList.vue'
import VServerTable from '@/components/VServerTable.vue'
import { useFetch } from '@/composables/useFetch'
import { useVServerTable } from '@/composables/useVServerTable'
import { createQueryString } from '@/util'

import { onMounted, ref } from 'vue'
const names = [
  {
    label: 'Pesquisa de ativos',
    route: 'search',
  },
]
const assetTypes = ref([
  { id: 'provider', name: 'Provedor de banco de dados' },
  { id: 'database', name: 'Banco de dados' },
  { id: 'schema', name: 'Esquema' },
  { id: 'table', name: 'Tabela' },
  { id: 'model', name: 'Modelo' },
])
const options1 = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
])

const selectedItems = ref([])

const loadAssets = async (options) => {
  const params = {
    query: options.query || '',
    sort_by: options.orderBy,
    sort_order: options.ascending ? 'asc' : 'desc',
    page: options.page,
    page_size: options.limit,
  }
  Object.assign(params, options.customQueries)
  const qs = createQueryString(params)
  const { data, fetchData } = useFetch(`/assets/?${qs}`)
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}

const { columns, options } = useVServerTable()
  .name('layers')
  .columns('name', 'display_name', 'asset_type', 'description', 'deleted')
  .headSkin('table-secondary fw-bold')
  .headings({
    display_name: 'Nome de exibição',
    name: 'Nome',
    description: 'Descrição',
    deleted: 'Desabilitado',
    actions: 'Ações',
    asset_type: 'Tipo',
  })
  .requestFunction(loadAssets)
  .filterable('query')
  .sortable('name', 'display_name', 'asset_type')
  .skin('table table-bordered table-sm table-hover align-middle')
  .columnsStyles({ actions: { width: '100px', 'text-align': 'center', background: 'red' } })
  .columnsClasses({ actions: ['text-center'] })
  .build()

const queryInput = ref()
onMounted(() => {
  queryInput.value.focus()
})
const query = ref()
const types = ref([])

const listing = ref()
const search = async () => {
  listing.value.setCurrentPage(1)
  listing.value.setFilter(query.value, {
    layer_id: 'f31f21ff-79d9-469a-96d0-5ed9d00f3bfe',
    asset_type: types.value.map((t) => t.id),
  })
}
</script>
