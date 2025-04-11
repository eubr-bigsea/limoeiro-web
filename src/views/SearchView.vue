<template>
  <div class="mx-2 my-2 user-select-none">
    <bread-crumb :items="names" />
    <list-view-header title="Pesquisa de ativos" :show-add="false" />
    <div class="d-flex gap-1">
      <div class="w-100">
        <v-server-table
          :options="options"
          :columns="columns"
          ref="listing"
          :show-filter="false"
          name="search-asset"
          @loaded="loadedQueryResults"
        >
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
                  :items="displayItems"
                  :show-commands="false"
                  :single="true"
                  :displayBadge="false"
                  v-model="display"
                  keyProp="id"
                  valueProp="name"
                  button-class="btn-sm btn-light"
                  button-title="Exibir"
                >
                  <template #default="{ item }">
                    {{ item.name }}
                  </template>
                </SelectableList>
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
                  :items="domainList"
                  v-model="domains"
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
                  :items="layerList"
                  v-model:modelValue="layers"
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
                  :items="responsibleList"
                  v-model:modelValue="responsibles"
                  keyProp="id"
                  valueProp="name"
                  button-class="btn-sm btn-light"
                  button-title="Responsáveis"
                  mode="search"
                  @search="loadResponsibles"
                >
                  <template #default="{ item }">
                    {{ item.name }}
                  </template>
                </SelectableList>
              </div>
              <div>
                <SelectableList
                  :items="tagList"
                  v-model:modelValue="tags"
                  keyProp="id"
                  valueProp="name"
                  button-class="btn-sm btn-light"
                  button-title="Tags"
                  mode="search"
                  @search="loadTags"
                >
                  <template #default="{ item }">
                    {{ item.name }}
                  </template>
                </SelectableList>
              </div>
              <!-- <div>
              <SelectableList
                :items="options1"
                v-model:modelValue="tags"
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
                v-model:modelValue="responsibles"
                keyProp="id"
                valueProp="name"
                button-class="btn-sm btn-light"
                button-title="Responsáveis"
              >
                <template #default="{ item }">
                  {{ item.name }}
                </template>
              </SelectableList>
            </div> -->
              <div class="float-end ms-auto">
                <button class="btn btn-sm btn-success" @click="search">Pesquisar</button>
                <button class="btn btn-sm btn-secondary ms-2" @click="clearFilters">
                  Limpar filtros
                </button>
              </div>
            </div>
          </template>
          <template #name="props">
            <div v-if="props.row.asset_type === 'provider'">
              <router-link
                :to="{ name: 'explore-database-providers', params: { id: props.row.id } }"
              >
                {{ props.row.name }}
              </router-link>
            </div>
            <div v-else-if="props.row.asset_type === 'database'">
              <router-link :to="{ name: 'explore-databases', params: { id: props.row.id } }">
                {{ props.row.name }}
              </router-link>
            </div>
            <div v-else-if="props.row.asset_type === 'table'">
              <router-link :to="{ name: 'explore-tables', params: { id: props.row.id } }">
                {{ props.row.name }}
              </router-link>
            </div>
            <div v-else-if="props.row.asset_type === 'schema'">
              <router-link :to="{ name: 'explore-schemas', params: { id: props.row.id } }">
                {{ props.row.name }}
              </router-link>
            </div>
          </template>
          <template #deleted="props">
            {{ props.row.deleted ? 'Sim' : 'Não' }}
          </template>
          <template #domain="props">
            {{ props.row.domain?.name }}
          </template>
          <template #layer="props">
            {{ props.row.layer?.name }}
          </template>
          <template #updated_at="props">
            {{ $formatDateHourSeconds(props.row.updated_at) }}
          </template>
          <template #hierarchy="props">
            <span v-if="props.row.asset_type === 'provider'" class="me-2">
              <LucideServer size="14" class="me-1" />
              <router-link
                :to="{ name: 'explore-database-providers', params: { id: props.row.id } }"
              >
                {{ props.row.name }}
              </router-link>
            </span>
            <span v-else-if="props.row.tree?.provider?.id" class="me-2">
              <LucideServer size="14" class="me-1" />
              <router-link
                :to="{
                  name: 'explore-database-providers',
                  params: { id: props.row.tree?.provider?.id },
                }"
              >
                {{ props.row.tree?.provider?.name }}
              </router-link>
            </span>

            <span v-if="props.row.tree?.database?.id" class="me-2">
              <LucideDatabase size="15" class="me-1" />
              <router-link
                :to="{ name: 'explore-databases', params: { id: props.row.tree.database.id } }"
              >
                {{ props.row.tree.database.name }}
              </router-link>
            </span>
            <span v-if="props.row.tree?.schema?.id" class="me-2">
              <LucideFolder size="15" class="me-1" />
              <router-link
                :to="{ name: 'explore-schemas', params: { id: props.row.tree.schema.id } }"
              >
                {{ props.row.tree.schema.name }}
              </router-link>
            </span>
          </template>
          <template #asset_type="props">
            <LucideTable2 v-if="props.row.asset_type == 'table'" size="15" color="#B59410" />
            <LucideDatabase
              v-else-if="props.row.asset_type == 'database'"
              size="15"
              color="#B59410"
            />
            <LucideServer
              v-else-if="props.row.asset_type == 'provider'"
              size="15"
              color="#B59410"
            />
            <LucideFolder v-else-if="props.row.asset_type == 'schema'" size="15" fill="#B59410" />
            {{ props.row.asset_type }}
          </template>
        </v-server-table>
      </div>
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
import { getContacts } from '@/services/contact'
import { LucideFolder, LucideServer, LucideDatabase, LucideTable2 } from 'lucide-vue-next'
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
const displayItems = ref([
  { id: 'A', name: 'Tudo' },
  { id: 'N', name: 'Apenas habilitados' },
  { id: 'Y', name: 'Apenas desabilitados' },
])

