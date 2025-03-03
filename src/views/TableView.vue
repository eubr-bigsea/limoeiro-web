<template>
  <div v-if="selected">
    <bread-crumb :items="names" />
    <div
      class="d-flex align-items-center justify-content-between py-2 my-1 border-top border-bottom gap-2"
    >
      <View v-if="selected.type === 'VIEW'" size="36px" />
      <Table2 v-if="selected.type === 'REGULAR'" size="36px" color="gold" />
      <h2 class="mb-0">{{ selected.display_name }}</h2>
      <div class="ms-auto">
        {{ tableType }}
      </div>
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
          <CollapsableEditor
            v-model="selected.description"
            @change="(desc) => updateProperty('description', desc)"
            missing="<sem descrição fornecida>"
          />
        </div>
        <tab-component :tabs="tabList" css-class="nav-underline border-bottom pb-0">
          <template #columns="{ active }">
            <div v-if="active && selected?.columns?.length">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="showCompleteColInfo"
                  name="showCompleteColInfo"
                />
                <label class="form-check-label" for="showCompleteColInfo">
                  Exibir todas as informações
                </label>
              </div>
              <table class="table table-striped table-bordered">
                <thead class="bg-primary text-white">
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th v-if="showCompleteColInfo">Exibição</th>
                    <th>Tipo</th>
                    <th>Aceita nulos?</th>
                    <th v-if="showCompleteColInfo">Chave primária</th>
                    <th v-if="showCompleteColInfo">Único</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="col in selected.columns" :key="col.id">
                    <td>{{ col.name }}</td>
                    <td>{{ col.description }}</td>
                    <td v-if="showCompleteColInfo">{{ col.display_name }}</td>
                    <td>{{ col.data_type }}{{ col.size ? `(${col.size})` : '' }}</td>
                    <td>{{ col.nullable ? 'Sim' : 'Não' }}</td>
                    <td v-if="showCompleteColInfo">{{ col.primary_key ? 'Sim' : 'Não' }}</td>
                    <td v-if="showCompleteColInfo">{{ col.unique ? 'Sim' : 'Não' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>Nenhuma coluna definida</div>
          </template>
          <template #sample="{ active }">
            <div v-if="active">Content for Tab 2</div>
          </template>
          <template #queries="{ active }">
            <div v-if="active">Content for Tab 3</div>
          </template>
        </tab-component>
      </div>
      <div class="w-25 ps-2 border-start explorer-side-container">
        <ExplorerRightBar :asset-id="selected.id" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { Table2, View } from 'lucide-vue-next'
import { inject, computed, ref } from 'vue'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import TabComponent from '@/components/ui/TabComponent.vue'
import ExplorerHeader from '@/components/ExplorerHeader.vue'
import CollapsableEditor from '@/components/ui/CollapsableEditor.vue'
import ExplorerRightBar from '@/components/ExplorerRightBar.vue'
import { useUpdateAssetProperty } from '@/composables/useUpdateAssetProperty'

defineProps(['id'])
const selected = inject('selected')
const names = computed(() => {
  const part1 = [
    {
      label: 'Explorar',
      route: 'explore',
    },
    {
      label: selected.value.database?.provider?.display_name,
      route: 'explore-database-providers',
      id: selected.value.database?.provider.id,
    },
    {
      label: selected.value.database?.display_name,
      route: 'explore-databases',
      id: selected.value.database.id,
    },
  ] //selected.value.fully_qualified_name.split('.')
  let part2 = []
  if (selected.value.database_schema) {
    part2 = [
      {
        label: selected.value.database_schema?.display_name,
        route: 'explore-schemas',
        id: selected.value.database_schema?.id,
      },
    ]
  }
  return [
    ...part1,
    ...part2,
    { label: selected.value.display_name, route: 'explore-tables', id: selected.value.id },
  ]
})
const tableTypes = {
  REGULAR: 'Tabela',
  VIEW: 'Vista/Visão',
}
const tableType = computed(() => {
  return tableTypes[selected.value.type]
})
// Tabs
const tabList = [
  { title: 'Colunas', slotName: 'columns' },
  { title: 'Amostra', slotName: 'sample' },
  { title: 'Consultas', slotName: 'queries' },
  { title: 'Qualidade de dados', slotName: 'dataQuality' },
  { title: 'Linhagem', slotName: 'lineage' },
  { title: 'Propriedades personalizadas', slotName: 'customProperties' },
]
const showCompleteColInfo = ref(false)

const { asset, update } = useUpdateAssetProperty('tables')
const updateProperty = async (name, value) => {
  asset.value = selected.value
  await update(name, name !== 'deleted' ? value?.id : value)
}
</script>
