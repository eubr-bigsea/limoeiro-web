<template>
  <div>
    <div v-if="selected">
      <bread-crumb :items="names" />
      <div
        class="d-flex align-items-center justify-content-between py-2 my-1 border-top border-bottom"
      >
        <img
          class="provider-logo me-3"
          :src="providerImageSrc"
          :alt="`Provedor do tipo ${selected?.provider_type?.display_name}`"
        />
        <h2 class="m-0">{{ selected.display_name }}</h2>
        <div class="ms-auto">Provedor de banco de dados</div>
      </div>
      <div class="d-flex gap-5 my-2">
        <div class="d-flex gap-1 align-items-center" title="Domínio">
          <Crown size="14px" />
          <span v-if="selected.domain">
            {{ selected.domain.display_name }}
          </span>
          <span v-else>Nenhum domínio</span>
          <PencilLine size="14px" />
        </div>
        <div class="d-flex gap-1 align-items-center" title="Responsável">
          <User size="14px" />
          <span v-if="selected.owner">
            {{ selected.owner }}
          </span>
          <span v-else>Nenhum responsável</span>
          <PencilLine size="14px" />
        </div>
        <div class="d-flex gap-1 align-items-center" title="Camadas">
          <Layers size="14px" />
          <span v-if="selected.domain">
            {{ selected.domain.display_name }}
          </span>
          <span v-else>Nenhuma camada</span>
          <PencilLine size="14px" />
        </div>
        <div class="ms-auto">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              :checked="selected.deleted"
              id="deleted"
            />
            <label class="form-check-label" for="deleted"> Desabilitado </label>
          </div>
        </div>
      </div>
      <div>
        <textarea class="form-control" aria-label="Descrição">{{ selected.description }}</textarea>
      </div>
      <tab-component :tabs="tabList" css-class="nav-underline border-bottom pb-0">
        <template #databases="{ active }">
          <div class="my-4">
            <v-server-table :options="options" :columns="columns" ref="table" name="databases">
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
            </v-server-table>
          </div>
        </template>
        <template #connection="{ active }">
          <edit-connection v-if="connection" :connection="connection" :provider_id="selected.id" />
        </template>
      </tab-component>
      <modal-window
        ref="editModal"
        modal-class="modal-lg modal-dialog-centered"
        modal-title="Editar"
      >
        <template #body="body"> </template>
      </modal-window>
      <div class="col-">
        <button class="btn btn-secondary btn-sm" @click="editModal.openModal()">Abrir</button>
      </div>
      <br />
      {{ selected }}
    </div>
  </div>
</template>

<script setup>
import { Crown, Layers, LucidePlusCircle, PencilLine, User } from 'lucide-vue-next'
import { inject, watchEffect, computed, onMounted, ref, watch, reactive } from 'vue'
import { useFetch } from '@/composables/useFetch.js'
import { useRouter } from 'vue-router'
import { useVServerTable } from '@/composables/useVServerTable.js'

import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import TabComponent from '@/components/ui/TabComponent.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import EditConnection from './EditConnection.vue'

const selected = inject('selected')
const props = defineProps(['id'])

const editModal = ref()

const providerImageSrc = ref(null)

const loadProviderLogo = async () => {
  if (selected && selected.value) {
    try {
      const img = await import(`@/assets/${selected.value?.provider_type.id}.svg`)
      return img.default
    } catch (ignore) {}
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
const loadData = async () => {
  await loadProviderLogo()
  table.value.refresh()
  ingestionTable.value.refresh()
  await loadConnection()
}

const loadDatabases = async (options) => {
  const { data, fetchData } = useFetch(
    `/databases/?provider_id=${selected.value.id}&query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}
const table = ref({ refresh: () => {} })
const ingestionTable = ref({ refresh: () => {} })
const { columns, options } = useVServerTable()
  .name('ingestions')
  .columns('display_name', 'domain', 'layer')
  .headSkin('table-primary')
  .headings({
    display_name: 'Nome',
    updated_at: 'Atualizado em',
    actions: 'Ações',
    domain: 'Domínio',
    layer: 'Camada',
  })
  .requestFunction(loadDatabases)
  .filterable('query')
  .sortable('display_name')
  .build()

const tabList = [
  { title: 'Bancos de dados', slotName: 'databases' },
  { title: 'Processos de ingestão', slotName: 'ingestions' },
  { title: 'Conexão', slotName: 'connection' },
]
watch(selected, loadData)

/* Ingestions */
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
  })
  .requestFunction((options) => {
    return { data: selected.value.ingestions, count: selected.value.ingestions.length }
  })
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
  const { data, fetchData } = useFetch(`/connections/?provider_id=${selected.value.id}`)
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
</script>

<style scoped>
.provider-logo {
  width: auto;
  height: 56px;
}
</style>
