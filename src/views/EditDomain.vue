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
        <div class="col-xs-12 col-md-4 col-lg-6 mt-4">
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
        <div class="col-xs-12 col-md-8 col-lg-6">
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
      </div>
      <edit-buttons
        @save="handleSave"
        :cancelRoute="{ name: 'domains' }"
        :save-disabled="v$.$invalid"
      />
    </form>
  </div>
</template>
<script setup>
import { reactive, onMounted, computed } from 'vue'
import { required, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useFetch } from '@/composables/useFetch.js'
import { useRoute } from 'vue-router'
import { useFetchResponseHandler } from '@/composables/useFetchResponseHandler'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import TextInput from '@/components/ui/TextInput.vue'
import EditButtons from '@/components/ui/EditButtons.vue'

const route = useRoute()
const { handleFetchResponse } = useFetchResponseHandler()

// Validation rules
const rules = {
  name: {
    required: helpers.withMessage('Nome é obrigatório', required),
    $autoDirty: true,
  },
  description: { $autoDirty: true },
  deleted: { $autoDirty: true },
}

const state = reactive({
  name: null,
  description: null,
  deleted: false,
})

const v$ = useVuelidate(rules, state)

const editing = computed(() => !!route.params.id)

const load = async () => {
  if (editing.value) {
    const { data, fetchData } = useFetch(`/domains/${route.params.id}`)
    await fetchData()

    Object.keys(state).forEach((key) => {
      if (key in data.value) {
        state[key] = data.value[key]
      }
    })
  }
}
const handleSave = async () => {
  const url = editing.value ? `/domains/${route.params.id}` : '/domains/'
  const { data, error, fetchData } = useFetch(url, {
    method: editing.value ? 'PATCH' : 'POST',
    body: JSON.stringify(state),
  })
  await fetchData()

  handleFetchResponse(error, data, {
    editing,
    state,
    redirectRoute: {
      name: 'edit-domain',
      params: { id: data.value?.id },
    },
  })
}
const names = computed(() => [
  {
    label: 'Domínios',
    route: 'domains',
  },
  {
    label: editing.value ? 'Edição' : 'Novo domínio',
  },
])
onMounted(async () => {
  await load()
  v$.value.$reset()
})
</script>
