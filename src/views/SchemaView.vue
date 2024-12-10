<template>
  <div v-if="selected">
    <div>
      <bread-crumb :items="names" />
      <div
        class="d-flex align-items-center justify-content-between py-2 my-1 border-top border-bottom gap-2"
      >
        <Folder size="36px" />
        <h2 class="mb-0">{{ selected.display_name }}</h2>
        <div class="ms-auto">Esquema de banco de dados</div>
      </div>
    </div>
    <div class="d-flex gap-5 my-2">
      <div class="d-flex gap-1 align-items-center">
        <Crown size="14px" />
        <span v-if="selected?.database?.domain">
          {{ selected.database.domain.display_name }} (herdado do banco de dados)
        </span>
        <span v-else>Nenhum domínio</span>
      </div>
      <div class="d-flex gap-1 align-items-center">
        <User size="14px" />
        <span v-if="selected.owner">
          {{ selected.owner }}
        </span>
        <span v-else>Nenhum responsável</span>
        <PencilLine size="14px" />
      </div>
      <div class="ms-auto">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" :checked="selected.deleted" />
          <label class="form-check-label" for="flexCheckDefault"> Desabilitado </label>
        </div>
      </div>
    </div>
    <div>
      <textarea class="form-control">{{ selected.description }}</textarea>
    </div>
    <div class="my-4">
      <h5>Tabelas</h5>
      <v-server-table :options="options" :columns="columns" :key="selected.id" name="tables">
        <template #actions>
          <row-list-action-buttons />
        </template>
        <template #domain="props">
          <router-link v-if="props.row.domain" :to="{ name: 'domains' }">
            {{ props.row.domain.display_name }}
          </router-link>
        </template>
        <template #layer="props">
          <router-link v-if="props.row.layer" :to="{ name: 'layers' }">
            {{ props.row.layer.display_name }}
          </router-link>
        </template>
        <template #display_name="props">
          <router-link :to="{ name: 'explore-tables', params: { id: props.row.id } }">
            {{ props.row.display_name }}
          </router-link>
        </template>
      </v-server-table>
    </div>
  </div>
</template>
<script setup>
import { Folder } from 'lucide-vue-next'
import { inject, computed } from 'vue'
import { Crown, Layers, PencilLine, User } from 'lucide-vue-next'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import { useFetch } from '@/composables/useFetch.js'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import { useVServerTable } from '@/composables/useVServerTable.js'

defineProps(['id'])
const selected = inject('selected')
const names = computed(() => {
  return [
    {
      label: 'Explorar',
      route: 'explore',
    },
    {
      label: selected.value.database?.provider?.display_name,
      route: 'explore-database-providers',
      id: selected.value.database?.provider?.id,
    },
    {
      label: selected.value.database?.display_name,
      route: 'explore-databases',
      id: selected.value.database?.id,
    },
    {
      label: selected.value?.display_name,
      route: 'explore-schemas',
      id: selected.value.id,
    },
  ]
})
const loadTables = async (options) => {
  console.debug(options)
  const { data, fetchData } = useFetch(
    `/tables/?schema_id=${selected.value.id}&query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}&page_size=${options.limit || 10}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}
const { columns, options } = useVServerTable()
  //.filterable('id')
  .columns('display_name', 'domain', 'layer')
  .headSkin('table-primary')
  .requestFunction(loadTables)
  .headings({
    display_name: 'Nome',
    updated_at: 'Atualizado em',
    actions: 'Ações',
    domain: 'Domínio',
    layer: 'Camada',
  })
  .filterable('query')
  .sortable('display_name')
  .build()
</script>
