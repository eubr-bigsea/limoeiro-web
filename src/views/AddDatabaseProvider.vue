<template>
  <div class="mx-2">
    <bread-crumb :items="names" />
    <div class="d-flex justify-content-between my-2 border-top border-bottom py-1">
      <h2>{{ route.meta.title }}</h2>
    </div>
    <form @submit.prevent="submitForm" class="px-2">
      <text-input
        label="Nome"
        input-class="form-control form-control-sm"
        v-model="state.name"
        :rules="v$.name"
        name="name"
        :focus="true"
      />
      <select-input
        class="form-control form-select form-select-sm"
        v-model="state.provider_type_id"
        :rules="v$.provider_type_id"
        :options="providerTypes"
        label="Tipo"
        name="provider_type_id"
      />
      <edit-buttons
        @save="handleSave"
        :cancelRoute="{ name: 'explore' }"
        :save-disabled="v$.$invalid"
      />
    </form>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { required, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useFetch } from '@/composables/useFetch.js'
import { useRoute } from 'vue-router'
import { useFetchResponseHandler } from '@/composables/useFetchResponseHandler'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import TextInput from '@/components/ui/TextInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import EditButtons from '@/components/ui/EditButtons.vue'

const route = useRoute()
const { handleFetchResponse } = useFetchResponseHandler()

// Validation rules
const rules = computed(() => ({
  name: {
    required: helpers.withMessage('Nome é obrigatório', required),
    $autoDirty: true,
  },
  provider_type_id: {
    $autoDirty: true,
    required: helpers.withMessage('Tipo é obrigatório', required),
  },
}))

const state = reactive({
  name: null,
  provider_type_id: null,
  display_name: null,
})

const v$ = useVuelidate(rules, state, { $autoDirty: true })
const editing = computed(() => !!route.params.id)

const providerTypes = ref([])
const loadProviderTypes = async () => {
  const queryParams = {
    enabled: true,
    sort_by: 'display_name',
  }
  const url = `/database-provider-types/?${new URLSearchParams(queryParams).toString()}`
  const { data, fetchData } = useFetch(url)
  await fetchData()
  providerTypes.value = data.value.items.map((t) => ({ value: t.id, label: t.display_name }))
}

const load = async () => {
  await loadProviderTypes()
}
const handleSave = async () => {
  const url = '/database-providers/'
  state.display_name = state.name
  const { data, error, fetchData } = useFetch(url, {
    method: editing.value ? 'PATCH' : 'POST',
    body: JSON.stringify(state),
  })
  await fetchData()

  handleFetchResponse(error, data, {
    editing,
    state,
    redirectRoute: {
      name: 'edit-provider',
      params: { id: data.value?.id },
    },
  })
}
const names = computed(() => [
  {
    label: 'Provedor de banco de dados',
    route: 'explore',
  },
  {
    label: editing.value ? state.id : 'Novo provedor de dados',
  },
])
onMounted(async () => {
  await load()
  //v$.value.$validate()
})
</script>
