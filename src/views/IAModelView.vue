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
        </div>
        <div class="my-3">
          <tab-component :tabs="tabList" css-class="nav-underline border-bottom pb-0">
            <template #features="{ active }">
              <div v-if="active && selected?.attributes?.length">
                <table class="table table-striped table-bordered">
                  <thead class="bg-primary text-white">
                    <tr>
                      <th>Nome</th>
                      <th>Descrição</th>
                      <th>Aplicação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="col in selected.attributes" :key="col.id">
                      <td>{{ col.name }}</td>
                      <td>{{ col.description }}</td>
                      <td>
                        <span v-if="col.usage === 'label'"
                          ><LucideTarget color="blue" size="12pt" />
                        </span>
                        <span v-else-if="col.usage === 'feature'">
                          <LucideCheckSquare color="green" size="12pt" />
                        </span>
                        {{ col.usage }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>Nenhum atributo definido</div>
            </template>
            <template #hyper_parameters="{ active }">
              <div v-if="active && selected?.hyper_parameters?.length">
                <table class="table table-striped table-bordered">
                  <thead class="bg-primary text-white">
                    <tr>
                      <th>Nome</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="col in selected.hyper_parameters" :key="col.id">
                      <td>{{ col.name }}</td>
                      <td>{{ col.description }}</td>
                      <td>
                        {{ col.value }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>Nenhum hiperparâmetro definido</div>
            </template>
            <template #results="{ active }">
              <div v-if="active && selected?.results?.length">
                <table class="table table-striped table-bordered">
                  <thead class="bg-primary text-white">
                    <tr>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="col in selected.results" :key="col.id">
                      <td>{{ col.name }}</td>
                      <td>{{ col.type }}</td>
                      <td>{{ col.description }}</td>
                      <td>
                        {{ col.value }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>Nenhum resultado</div>
            </template>
          </tab-component>
        </div>
        {{ selected }}
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
import { LucideCheck, LucideCheckSquare, LucideTarget, Table2, View } from 'lucide-vue-next'
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
    { label: selected.value.display_name, route: 'explore-tables', id: selected.value.id },
  ] //selected.value.fully_qualified_name.split('.')
})
// Tabs
const tabList = [
  { title: 'Features', slotName: 'features' },
  { title: 'Hiperparâmetros', slotName: 'hyper_parameters' },
  { title: 'Resultados', slotName: 'results' },
]
</script>
