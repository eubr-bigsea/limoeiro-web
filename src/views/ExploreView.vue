<template>
  <div>
    <div class="container-fluid">
      <div class="row vh-100">
        <div v-if="false" class="col-md-4 col-lg-3 border-end">
          <h5>Artefatos</h5>
          <div v-if="false">
            <loader-circle class="w-6 h-6 text-blue-500 spin" />
          </div>
          <div v-else>
            <tree-view
              v-if="false"
              @update="handleUpdate"
              @toggle-node="handleToggleNode"
              :tree="tree"
              :selected="selected"
            />
          </div>
        </div>
        <!--
        <div class="col-md-3 col-lg-2 border-end">
          <h5>Artefatos</h5>
          <div>Teste Teste</div>
        </div>
        -->
        <div class="col-md-12 col-lg-12">
          <router-view v-slot="{ Component }">
            <transition v-if="Component" name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
            <template v-else>
              <div class="my-4 row">
                <div class="col-6">
                  <h5>Provedores de bancos de dados</h5>
                  <v-server-table :options="options" :columns="columns">
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
                      <router-link
                        :to="{ name: 'explore-database-providers', params: { id: props.row.id } }"
                      >
                        {{ props.row.display_name }}
                      </router-link>
                    </template>
                  </v-server-table>
                </div>
                <div class="col-6">
                  <h5>Modelos de Inteligência Artificial</h5>
                  <v-server-table :options="modelOptions" :columns="modelColumns">
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
                      <router-link
                        :to="{ name: 'explore-ia-models', params: { id: props.row.id } }"
                      >
                        {{ props.row.display_name }}
                      </router-link>
                    </template>
                  </v-server-table>
                </div>
              </div>
            </template>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import TreeView from '@/components/TreeView.vue'
import { useFetch } from '@/composables/useFetch.js'
import { LoaderCircle } from 'lucide-vue-next'
import { ref, provide, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import { useVServerTable } from '@/composables/useVServerTable.js'

const route = useRoute()
const databaseProviders = ref()
const databases = ref()
const schemas = ref()
const tables = ref()

const getData = (url) => {
  return useFetch(url)
}

const tree = ref([])
const selected = ref()
const handleUpdate = async (level, key) => {
  if (level === 0) {
    const { data, fetchData } = getData('/database-providers/')
    await fetchData()
    databaseProviders.value = data.value

    tree.value = databaseProviders.value.items.map((provider) => ({
      id: provider.id,
      label: provider.display_name,
      route: 'explore-databases-provider',
      type: provider.provider_type.id,
    }))
  }
}
const handleToggleNode = async (obj, type) => {
  if (type == 'database-provider') {
    const { data, error, isLoading, fetchData } = getData(`/databases/?provider_id=${obj.id}`)
    await fetchData()
    databases.value = data.value
    const node = tree.value.find((provider) => provider.id === obj.id)
    node.expanded = true
    node['databases'] = databases.value.items.map((db) => ({
      id: db.id,
      label: db.display_name,
      route: 'explore-database',
      parent: obj.id,
    }))
  } else if (type === 'database') {
    const { data, error, isLoading, fetchData } = getData(`/schemas/?database_id=${obj.id}`)
    await fetchData()
    schemas.value = data.value
    const node = tree.value
      .find((provider) => provider.id === obj.parent)
      .databases.find((db) => db.id === obj.id)
    node.expanded = true
    node['schemas'] = schemas.value.items.map((schema) => ({
      id: schema.id,
      label: schema.display_name,
      route: 'explore-schema',
      parent: obj.id,
      grandparent: obj.parent,
    }))
  } else if (type === 'schema') {
    const { data, error, isLoading, fetchData } = getData(`/tables/?database_schema_id=${obj.id}`)
    await fetchData()
    tables.value = data.value
    const node = tree.value
      .find((provider) => provider.id === obj.grandparent)
      .databases.find((db) => db.id === obj.parent)
      .schemas.find((schema) => schema.id === obj.id)

    node.expanded = true
    node['tables'] = tables.value.items.map((table) => ({
      id: table.id,
      label: table.display_name,
      route: 'explore-table',
    }))
  }
}

const updateAfterRouteChange = async (newRoute, updateSelected, updateParents) => {
  // This is called when the route changes
  const [child, id] = newRoute.split('/').slice(-2)
  if (
    child === 'database-providers' ||
    child === 'databases' ||
    child === 'schemas' ||
    child === 'tables' ||
    child === 'ia-models'
  ) {
    const { data, error, isLoading, fetchData } = getData(`/${child}/${id}`)
    await fetchData()
    if (updateSelected) {
      selected.value = data.value
    }
    if (updateParents) {
      const updateTree = []
      if (child === 'tables') {
        updateTree.push([selected.value.database_schema.database.provider, 'database-provider'])
        updateTree.push([
          {
            id: selected.value.database_schema.database.id,
            parent: selected.value.database_schema.database.provider.id,
          },
          'database',
        ])
        updateTree.push([
          {
            id: selected.value.database_schema.id,
            parent: selected.value.database_schema.database.id,
            grandparent: selected.value.database_schema.database.provider.id,
          },
          'schema',
        ])
      } else if (child === 'schemas') {
        updateTree.push([selected.value.database.provider, 'database-provider'])
        updateTree.push([
          {
            id: selected.value.database.id,
            parent: selected.value.database.provider.id,
          },
          'database',
        ])
        updateTree.push([
          {
            id: selected.value.id,
            parent: selected.value.database.id,
            grandparent: selected.value.database.provider.id,
          },
          'schema',
        ])
      } else if (child === 'databases') {
        updateTree.push([selected.value.provider, 'database-provider'])
        updateTree.push([
          {
            id: selected.value.id,
            parent: selected.value.provider.id,
          },
          'database',
        ])
      }
      // Notice: neither array.forEach() nor Promisse.all() obey await !
      for (const [obj, type] of updateTree) {
        await handleToggleNode(obj, type)
      }
    }
  }
}
watch(
  () => route.fullPath, // Watch the `fullPath` of the route
  async (newRoute) => {
    // if (tree?.value?.length == 0) {
    //   await handleUpdate(0)
    // }
    await updateAfterRouteChange(newRoute, true, false)
  },
)
onMounted(async () => {
  await handleUpdate(0)
  await updateAfterRouteChange(route.fullPath, true, true)
})
provide('selected', selected) // Provide the `selected` state to children

const loadProviders = async (options) => {
  const { data, fetchData } = useFetch(
    `/database-providers/?query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}
const { columns, options } = useVServerTable()
  //.filterable('id')
  .columns('display_name', 'domain')
  .headSkin('table-primary')
  .requestFunction(loadProviders)
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

const loadIAModels = async (options) => {
  const { data, fetchData } = useFetch(
    `/ia-models/?query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}
const { columns: modelColumns, options: modelOptions } = useVServerTable()
  //.filterable('id')
  .columns('display_name', 'domain')
  .headSkin('table-primary')
  .requestFunction(loadIAModels)
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
<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 2s linear infinite;
  width: 48px; /* Adjust size as needed */
  height: 48px;
}
</style>
