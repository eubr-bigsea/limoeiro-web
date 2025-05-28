<template>
  <div>
    <bread-crumb :items="names" />
    <div class="d-flex justify-content-between my-2 border-top border-bottom py-1">
      <h2>{{ route.meta.title }}</h2>
    </div>
    <div class="row">
      <div class="col-9">
        <form @submit.prevent="submitForm" class="px-2 row">
          <div class="col-md-4 col-lg-3">
            <text-input
              name="name"
              label="Nome"
              v-model="state.name"
              :rules="v$.name"
              maxlength="50"
              required
            />
          </div>

          <div class="col-md-4 col-lg-3">
            <select-input
              name="type"
              label="Tipo"
              v-model="state.type"
              :rules="v$.type"
              :options="[
                { value: 'ingestion', label: 'Ingestão' },
                { value: 'profiling', label: 'Análise estatística' },
              ]"
              :include-empty="false"
            />
          </div>

          <div class="col-md-4 col-lg-3">
            <select-input
              name="override_mode"
              label="O que fazer se objeto existir"
              v-model="state.override_mode"
              :rules="v$.override_mode"
              :options="[
                { value: 'override', label: 'Substituir' },
                { value: 'ignore', label: 'Ignorar' },
                { value: 'merge', label: 'Mesclar' },
              ]"
            />
          </div>
          <div class="col-md-12 col-lg-3 mb-1">
            <div class="form-check form-switch mt-4">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="deleted"
                v-model="state.deleted"
              />
              <label class="form-check-label" for="deleted">Desabilitado</label>
            </div>
          </div>

          <div class="col-12 mt-4">
            <h6>Padrões para seleção de banco de dados</h6>
          </div>
          <div class="col-md-6 col-lg-6">
            <text-input
              name="include_database"
              label="Incluir bancos de dados (regex)"
              v-model="state.include_database"
              :rules="v$.include_database"
              maxlength="50"
              :display-error="false"
            />
          </div>
          <div class="col-md-6 col-lg-6">
            <text-input
              name="exclude_database"
              label="Excluir bancos de dados (regex)"
              v-model="state.exclude_database"
              :rules="v$.exclude_database"
              maxlength="50"
              :display-error="false"
            />
          </div>
          <div class="col-12 mt-4">
            <h6>Padrões para seleção de esquema</h6>
          </div>
          <div class="col-md-6 col-lg-6">
            <text-input
              name="include_schema"
              label="Incluir esquemas (regex)"
              v-model="state.include_schema"
              :rules="v$.include_schema"
              maxlength="50"
              :display-error="false"
            />
          </div>
          <div class="col-md-6 col-lg-6">
            <text-input
              name="exclude_schema"
              label="Excluir esquemas (regex)"
              v-model="state.exclude_schema"
              :rules="v$.exclude_schema"
              maxlength="50"
              :display-error="false"
            />
          </div>
          <div class="col-12 mt-4">
            <h6>Padrões para seleção de tabelas</h6>
          </div>
          <div class="col-md-4 col-lg-4">
            <text-input
              name="include_table"
              label="Incluir tabelas (regex)"
              v-model="state.include_table"
              :rules="v$.include_table"
              maxlength="50"
              :display-error="false"
            />
          </div>
          <div class="col-md-4 col-lg-4">
            <text-input
              name="exclude_table"
              label="Excluir tabelas (regex)"
              v-model="state.exclude_table"
              :rules="v$.exclude_table"
              maxlength="50"
              :display-error="false"
            />
          </div>
          <div class="col-md-4 col-lg-4">
            <div class="form-check form-switch mt-4">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="include_view"
                v-model="state.include_view"
              />
              <label class="form-check-label" for="include_view">Incluir views (visões)</label>
            </div>
          </div>
          <div class="col-md-4 col-lg-3 my-1">
            <text-input
              name="retries"
              label="Tentativas"
              v-model="state.retries"
              :rules="v$.retries"
              maxlength="2"
              type="number"
              max="20"
              min="1"
              :display-error="true"
            />
          </div>

          <!-- <div class="bg-info my-4">Form is invalid ?{{ v$.$invalid }} {{ v$.$anyDirty }}</div>
          <div class="bg-info my-4">
            {{ v$.name.$errors }}
            {{ v$.name.$dirty }}
            {{ v$.$errors }}
            <br />
            Error |{{ v$.$dirty }} | Dirty {{ v$.$pending }} | Invalid {{ v$.$invalid }}
            {{ state }}
          </div> -->

          <div class="col-12">
            <button
              type="submit"
              class="btn btn-success btn-sm me-1 px-4"
              :disabled="v$.$invalid"
              @click="handleSave"
            >
              <LucideSave size="16px" />
              Salvar
            </button>
            <router-link
              class="btn btn-secondary btn-sm px-4"
              :to="{
                name: 'explore-database-providers',
                params: { id: route.params.id },
                query: { tab: 2 },
              }"
            >
              Cancelar
            </router-link>
          </div>
        </form>
      </div>
      <div class="col-3 border-start">
        <label class="fw-bold mb-2">Agendamento</label>
        <!--
          <CrontabEditor v-model="state.scheduling_type" format="quartz" />
          -->
        <select v-model="state.scheduling_type" class="form-select form-select-sm">
          <option value="MANUAL">Disparo manual</option>
          <option value="CRON">Recorrente</option>
        </select>

        <div v-if="state.scheduling_type === 'CRON'">
          <div>
            <cron-light
              v-model="state.scheduling"
              @error="state.error = $event"
              locale="pt"
            ></cron-light>
            <div class="mt-3">
              <label>Expressão</label>
              <input type="text" class="form-control form-control-sm" v-model="state.scheduling" />
              <div v-if="state.error" class="mt-3">
                Expressão inválida
                <div class="badge bg-danger fw-normal mt-1">{{ state.error }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { required, helpers, integer, minValue, maxValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useFetch } from '@/composables/useFetch.js'
import { LucideSave } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import ErrorDisplay from '@/components/ui/ErrorDisplay.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import TextInput from '@/components/ui/TextInput.vue'
import CrontabEditor from '@/components/ui/CrontabEditor.vue'

const toast = useToast()
const route = useRoute()
const router = useRouter()

// Validation rules
const rules = {
  name: {
    required: helpers.withMessage('Nome é obrigatório', required),
  },
  type: {
    required: helpers.withMessage('O tipo deve ser selecionado', required),
  },
  retries: {
    integer: helpers.withMessage('Informe um número', integer),
    minValue: helpers.withMessage('O valor mínimo é 1', minValue(1)),
    maxValue: helpers.withMessage('O valor máximo é 20', maxValue(20)),
    required: helpers.withMessage('Tentativas é obrigatório', required),
  },
  override_mode: {},
}

const state = reactive({
  name: null,
  type: 'ingestion',
  override_mode: null,
  include_database: null,
  exclude_database: null,
  include_schema: null,
  exclude_schema: null,
  include_table: null,
  exclude_table: null,
  retries: 5,
  deleted: false,
  include_view: true,
  provider_id: route.params.id,
  scheduling: '* * * * *', // Default crontab value
  value: '* * * * *',
  error: '',
  scheduling_type: 'MANUAL',
 
})

const v$ = useVuelidate(rules, state)

const ingestion = ref()
const editing = computed(() => !!route.params.ingestionId)

const load = async () => {
  if (editing.value) {
    const { data, fetchData } = useFetch(`/ingestions/${route.params.ingestionId}`)
    await fetchData()
    ingestion.value = data.value

    Object.keys(state).forEach((key) => {
      if (key in data.value) {
        state[key] = data.value[key]
      }
    })
  } else {
  }
}
const handleSave = async () => {
  const url = editing.value ? `/ingestions/${route.params.ingestionId}` : '/ingestions/'
  const method = editing.value ? 'PATCH' : 'POST'
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
    console.debug(route.params.ingestionId)
    if (editing.value) {
      Object.keys(state).forEach((key) => {
        if (key in data.value) {
          state[key] = data.value[key]
        }
      })
    } else {
      router.push({
        name: 'explore-database-providers-edit-ingestion',
        params: { id: route.params.id, ingestionId: data.value.id },
      })
    }
    toast.success('Dados salvos com sucesso!', { timeout: 5000 })
  }
}
const names = ref([
  {
    label: 'Explorar',
    route: 'explore',
  },
  {
    label: 'selected.value.display_name',
    route: 'explore-databases',
    id: 1,
  },
])
onMounted(async () => {
  await load()
  //v$.value.$touch()
})
</script>
