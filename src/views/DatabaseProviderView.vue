<template>
  <div>
    <div v-if="selected">
      <bread-crumb :items="names" />
      <div
        class="d-flex align-items-center justify-content-between py-2 my-1 border-top border-bottom"
      >
        <img class="provider-logo me-3" :src="providerImageSrc" />
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
            <input class="form-check-input" type="checkbox" :checked="selected.deleted" />
            <label class="form-check-label" for="flexCheckDefault"> Desabilitado </label>
          </div>
        </div>
      </div>
      <div>
        <textarea class="form-control">{{ selected.description }}</textarea>
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
          <div class="my-4">
            {{ selected.ingestions }}
            <table v-if="selected.ingestions" class="table table-bordered table-sm">
              <thead class="table-primary">
                <tr>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Habilitada</th>
                  <th>Últimos estados</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ingestion in selected.ingestions">
                  <td>{{ ingestion.name }}</td>
                  <td>{{ ingestion.type }}</td>
                  <td>{{ ingestion.deleted ? 'Sim' : 'Não' }}</td>
                  <td>{{ ingestion.recent_runs_statuses }}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <div v-else>Nenhum processo de ingestão cadastrado</div>
          </div>
        </template>
        <template #connection="{ active }">
          <div v-if="active">
            {{ selected.connection_id }}
          </div>
        </template>
      </tab-component>
    </div>
  </div>
</template>

<script setup>
import { Crown, Layers, PencilLine, User } from 'lucide-vue-next'
import { inject, computed, onMounted, ref, watch } from 'vue'
import { useFetch } from '@/composables/useFetch.js'
import { useVServerTable } from '@/composables/useVServerTable.js'

import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import TabComponent from '@/components/ui/TabComponent.vue'

const selected = inject('selected')
const props = defineProps(['id'])

const providerImageSrc = ref()

const loadProviderLogo = async () => {
  if (selected && selected.value) {
    try {
      const img = await import(`@/assets/${selected.value?.provider_type.id}.svg`)
      providerImageSrc.value = img.default
    } catch (ignore) {}
  }
}
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
}

const loadDatabases = async (options) => {
  const { data, fetchData } = useFetch(
    `/databases/?provider_id=${selected.value.id}&query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}
const table = ref({ refresh: () => {} })
const { columns, options } = useVServerTable()
  .name('databases')
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
</script>
<style scoped>
.provider-logo {
  width: auto;
  height: 56px;
}
</style>
