<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-md-3 col-lg-3 col-sm-9">
          <div class="mb-1">
            <text-input
              name="host"
              label="Servidor"
              v-model="state.host"
              :rules="v$.host"
              maxlength="200"
              required
            />
          </div>
        </div>
        <div class="col-md-2 col-lg-2 col-sm-3">
          <div class="mb-1">
            <text-input
              name="port"
              label="Porta"
              v-model="state.port"
              :rules="v$.port"
              maxlength="5"
              required
              type="number"
              class="w-50"
            />
          </div>
        </div>
        <div class="col-md-3 col-lg-3">
          <div class="mb-1">
            <text-input
              name="database"
              label="Banco de dados"
              v-model="state.database"
              :rules="v$.database"
              maxlength="100"
              required
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 col-lg-3 col-sm-6">
          <div class="mb-1">
            <text-input
              name="user_name"
              label="Usuário"
              v-model="state.user_name"
              :rules="v$.user_name"
              maxlength="100"
              required
              autocomplete="username"
            />
          </div>
        </div>
        <div class="col-md-3 col-lg-3 col-sm-6">
          <div class="mb-1">
            <text-input
              name="password"
              label="Senha"
              v-model="state.password"
              :rules="v$.password"
              maxlength="100"
              required
              type="password"
              autocomplete="current-password"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="mb-1">
            <text-input
              name="extra_parameters"
              label="Parâmetros extra (JSON)"
              v-model="state.extra_parameters"
              :rules="v$.extra_parameters"
              maxlength="10000"
              :multi-line="true"
              rows="5"
            />
          </div>
        </div>
      </div>

      <div class="col-12">
        <button type="submit" class="btn btn-success btn-sm me-1 px-4" :disabled="v$.$invalid">
          <LucideSave size="16px" />
          Salvar
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { onMounted, reactive, defineProps } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, integer, minValue } from '@vuelidate/validators'
import { useFetch } from '@/composables/useFetch.js'
import { LucideSave } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

import TextInput from '@/components/ui/TextInput.vue'
import ErrorDisplay from '@/components/ui/ErrorDisplay.vue'

const toast = useToast()

const props = defineProps({
  connection: { type: Object, required: true },
  provider_id: { type: String, required: true },
})

// Validation rules
const rules = {
  host: {
    required: helpers.withMessage('Servidor é obrigatório', required),
    $autoDirty: true,
  },
  port: {
    required: helpers.withMessage('Porta é obrigatória', required),
    integer: helpers.withMessage('Informe um número', integer),
    minValue: helpers.withMessage('O valor mínimo é 1', minValue(1)),
    $autoDirty: true,
  },
  database: {
    required: helpers.withMessage('Banco de dados é obrigatório', required),
    $autoDirty: true,
  },
  user_name: {
    required: helpers.withMessage('Usuário é obrigatório', required),
    $autoDirty: true,
  },
  password: {
    required: helpers.withMessage('Senha é obrigatória', required),
    $autoDirty: true,
  },
  extra_parameters: {},
}

const defaults = {
  id: null,
  host: null,
  port: null,
  database: null,
  user_name: null,
  password: null,
  extra_parameters: null,
  provider_id: props.provider_id,
}
const state = reactive({ ...defaults, ...(props.connection || {}) })

const v$ = useVuelidate(rules, state)

const handleSubmit = async () => {
  const url = state.id ? `/connections/${state.id}` : '/connections/'
  state.provider_id = props.provider_id

  const method = state.id ? 'PATCH' : 'POST'
  const { data, error, fetchData } = useFetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state),
  })
  await fetchData()
  if (error.value) {
    if ('detail' in error?.value) {
      const msg = []
      error.value.detail.forEach((err) => msg.push({ [err.type]: err.msg }))
      console.table(msg)
      toast.error({ component: ErrorDisplay, props: { errors: error.value } }, { timeout: 5000 })
    } else {
      console.debug(error.value)
    }
  } else {
    Object.keys(state).forEach((key) => {
      if (key in data.value) {
        state[key] = data.value[key]
      }
    })
    toast.success('Dados salvos com sucesso!', { timeout: 5000 })
  }
}
</script>
