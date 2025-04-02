<template>
  <div v-if="selected">
    <bread-crumb :items="names" />
    <div
      class="d-flex align-items-center justify-content-between py-2 my-1 border-top border-bottom"
    >
      <img
        v-if="providerImageSrc"
        class="provider-logo me-3"
        :src="providerImageSrc"
        :alt="`Provedor do tipo ${selected?.provider_type?.display_name}`"
        :data-id="selected?.provider_type.image"
      />
      <h2 class="m-0">{{ selected.display_name }}</h2>
      <div class="ms-auto pe-1">Provedor de banco de dados</div>
    </div>
    <div class="d-flex gap-3">
      <div class="w-75">
        <ExplorerHeader
          v-model:domain="selected.domain"
          v-model:layer="selected.layer"
          v-model:deleted="selected.deleted"
          @update:domain="(event) => updateProperty('domain_id', event)"
          @update:layer="(event) => updateProperty('layer_id', event)"
          @update:deleted="(event) => updateProperty('deleted', event)"
        />
        <div>
          <collapsable-editor
            v-model="selected.description"
            @change="(desc) => updateProperty('description', desc)"
            missing="<sem descrição fornecida>"
          />
        </div>
        <tab-component
          :tabs="tabList"
          css-class="nav-underline border-bottom pb-0 mt-2 border-top"
          ref="tabs"
          :active-tab="route.query.tab ? parseInt(route.query.tab) : 0"
        >
          <template #databases="{ active }">
            <div class="my-4">
              <v-server-table :options="options" :columns="columns" ref="table" name="databases">
                <template #afterFilter>
                  <div class="ms-4">
                    <div class="form-check form-switch mt-4">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        v-model="showDeleted"
                        @change="table.refresh()"
                        id="deleted"
                      />
                      <label class="form-check-label fw-normal" for="deleted"
                        >Exibir desabilitados</label
                      >
                    </div>
                  </div>
                </template>
                <template #actions>
                  <row-list-action-buttons />
                </template>
                <template #domain="props">
                  <router-link v-if="props.row.domain" :to="{ name: 'domains' }">
                    {{ props.row.domain.display_name }}
                  </router-link>
                </template>
                <template #deleted="props">
                  {{ props.row.deleted ? 'Sim' : 'Não' }}
                </template>
                <template #layer="props">
                  <router-link v-if="props.row.layer" :to="{ name: 'layers' }">
                    {{ props.row.layer.display_name }}
                  </router-link>
                </template>
                <template #display_name="props">
                  <router-link :to="{ name: 'explore-databases', params: { id: props.row.id } }">
                    {{ props.row.display_name }}
                  </router-link>
                </template>
              </v-server-table>
            </div>
          </template>
          <template #ingestions="{ active }">
            <router-link
              :to="{ name: 'explore-database-providers-add-ingestion' }"
              class="btn btn-sm btn-primary"
              ><LucidePlusCircle /> Adicionar</router-link
            >
            <div class="my-4">
              <v-server-table
                :options="optionsIngestion"
                :columns="columnsIngestion"
                name="ingestions"
                ref="ingestionTable"
              >
                <template #actions="props">
                  <row-list-action-buttons
                    :row="props.row"
                    :edit-link="{
                      name: 'explore-database-providers-edit-ingestion',
                      params: { id: selected.id, ingestionId: props.row.id },
                    }"
                    @delete="handleDeleteIngestion"
                  />
                </template>
                <template #deleted="props">
                  {{ props.row.deleted ? 'Não' : 'Sim' }}
                </template>
                <template #recent_runs_statuses="props">
                  {{ props.row.recent_runs_statuses }}
                </template>
              </v-server-table>
            </div>
          </template>
          <template #connection="{ active }">
            <edit-connection
              v-if="connection"
              :connection="connection"
              :provider_id="selected.id"
            />
          </template>
        </tab-component>
        <modal-window ref="editModal" modal-class="modal-lg modal-dialog-centered" title="Editar">
          <template #body="body"> </template>
        </modal-window>
      </div>
      <div class="w-25 ps-2 border-start explorer-side-container">
        <ExplorerRightBar :asset-id="route.params.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucidePlusCircle } from 'lucide-vue-next'
import { inject, watchEffect, computed, ref, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch } from '@/composables/useFetch.js'
import { useVServerTable } from '@/composables/useVServerTable.js'