const domains = ref([])
const domainList = ref([])
const loadDomains = async () => {
  const { data, fetchData } = useFetch(`/domains/`)
  await fetchData()
  domainList.value = data.value.items
}

const layers = ref([])
const layerList = ref([])

const loadLayers = async () => {
  const { data, fetchData } = useFetch(`/layers/`)
  await fetchData()
  layerList.value = data.value.items
}

const responsibleList = ref([])
const responsibles = ref([])
const loadResponsibles = async (search) => {
  const { data, fetchData } = useFetch(`/contacts/?query=${search}`)
  await fetchData()
  responsibleList.value = data.value.items
}
const tagList = ref([])
const tags = ref([])
const loadTags = async (search) => {
  const { data, fetchData } = useFetch(`/tags/?query=${search}`)
  await fetchData()
  tagList.value = data.value.items
}

onMounted(() => {
  Promise.all([loadDomains(), loadLayers()])
})

const loadAssets = async (options) => {
  const params = {
    query: options.query || '',
    sort_by: options.orderBy,
    sort_order: options.ascending ? 'asc' : 'desc',
    page: options.page,
    page_size: options.limit,
  }
  Object.assign(params, options.customQueries)
  const { data, fetchData } = useFetch(`/assets/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}

const { columns, options } = useVServerTable()
  .name('layers')
  .columns(
    'asset_type',
    'name',
    'hierarchy',
    'description',
    'domain',
    'layer',
    'deleted',
    'updated_at',
  )
  .headSkin('table-secondary fw-bold')
  .headings({
    //display_name: 'Nome de exibição',
    name: 'Nome',
    description: 'Descrição',
    deleted: 'Desabilitado',
    asset_type: 'Tipo',
    hierarchy: 'Hierarquia',
    domain: 'Domínio',
    layer: 'Camada',
    updated_at: 'Atualizado em',
  })
  .saveState(true)
  .requestFunction(loadAssets)
  .filterable('query')
  .sortable('name', 'display_name', 'asset_type', 'updated_at')
  .skin('table table-bordered table-sm table-hover align-middle')
  .columnsStyles({ actions: { width: '100px', 'text-align': 'center', background: 'red' } })
  .columnsClasses({
    actions: ['text-center'],
    asset_type: ['text-center'],
    deleted: ['text-center'],
  })
  .build()

const queryInput = ref()
onMounted(() => {
  queryInput.value.focus()
})
const query = ref()
const types = ref([])
const display = ref([])

const listing = ref()
const search = async () => {
  listing.value.setCurrentPage(1)
  listing.value.setFilter(query.value, {
    layer_id: layers.value.map((t) => t.id),
    domain_id: domains.value.map((t) => t.id),
    asset_type: types.value.map((t) => t.id),
    responsible_ids: responsibles.value.map((t) => t.id),
    tag_ids: tags.value.map((t) => t.id),
    display: display.value.length > 0 ? display.value[0]?.id : 'A',
  })
  listing.value.persist({
    layer_id: layers.value,
    domain_id: domains.value,
    asset_type: types.value,
    responsible_ids: responsibles.value,
    tag_ids: tags.value,
  })
}
const clearFilters = () => {
  query.value = ''
  types.value = []
  domains.value = []
  responsibles.value = []
  tags.value = []
  layers.value = []
  display.value = [{ id: 'A', name: 'Exibir' }]
  listing.value.setCurrentPage(1)
  listing.value.setFilter('', {
    layer_id: [],
    domain_id: [],
    asset_type: [],
    responsible_ids: [],
    tag_ids: [],
    display: 'A',
  })
  listing.value.persist({
    layer_id: [],
    domain_id: [],
    asset_type: [],
    responsible_ids: [],
    tag_ids: [],
  })
}
const loadedQueryResults = (params, persistedData) => {
  query.value = params.query
  display.value = params.customFilters?.display || [{ id: 'A', name: 'Exibir' }]
  types.value = persistedData?.asset_type || []
  domains.value = persistedData?.domain_id || []
  responsibles.value = persistedData?.responsible_ids || []
  tags.value = persistedData?.tag_ids || []
  layers.value = persistedData?.layer_id || []
  //console.debug(persistedData?.responsible_ids)
}

const contacts = ref([])
const contactIds = ref([])
const retrieveContacts = async (query) => {
  const { contacts, error } = await getContacts(query)
  return contacts
}
</script>
