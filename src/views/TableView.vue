<template>
  <div v-if="selected">
    <div class="d-flex gap-3">
      <div class="col-9">
        <div>
          <bread-crumb :items="names" />
          <div
            class="d-flex align-items-center justify-content-between py-2 my-1 border-top border-bottom gap-2"
          >
            <View v-if="selected.type === 'VIEW'" size="36px" />
            <Table2 v-if="selected.type === 'REGULAR'" size="36px" />
            <h2 class="mb-0">{{ selected.display_name }}</h2>
            <div class="ms-auto">
              {{ tableType }}
            </div>
          </div>
        </div>
        <div class="d-flex gap-5 my-2">
          <div class="d-flex gap-1 align-items-center">
            <Crown size="14px" />
            <span v-if="selected?.database?.domain">
              {{ selected.database.domain.display_name }} (herdado do banco de dados)
            </span>
            <span v-else>Nenhum domínio</span>
          </div>
          <div class="d-flex gap-1 align-items-center">
            <User size="14px" />
            <span v-if="selected.owner">
              {{ selected.owner }}
            </span>
            <span v-else>Nenhum responsável</span>
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
          <!--<DescriptionEditor />-->
          {{ selected }}
        </div>
        <div class="my-3">
          <tab-component :tabs="tabList" css-class="nav-underline border-bottom pb-0">
            <template #schema="{ active }">
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
      </div>
      <div class="col-3 border-start px-2 vh-100 ms-auto">
        <h4>Tags</h4>
        <div
          v-for="tag in selected.tags"
          v-if="selected.tags"
          :key="tag.id"
          class="badge bg-light text-dark"
        >
          {{ tag.name }}
        </div>
        <div v-else>Nenhuma tag associada</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Table2, View } from 'lucide-vue-next'
import { inject, computed, ref } from 'vue'
import { Crown, PencilLine, User } from 'lucide-vue-next'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import TabComponent from '@/components/ui/TabComponent.vue'
import DescriptionEditor from '@/components/ui/DescriptionEditor.vue'

defineProps(['id'])
const selected = inject('selected')
const names = computed(() => {
  return [
    {
      label: 'Explorar',
      route: 'explore',
    },
    {
      label: selected.value.database_schema?.database?.provider?.display_name,
      route: 'explore-database-providers',
      id: selected.value.database_schema?.database?.provider.id,
    },
    {
      label: selected.value.database_schema?.database.display_name,
      route: 'explore-databases',
      id: selected.value.database_schema?.database.id,
    },
    {
      label: selected.value.database_schema?.display_name,
      route: 'explore-schemas',
      id: selected.value.database_schema?.id,
    },
    { label: selected.value.display_name, route: 'explore-tables', id: selected.value.id },
  ] //selected.value.fully_qualified_name.split('.')
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
  { title: 'Esquema', slotName: 'schema' },
  { title: 'Amostra', slotName: 'sample' },
  { title: 'Consultas', slotName: 'queries' },
  { title: 'Qualidade de dados', slotName: 'dataQuality' },
  { title: 'Linhagem', slotName: 'lineage' },
  { title: 'Propriedades personalizadas', slotName: 'customProperties' },
]
const showCompleteColInfo = ref(false)
</script>
