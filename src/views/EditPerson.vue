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
            :rules="v$.name"
            maxlength="50"
            required
            :focus="true"
          />
        </div>
        <div class="col-xs-12 col-md-4 col-lg-4">
          <label>Usuário</label>
          <LookupComponent
            :fetchFunction="retrieveOptions"
            v-model="user"
            label="name"
            value="id"
            :immediate="false"
          />
        </div>
        <div class="col-xs-12 col-md-2 col-lg-2 mt-4">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="deleted"
            v-model="state.deleted"
          />
          <label class="form-check-label ms-2" for="deleted">Desabilitado</label>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-6 col-lg-6">
          <text-input
            name="description"
            label="Descrição"
            v-model="state.description"
            :rules="v$.description"
            rows="10"
            :multi-line="true"
            :display-errors="false"
          />
        </div>
        <div class="col-xs-12 col-md-6 col-lg-6">
          <text-input
            name="email"
            label="E-mail"
            type="email"
            v-model="state.email"
            :rules="v$.email"
            maxlength="250"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-6 col-lg-6">
          <text-input
            name="company"
            label="Empresa"
            v-model="state.company"
            :rules="v$.company"
            maxlength="100"
          />
        </div>
        <div class="col-xs-12 col-md-6 col-lg-6">
          <text-input
            name="organization"
            label="Organização/Setor/Departamento"
            v-model="state.organization"
            :rules="v$.organization"
            maxlength="100"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-6 col-lg-6">
          <text-input
            name="document"
            label="Documento"
            v-model="state.document"
            :rules="v$.document"
            maxlength="100"
          />
        </div>
        <div class="col-xs-12 col-md-3 col-lg-3">
          <text-input
            name="document_type"
            label="Tipo de documento"
            v-model="state.document_type"
            :rules="v$.document_type"
            maxlength="20"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-3 col-lg-3">
          <text-input
            name="phone_number"
            label="Telefone"
            type="phone"
            v-model="state.phone_number"
            :rules="v$.phone_number"
            maxlength="100"
          />
        </div>
        <div class="col-xs-12 col-md-3 col-lg-3">
          <text-input
            name="cell_phone_number"
            label="Celular"
            type="cellphone"
            v-model="state.cell_phone_number"
            :rules="v$.cell_phone_number"
            maxlength="20"
          />
        </div>
      </div>
      <!-- <div>
        {{ v$.$invalid }}
        Dirty: {{ v$.$dirty }}
        {{ v$.$errors }}
        {{ state }}
        <button @click="v$.$touch()">Validate</button>
        <button @click="v$.$reset()">Validate</button>
      </div> -->
      <edit-buttons
        @save="handleSave"
        :cancelRoute="{ name: 'people' }"
        :save-disabled="v$.$invalid"
      />
    </form>
  </div>
</template>
<script setup>
import { reactive, onMounted, computed, ref } from 'vue'
import { required, email, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useFetch } from '@/composables/useFetch.js'
import { useRoute } from 'vue-router'
import { useFetchResponseHandler } from '@/composables/useFetchResponseHandler'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import TextInput from '@/components/ui/TextInput.vue'
import EditButtons from '@/components/ui/EditButtons.vue'
import LookupComponent from '@/components/ui/LookupComponent.vue'

const route = useRoute()
const { handleFetchResponse } = useFetchResponseHandler()

const brazilianPhone = helpers.withMessage('Telefone incorreto', (value) => {
  if (!value) return true // ✅ Allow empty values
  return /^(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})$/.test(value)
})
// Validation rules
const rules = computed(() => ({
  name: {
    required: helpers.withMessage('Nome é obrigatório', required),
    $autoDirty: true,
  },
  description: { $autoDirty: true },
  deleted: {},
  email: { email: helpers.withMessage('Informe um e-mail válido', email) },
  phone_number: { brazilianPhone },
  cell_phone_number: { brazilianPhone },
}))

const state = reactive({
  name: null,
  description: null,
  deleted: false,
  email: null,
  company: null,
  organization: null,
  phone_number: null,
  cell_phone_number: null,
  document: null,
  document_type: null,
  user_id: null,
})
const user = ref(null) //relationship

const v$ = useVuelidate(rules, state, { $autoDirty: true })
const editing = computed(() => !!route.params.id)

const load = async () => {
  if (editing.value) {
    const { data, fetchData } = useFetch(`/people/${route.params.id}`)
    await fetchData()

    Object.keys(state).forEach((key) => {
      if (key in data.value) {
        state[key] = data.value[key]
      }
    })
    user.value = data.value.user
  }
}
const handleSave = async () => {
  state.user_id = user.value?.id
  const url = editing.value ? `/people/${route.params.id}` : '/people/'
  const { data, error, fetchData } = useFetch(url, {
    method: editing.value ? 'PATCH' : 'POST',
    body: JSON.stringify(state),
  })
  await fetchData()

  handleFetchResponse(error, data, {
    editing,
    state,
    redirectRoute: {
      name: 'edit-person',
      params: { id: data.value?.id },
    },
  })
}
const names = computed(() => [
  {
    label: 'Pessoas',
    route: 'people',
  },
  {
    label: editing.value ? 'Edição' : 'Nova pessoa',
  },
])
const retrieveOptions = async (query) => {
  const { data, fetchData, error } = useFetch(`/users/?query=${query}`)
  await fetchData()
  return data.value.items
}
onMounted(async () => {
  await load()
  //v$.value.$reset()
  v$.value.$validate()
})
</script>
