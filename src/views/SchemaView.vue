<template>
  <div v-if="selected">
    <div>
      <bread-crumb :items="names" />
      <div
        class="d-flex align-items-center justify-content-between py-2 my-1 border-top border-bottom"
      >
        <LucideFolder size="36px" fill="gold" />
        <h2 class="mb-0">{{ selected.display_name }}</h2>
        <div class="ms-auto">Esquema de banco de dados</div>
      </div>
    </div>
    <div class="d-flex gap-3">
      <div class="col-9">
        <ExplorerHeader
          v-model:domain="selected.domain"
          v-model:layer="selected.layer"
          v-model:deleted="selected.deleted"
          :notes="selected.notes"
          @update:domain="(event) => updateProperty('domain_id', event)"
          @update:layer="(event) => updateProperty('layer_id', event)"
          @update:deleted="(event) => updateProperty('deleted', event)"
        />
        <CollapsableEditor
          v-model="selected.description"
          @change="(desc) => updateProperty('description', desc)"
          missing="<sem descrição fornecida>"
        />
        <div class="my-4">
          <h5>Tabelas</h5>
          <v-server-table :options="options" :columns="columns" :key="selected.id" name="tables">
            <template #actions>
              <row-list-action-buttons />
            </template>
            <template #domain="props">
              <router-link v-if="props.row.domain" :to="{ name: 'domains' }">
                {{ props.row.domain.name }}
              </router-link>
            </template>
            <template #layer="props">
              <router-link v-if="props.row.layer" :to="{ name: 'layers' }">
                {{ props.row.layer.name }}
              </router-link>
            </template>
            <template #display_name="props">
              <LucideTable2 v-if="props.row.type == 'REGULAR'" size="15" color="navy" />
              <LucideEye v-if="props.row.type == 'VIEW'" size="15" color="navy" />
              <router-link
                class="ms-1"
                :to="{ name: 'explore-tables', params: { id: props.row.id } }"
              >
                {{ props.row.display_name }}
              </router-link>
            </template>
          </v-server-table>
        </div>
      </div>
      <div class="w-25 ps-2 border-start explorer-side-container">
        <ExplorerRightBar :asset-id="selected.id" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { LucideFolder, LucideTable2, LucideEye } from 'lucide-vue-next'
import { inject, computed } from 'vue'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import { useFetch } from '@/composables/useFetch.js'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import { useVServerTable } from '@/composables/useVServerTable.js'
import ExplorerHeader from '@/components/ExplorerHeader.vue'
import CollapsableEditor from '@/components/ui/CollapsableEditor.vue'
import ExplorerRightBar from '@/components/ExplorerRightBar.vue'
import { useUpdateAssetProperty } from '@/composables/useUpdateAssetProperty'
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
    `/tables/?database_schema_id=${selected.value.id}&query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}&page_size=${options.limit || 10}`,
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

const { asset, update } = useUpdateAssetProperty('schemas')
const updateProperty = async (name, value) => {
  asset.value = selected.value
  await update(name, value)
}
</script>
