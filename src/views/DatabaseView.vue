<template>
  <div v-if="selected">
    <bread-crumb :items="names" />
    <div
      class="d-flex align-items-center justify-content-between py-2 my-1 border-top border-bottom"
    >
      <LucideDatabase size="36px" color="gold" />
      <h2 class="m-0">{{ selected.display_name }}</h2>
      <div class="ms-auto">Banco de dados</div>
    </div>
    <div class="d-flex gap-3">
      <div class="col-9">
        <ExplorerHeader
          v-model:domain="selected.domain"
          v-model:layer="selected.layer"
          v-model:deleted="selected.deleted"
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
          <h5>Tabelas/Vistas</h5>
          <v-server-table
            :options="optionsTables"
            :columns="columnsTables"
            :key="`'tb'${selected.id}`"
            name="tables"
          >
            <template #actions>
              <row-list-action-buttons />
            </template>
            <template #database_schema="props">
              <router-link
                v-if="props.row.database_schema"
                :to="{ name: 'explore-schemas', params: { id: props.row.database_schema.id } }"
              >
                {{ props.row.database_schema.display_name }}
              </router-link>
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
              <router-link :to="{ name: 'explore-tables', params: { id: props.row.id } }">
                {{ props.row.display_name }}
              </router-link>
            </template>
          </v-server-table>

          <h5 class="mt-4">Esquemas</h5>
          <v-server-table :options="options" :columns="columns" :key="selected.id" name="schemas">
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
              <router-link :to="{ name: 'explore-schemas', params: { id: props.row.id } }">
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
import { LucideDatabase } from 'lucide-vue-next'
import { inject, computed, watch } from 'vue'
import { useFetch } from '@/composables/useFetch.js'
import { useVServerTable } from '@/composables/useVServerTable.js'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import ExplorerHeader from '@/components/ExplorerHeader.vue'
import CollapsableEditor from '@/components/ui/CollapsableEditor.vue'
import ExplorerRightBar from '@/components/ExplorerRightBar.vue'
import { useUpdateAssetProperty } from '@/composables/useUpdateAssetProperty'
import { useToast } from 'vue-toast-notification'

const toast = useToast()

const selected = inject('selected')
defineProps(['id'])

const names = computed(() => {
  return [
    {
      label: 'Explorar',
      route: 'explore',
    },
    {
      label: selected.value.provider?.display_name,
      route: 'explore-database-providers',
      id: selected.value.provider?.id,
    },
    {
      label: selected.value.display_name,
      route: 'explore-databases',
      id: selected.value.id,
    },
  ]
})
const loadTables = async (options) => {
  const { data, fetchData } = useFetch(
    `/tables/?database_id=${selected.value.id}&query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}&page_size=${options.limit || 10}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}

const loadSchemas = async (options) => {
  const { data, error, isLoading, fetchData } = useFetch(
    `/schemas/?database_id=${selected.value.id}&query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}
const { columns, options } = useVServerTable()
  .columns('display_name', 'domain', 'layer')
  .headSkin('table-primary')
  .requestFunction(loadSchemas)
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

const { columns: columnsTables, options: optionsTables } = useVServerTable()
  .columns('display_name', 'domain', 'layer', 'database_schema')
  .headSkin('table-primary')
  .requestFunction(loadTables)
  .headings({
    database_schema: 'Esquema',
    display_name: 'Nome',
    updated_at: 'Atualizado em',
    actions: 'Ações',
    domain: 'Domínio',
    layer: 'Camada',
  })
  .filterable('query')
  .sortable('display_name')
  .build()

const { asset, update } = useUpdateAssetProperty('databases')
const updateProperty = async (name, value) => {
  asset.value = selected.value
  await update(name, name !== 'deleted' ? value?.id : value)
}
</script>
<style scoped>
.provider-logo {
  width: auto;
  height: 56px;
}
</style>
