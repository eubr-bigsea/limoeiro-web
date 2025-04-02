<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12 col-lg-12 pe-0">
          <router-view v-slot="{ Component }">
            <transition v-if="Component" name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
            <template v-else>
              <div class="my-4 row">
                <div class="col-6">
                  <h2>Provedores de bancos de dados</h2>
                  <v-server-table :options="options" :columns="columns">
                    <template #actions>
                      <row-list-action-buttons />
                    </template>
                    <template #domain="props">
                      <router-link
                        v-if="props.row.domain"
                        :to="{ name: 'edit-domain', params: { id: props.row.domain.id } }"
                      >
                        {{ props.row.domain.name }}
                      </router-link>
                    </template>
                    <template #layer="props">
                      <router-link v-if="props.row.layer" :to="{ name: 'layers' }">
                        {{ props.row.layer.name }}
                      </router-link>
                    </template>
                    <template #type="props">
                      {{ props.row.provider_type.display_name }}
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
                  <v-server-table v-if="false" :options="modelOptions" :columns="modelColumns">
                    <template #actions>
                      <row-list-action-buttons />
                    </template>
                    <template #domain="props">
                      <router-link
                        v-if="props.row.domain"
                        :to="{ name: 'edit-domain', params: { id: props.row.domain.id } }"
                      >
                        {{ props.row.domain.name }}
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
import { useFetch } from '@/composables/useFetch.js'
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
    selected.value = null
    const { data, error, isLoading, fetchData } = getData(`/${child}/${id}`)
    await fetchData()
    if (updateSelected) {
      selected.value = data.value
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
  //await handleUpdate(0)
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
  .columns('display_name', 'domain', 'type')
  .headSkin('table-primary')
  .requestFunction(loadProviders)
  .headings({
    display_name: 'Nome',
    updated_at: 'Atualizado em',
    actions: 'Ações',
    domain: 'Domínio',
    layer: 'Camada',
    provider_type: 'Tipo',
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
  .filterable('id')
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
