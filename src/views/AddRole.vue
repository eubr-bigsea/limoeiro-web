<template>
  <div class="mx-2">
    <bread-crumb :items="names" />
    <div class="d-flex justify-content-between my-2 border-top border-bottom py-1">
      <h2>{{ route.meta.title }}</h2>
    </div>
    <form @submit.prevent="submitForm" class="px-2">
      <div class="row">
        <div class="col-xs-12 col-md-8 col-lg-6">
          <text-input
            name="name"
            label="Nome"
            v-model="state.name"
            maxlength="50"
            required
            :focus="true"
          />
        </div>
        <div class="col-xs-12 col-md-4 col-lg-5 d-flex justify-content-between mt-4">
          <div>
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="deleted"
              v-model="state.deleted"
            />
            <label class="form-check-label ms-2" for="deleted">Desabilitado</label>
          </div>
          <div>
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="system"
              v-model="state.system"
            />
            <label class="form-check-label ms-2" for="system">Sistema</label>
          </div>
          <div>
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="all_user"
              v-model="state.all_user"
            />
            <label class="form-check-label ms-2" for="all_user">Todos os usuários</label>
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-xs-12 col-md-6 col-lg-6">
          <label class="form-check-label ms-2" for="deleted">Adicionar Permissão</label>
          <LookupComponent
            class="mb-2"
            :fetchFunction="retrieveOptions"
            v-model="newPermission"
            label="id"
            ref="lookup"
            @change="addPermission"
            @cancel="true"
          />

          <v-server-table :options="options" :columns="columns" ref="listing">
            <template #actions="props">
              <row-list-action-buttons :row="props.row" @delete="handleDelete" />
            </template>
          </v-server-table>
        </div>

        <div class="col-xs-12 col-md-4 col-lg-6">
          <text-input
            name="description"
            label="Descrição"
            v-model="state.description"
            rows="10"
            :multi-line="true"
            :display-errors="false"
          />
        </div>
      </div>
      <edit-buttons @save="handleSave" :cancelRoute="{ name: 'companies' }" />
    </form>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import { useFetch } from '@/composables/useFetch.js'
import { useRoute } from 'vue-router'
import { useFetchResponseHandler } from '@/composables/useFetchResponseHandler'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import TextInput from '@/components/ui/TextInput.vue'
import EditButtons from '@/components/ui/EditButtons.vue'
import LookupComponent from '@/components/ui/LookupComponent.vue'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import { useVServerTable } from '@/composables/useVServerTable'

const route = useRoute()
const { handleFetchResponse } = useFetchResponseHandler()
const newPermission = ref()

const listing = ref()
const lookup = ref(null)

const handleDelete = async (row) => {
  state.permissions = state.permissions.filter((item) => item.id !== row.id)
  listing.value.refresh()
}

const state = reactive({
  name: null,
  description: null,
  all_user: false,
  system: false,
  deleted: false,
  permissions: [],
})

const { columns, options } = useVServerTable()
  .name('permissions')
  .columns('id', 'description', 'actions')
  .headSkin('table-secondary fw-bold')
  .headings({
    id: 'Nome',
    description: 'Descrição',
    actions: 'Deletar',
  })
  .requestFunction(() => ({ data: state.permissions, count: state.permissions.length }))
  .skin('table table-bordered table-sm table-hover align-middle')
  .build()

const handleSave = async () => {
  const ids = state.permissions.map((item) => item.id)
  const url = '/roles/'
  const { data, error, fetchData } = useFetch(url, {
    method: 'POST',
    body: JSON.stringify({ ...state, permissions: ids }),
  })
  await fetchData()

  handleFetchResponse(error, data, {
    state,
  })
}
const names = computed(() => [
  {
    label: 'Grupos',
    route: 'roles',
  },
  {
    label: 'Novo grupo',
  },
])

const addPermission = () => {
  state.permissions.push(newPermission.value)
  listing.value.refresh()
}

const retrieveOptions = async (query) => {
  const { data, fetchData } = useFetch(`/permissions/?query=${query}&sort_by=name&page_size=10`)
  await fetchData()
  return data.value.items.filter((v) => !state.permissions.map((p) => p.id).includes(v.id))
}
</script>
