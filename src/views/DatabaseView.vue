<template>
  <div v-if="selected">
    <bread-crumb :items="names" />
    <div
      class="d-flex align-items-center justify-content-between py-2 my-1 border-top border-bottom"
    >
      <img class="provider-logo me-3" :src="providerImageSrc" />
      <h2 class="m-0">{{ selected.display_name }}</h2>
      <div class="ms-auto">Banco de dados</div>
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
    <div class="my-4">
      <h5>Esquemas</h5>
      <v-server-table :options="options" :columns="columns" :key="selected.id" name="schemas">
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
          <router-link :to="{ name: 'explore-schemas', params: { id: props.row.id } }">
            {{ props.row.display_name }}
          </router-link>
        </template>
      </v-server-table>
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

const selected = inject('selected')
defineProps(['id'])

const providerImageSrc = ref()

const loadProviderLogo = async () => {
  if (selected && selected.value) {
    try {
      const img = await import(`@/assets/${selected.value.provider?.provider_type.id}.svg`)
      providerImageSrc.value = img.default
    } catch (ignore) {}
  }
}
watch(selected, loadProviderLogo)
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

const loadSchemas = async (options) => {
  const { data, error, isLoading, fetchData } = useFetch(
    `/schemas/?database_id=${selected.value.id}&query=${options.query || ''}&sort_by=${options.orderBy}&sort_order=${options.ascending ? 'asc' : 'desc'}&page=${options.page}`,
  )
  await fetchData()
  return { data: data.value.items, count: data.value.count }
}
const { columns, options } = useVServerTable()
  //.filterable('id')
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

onMounted(async () => {
  await loadProviderLogo()
})
</script>
<style scoped>
.provider-logo {
  width: auto;
  height: 56px;
}
</style>
