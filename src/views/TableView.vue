<template>
  <div v-if="selected">
    <bread-crumb :items="names" />
    <div
      class="d-flex align-items-center justify-content-between py-2 my-1 border-top border-bottom gap-2"
    >
      <LucideEye v-if="selected.type === 'VIEW'" size="36px" color="gray" />
      <LucideTable2 v-if="selected.type === 'REGULAR'" size="36px" color="navy" />
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
          :notes="selected.notes"
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
                    <th colspan="2"></th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th v-if="showCompleteColInfo">Exibição</th>
                    <th>Tipo</th>
                    <th class="text-center">Aceita nulos?</th>
                    <th class="text-center" v-if="showCompleteColInfo">Chave primária</th>
                    <th class="text-center" v-if="showCompleteColInfo">Único</th>
                    <th class="text-center" v-if="showCompleteColInfo">Tipo semântico</th>
                    <th class="text-center" v-if="showCompleteColInfo">Valor default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(col, i) in selected.columns" :key="col.id">
                    <td class="text-center">{{ i + 1 }}</td>
                    <td class="text-center">
                      <LucideKeySquare v-if="col.primary_key" size="14" />
                      <component :is="getDataType(col.data_type)" size="14" />
                    </td>
                    <td>{{ col.name }}</td>
                    <td>{{ col.description }}</td>
                    <td v-if="showCompleteColInfo">{{ col.display_name }}</td>
                    <td>
                      {{ col.data_type == 'ARRAY' && col.array_data_type ? col.data_type +' (' +col.array_data_type + ')': col.data_type}} {{ col.size ? `(${col.size})` : '' }}
                      {{ col.precision ? `(${col.precision}, ${col.scale})` : '' }}
                    </td>
                    <td class="text-center">
                      {{ col.nullable ? 'Sim' : 'Não' }}
                    </td>
                    <td class="text-center" v-if="showCompleteColInfo">
                      {{ col.primary_key ? 'Sim' : 'Não' }}
                    </td>
                    <td class="text-center" v-if="showCompleteColInfo">
                      {{ col.unique ? 'Sim' : 'Não' }}
                    </td>
                    <td v-if="showCompleteColInfo">
                      {{ col.semantic_type }}
                    </td>
                    <td v-if="showCompleteColInfo">
                      {{ col.default_value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>Nenhuma coluna definida</div>
          </template>
          <template #sample="{ active }">
            <div v-if="active">
              <TableSampleDisplay v-if="showSamples" :table-id="selected.id" />
            </div>
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
import {
  LucideDollarSign,
  LucideEye,
  LucideImage,
  LucideKeySquare,
  LucideTable2,
} from 'lucide-vue-next'
import { inject, computed, ref } from 'vue'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import TabComponent from '@/components/ui/TabComponent.vue'
import ExplorerHeader from '@/components/ExplorerHeader.vue'
import CollapsableEditor from '@/components/ui/CollapsableEditor.vue'
import ExplorerRightBar from '@/components/ExplorerRightBar.vue'
import { useUpdateAssetProperty } from '@/composables/useUpdateAssetProperty'

import TableSampleDisplay from '@/components/TableSampleDisplay.vue'
import { LucideCalendarClock, LucideCaseUpper, LucideBinary, LucideHash } from 'lucide-vue-next'

const SQLTYPES_DICT = new Map([
  ['VARBINARY', 'BINARY'],
  ['BIT', 'BINARY'],
  ['DATE', 'DATE'],
  ['BIG_INTEGER', 'NUMBER'],
  ['BLOB', 'BINARY'],
  ['CHAR', 'CHAR'],
  ['DECIMAL', 'NUMBER'],
  ['ARRAY', 'CHAR'],
  ['BIGINT', 'NUMBER'],
  ['STRING', 'CHAR'],
  ['REAL', 'NUMBER'],
  ['DATETIME', 'DATE'],
  ['VARCHAR', 'CHAR'],
  ['TIMESTAMP', 'DATE'],
  ['NULL', 'CHAR'],
  ['JSON', 'CHAR'],
  ['BINARY', 'BINARY'],
  ['ENUM', 'CHAR'],
  ['INTEGER', 'NUMBER'],
  ['INT', 'NUMBER'],
  ['BOOLEAN', 'CHAR'],
  ['SMALLINT', 'NUMBER'],
  ['NUMERIC', 'NUMBER'],
  ['SMALL_INTEGER', 'NUMBER'],
  ['TIME', 'DATE'],
  ['CLOB', 'BINARY'],
  ['FLOAT', 'NUMBER'],
  ['TEXT', 'CHAR'],
  ['NVARCHAR', 'CHAR'],
  ['NCHAR', 'CHAR'],
  ['NTEXT', 'CHAR'],
  ['TINYINT', 'NUMBER'],
  ['MONEY', 'MONEY'],
  ['LARGE_BINARY', 'BINARY'],
  ['LONGTEXT', 'CHAR'],
  ['TINYTEXT', 'CHAR'],
  ['IMAGE', 'IMAGE'],
])
const iconMap = {
  DATE: LucideCalendarClock,
  CHAR: LucideCaseUpper,
  BINARY: LucideBinary,
  NUMBER: LucideHash,
  MONEY: LucideDollarSign,
  IMAGE: LucideImage,
}
const getDataType = (type) => iconMap[SQLTYPES_DICT.get(type)]

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
const showSamples = ref(false)
const tabList = [
  { title: 'Colunas', slotName: 'columns' },
  { title: 'Amostras', slotName: 'sample', onActivate: () => (showSamples.value = true) },
  // { title: 'Consultas', slotName: 'queries' },
  // { title: 'Qualidade de dados', slotName: 'dataQuality' },
  // { title: 'Linhagem', slotName: 'lineage' },
  // { title: 'Propriedades personalizadas', slotName: 'customProperties' },
]
const showCompleteColInfo = ref(false)

const { asset, update } = useUpdateAssetProperty('tables')
const updateProperty = async (name, value) => {
  asset.value = selected.value
  await update(name, value)
}
</script>
