<template>
  <div class="mx-2">
    <bread-crumb :items="names" />
    <div class="d-flex justify-content-between my-2 border-top border-bottom py-1">
      <h2>{{ route.meta.title }}</h2>
    </div>
    <form @submit.prevent="submitForm" class="px-2">
      <div class="d-flex">
        <div class="w-75 p-3">
          <div class="">
            <text-input
              name="name"
              label="Nome"
              v-model="state.name"
              maxlength="50"
              required
              :focus="true"
            />
          </div>
          <div class="d-flex gap-5 mb-3">
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
                id="all_user"
                v-model="state.all_user"
              />
              <label class="form-check-label ms-2" for="all_user">Todos os usuários</label>
            </div>
          </div>
          <div class="my-1">
            <text-input
              name="description"
              label="Descrição"
              v-model="state.description"
              rows="10"
              :multi-line="true"
              :display-errors="false"
            />
            <div class="d-flex justify-content-between align-items-center">
              <label class="form-check-label ms-2" for="permissions">Permissões do Grupo</label>
            </div>
            <div class="border rounded p-3">
              <div class="row">
                <div v-for="item in permissions" :key="item.id" class="col-md-4 mb-2">
                  <label :for="`item-${item.id}`">
                    <input
                      type="checkbox"
                      :id="`item-${item.id}`"
                      :value="item.id"
                      v-model="permissionsIds"
                      class="form-check-input"
                    />
                    {{ item.description }}
                  </label>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2 mt-2">
              <button class="btn btn-outline-primary me-2 btn-sm" @click="selectAllPermissions">
                Selecionar todos
              </button>
              <button class="btn btn-outline-secondary btn-sm" @click="clearPermissions">
                Limpar
              </button>
            </div>
          </div>
        </div>
        <!-- lado direito -->
        <div class="w-50 p-3">
          <label class="form-check-label ms-2" for="users">Adicionar Usuário</label>
          <LookupComponent
            class="mb-2"
            :fetchFunction="retrieveOptions"
            xv-model="newUser"
            label="name"
            ref="lookup"
            @change="addUser"
            @cancel="true"
          />

          <v-server-table :options="options" :columns="columns" ref="listing">
            <template #actions="props">
              <div class="text-center">
                <row-list-action-buttons
                  :row="props.row"
                  @delete="handleDelete"
                  confirmation-title="Desassociar usuário"
                  confirmation-message="Tem certeza que quer desassociar o usuário do grupo?"
                />
              </div>
            </template>
          </v-server-table>
        </div>
      </div>
      <div class="m-3">
        <edit-buttons @save="handleSave" :cancelRoute="{ name: 'roles' }" />
      </div>
    </form>
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch.js'
import { useRoute, useRouter } from 'vue-router'
import { useFetchResponseHandler } from '@/composables/useFetchResponseHandler'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import TextInput from '@/components/ui/TextInput.vue'
import EditButtons from '@/components/ui/EditButtons.vue'
import LookupComponent from '@/components/ui/LookupComponent.vue'
import VServerTable from '@/components/VServerTable.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import { useVServerTable } from '@/composables/useVServerTable'

const route = useRoute()
const router = useRouter()

const { handleFetchResponse } = useFetchResponseHandler()
const newUser = ref()

const listing = ref()
const lookup = ref(null)
const permissions = ref([])

const handleDelete = async (row) => {
  state.users = state.users.filter((item) => item.id !== row.id)
  listing.value.refresh()
}

const state = reactive({
  name: null,
  description: null,
  all_user: false,
  deleted: false,
  permissions: [],
  users: [],
})

const permissionsIds = computed({
  get() {
    return state.permissions.map((p) => p.id)
  },
  set(newPermission) {
    state.permissions = permissions.value.filter((item) => newPermission.indexOf(item.id) !== -1)
  },
})

const editing = computed(() => !!route.params.id)

const load = async () => {
  if (editing.value) {
    const { data, fetchData } = useFetch(`/roles/${route.params.id}`)
    await fetchData()

    Object.keys(state).forEach((key) => {
      if (key in data.value) {
        state[key] = data.value[key]
      }
    })
  }
}

const { columns, options } = useVServerTable()
  .name('users')
  .columns('name', 'login', 'actions')
  .headSkin('table-secondary fw-bold')
  .headings({
    name: 'Nome',
    login: 'Login',
    actions: 'Desassociar',
  })
  .requestFunction(() => ({ data: state.users, count: state.users.length }))
  .skin('table table-bordered table-sm table-hover align-middle')
  .build()

const handleSave = async () => {
  const userIds = state.users.map((item) => item.id)
  const permissionsIds = state.permissions.map((item) => item.id)

  const url = editing.value ? `/roles/${route.params.id}` : '/roles/'
  const { data, error, fetchData } = useFetch(url, {
    method: editing.value ? 'PATCH' : 'POST',
    body: JSON.stringify({ ...state, permissions: permissionsIds, users: userIds }),
  })
  await fetchData()

  handleFetchResponse(error, data, {
    editing,
    state,
    redirectRoute: {
      name: 'roles',
    },
    router,
  })
}
const names = computed(() => [
  {
    label: 'Grupos',
    route: 'roles',
  },
  {
    label: editing.value ? 'Edição' : 'Novo grupo',
  },
])

const addUser = (newUser) => {
  if (newUser !== null) {
    state.users.push(newUser)
    lookup.value.clearSelection()
    lookup.value.cancelEdit(true)
    listing.value.refresh()
  }
  return true
}

const retrieveOptions = async (query) => {
  const { data, fetchData } = useFetch(`/users/?query=${query}&sort_by=name&page_size=10`)
  await fetchData()
  return data.value.items.filter((v) => !state.users.map((p) => p.id).includes(v.id))
}

const clearPermissions = () => {
  state.permissions = []
}

const selectAllPermissions = () => {
  state.permissions = permissions.value
}

onMounted(async () => {
  try {
    const { data, fetchData } = useFetch(`/permissions/?sort_by=name&page_size=30`)
    await fetchData()
    permissions.value = data.value.items
  } catch (error) {
    console.error('Erro ao buscar itens:', error)
  }
})

onMounted(async () => {
  await load()
  listing.value.refresh()
})
</script>