import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import TabComponent from '@/components/ui/TabComponent.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import EditConnection from './EditConnection.vue'
import CollapsableEditor from '@/components/ui/CollapsableEditor.vue'
import ExplorerHeader from '@/components/ExplorerHeader.vue'
import ExplorerRightBar from '@/components/ExplorerRightBar.vue'
import { onMounted } from 'vue'
import { useUpdateAssetProperty } from '@/composables/useUpdateAssetProperty'

const selected = inject('selected')
const props = defineProps(['id'])
const route = useRoute()
const editModal = ref()

const providerImageSrc = ref(null)
const loadProviderLogo = async () => {
  if (selected && selected.value) {
    try {
      const img = await import(`@/assets/${selected.value?.provider_type.image}.svg`)
      return img.default
    } catch (ignore) {
      console.debug('Invalid logo', ignore)
    }
  }
}
watchEffect(async () => {
  providerImageSrc.value = await loadProviderLogo()
})

const names = computed(() => {
  return [
    {
      label: 'Explorar',
      route: 'explore',
    },
    {
      label: selected.value.display_name,
      route: 'explore-databases',
      id: selected.value.id,
    },
  ]
})
onMounted(async (v) => {
  await Promise.all([loadConnection(), loadIngestions()])
})
const showDeleted = ref(false)

const loadDatabases = async (options) => {
  const queryParams = {
    provider_id: route.params.id,
    query: options.query || '',
    sort_by: options.orderBy,
    sort_order: options.ascending ? 'asc' : 'desc',
    page: options.page,
    page_size: options.limit,
  }
  if (!showDeleted.value) {
    queryParams.deleted = false
  }

  const { data, fetchData } = useFetch(`/databases/?${new URLSearchParams(queryParams).toString()}`)
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}

const table = ref({ refresh: () => {} })
const ingestionTable = ref({ refresh: () => {} })
const { columns, options } = useVServerTable()
  .name('ingestions')
  .columns('display_name', 'notes', 'domain', 'layer', 'deleted')
  .headSkin('table-secondary')
  .headings({
    display_name: 'Nome',
    updated_at: 'Atualizado em',
    actions: 'Ações',
    domain: 'Domínio',
    layer: 'Camada',
    notes: 'Notas',
    deleted: 'Desabilitado',
  })
  .columnsClasses({ deleted: ['text-center'] })
  .requestFunction(loadDatabases)
  .filterable('query')
  .sortable('display_name')
  .build()

const tabList = [
  { title: 'Bancos de dados', slotName: 'databases' },
  { title: 'Processos de ingestão', slotName: 'ingestions' },
  { title: 'Conexão', slotName: 'connection' },
]

/* Ingestions */
const ingestions = ref([])
const loadIngestions = async () => {
  const { data, fetchData } = useFetch(`/ingestions/?provider_id=${route.params.id}`)
  await fetchData()
  ingestions.value = data.value.items

  return { data: data.value.items, count: data.value.count }
}

const { columns: columnsIngestion, options: optionsIngestion } = useVServerTable()
  .name('ingestions')
  .columns('name', 'type', 'deleted', 'recent_runs_statuses', 'actions')
  .headSkin('table-primary')
  .headings({
    name: 'Nome',
    type: 'Tipo',
    deleted: 'Habilitada',
    last: 'Últimos estados',
    actions: 'Ações',
    recent_runs_statuses: 'Status recente',
  })
  .requestFunction(loadIngestions)
  .sortable('name')
  .build()

const handleDeleteIngestion = async (row) => {
  const url = `/ingestions/${row.id}`
  const { data, error, fetchData } = useFetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  await fetchData()
  if (error.value) {
    console.debug(error.value)
  } else {
    //router.go()
  }
}

const connection = ref()
/* Connection */
const loadConnection = async () => {
  const { data, fetchData } = useFetch(`/connections/?provider_id=${route.params.id}`)
  await fetchData()
  connection.value =
    data.value.count > 0
      ? data.value.items[0]
      : {
          user_name: null,
          host: null,
          port: null,
          database: null,
          password: null,
          extra_parameters: null,
        }
}

const { asset, update } = useUpdateAssetProperty('database-providers')
const updateProperty = async (name, value) => {
  asset.value = selected.value
  await update(name, name !== 'deleted' ? value?.id : value)
}
</script>

<style scoped>
.provider-logo {
  width: auto;
  max-width: 100px;
  max-height: 48px;
}
</style>
