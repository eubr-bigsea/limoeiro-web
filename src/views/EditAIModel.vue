<template>
  <div class="mx-2">
    <bread-crumb :items="names" />
    <div class="d-flex justify -content-between my-2 border-top border-bottom py-1">
      <h2>{{ route.meta.title }}</h2>
    </div>
    {{ state }}
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
        <div class="col-xs-12 col-md-6 col-lg-6">
          <text-input
            name="description"
            label="Descrição"
            v-model="state.description"
            rows="10"
            :multi-line="true"
            :display-errors="false"
          />

        </div>
        <div class="col-xs-12 col-md-6 col-lg-6">
          <select-input
            name="type"
            label="Tipo"
            v-model="state.type"
            :rules="v$.type"
            maxlength="250"
            :options="[
              { value: 'classification', label: 'Classificação' },
              { value: 'regression', label: 'Regressão' },
            ]"
            :include-empty="false"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-6 col-lg-6">
          <text-input
            name="server"
            label="URL do servidor de inferência"
            v-model="state.server"
            :rules="v$.url"
            maxlength="100"
          />
        </div>
        <div class="col-xs-12 col-md-6 col-lg-6">
          <text-input
            name="source"
            label="URL de armazenamento do modelo"
            v-model="state.source"
            :rules="v$.url"
            maxlength="100"
          />
        </div>
        <div class="col-xs-12 col-md-6 col-lg-6 mb-2">
          <div class="d-flex justify-content-between mb-2 px-1">
            Atributos
            <button class="btn btn-outline-secondary btn-sm me-1 px-4" @click="openModal(attributeModal)">
              Adicionar
            </button>
          </div>
          <v-server-table :options="attributeOptions" :columns="attributeColumns" ref="listingAttributes">
            <template #actions="props">
              <row-list-action-buttons
                :row="props.row"
                @edit="(row) => handleEdit(row, state.attributes)"
                @delete="(row) => handleDelete(row, state.attributes)"
              />
            </template>
            <template #deleted="props">
              {{ props.row.deleted ? 'Sim' : 'Não' }}
            </template>
          </v-server-table>
        </div>
        <div class="col-xs-12 col-md-6 col-lg-6">
          <div class="d-flex justify-content-between mb-2 px-1">
            Hiperparâmetros
            <button class="btn btn-outline-secondary btn-sm me-1 px-4" @click="openModal(hyperparameterModal)">
              Adicionar
            </button>
          </div>
          <v-server-table :options="hyperparameterOptions" :columns="hyperparameterColumns" ref="listingHyperparameters">
            <template #actions="props">
              <row-list-action-buttons
                :row="props.row"
                @edit="(row) => handleEdit(row, hyperparameterModal)"
                @delete="(row) => handleDelete(row, state.hyper_parameters)"
              />
            </template>
            <template #deleted="props">
              {{ props.row.deleted ? 'Sim' : 'Não' }}
            </template>
          </v-server-table>
        </div>
      </div>

      <edit-buttons
        @save="handleSave"
        :cancelRoute="{ name: 'explore' }"
        :save-disabled="v$.$invalid"
      />
    </form>
    <ModalWindow
        ref="attributeModal"
        modal-class="modal-window"
        title="Adicionar atributo"
      >
        <template #body>
            <text-input
              name="attribute-name"
              label="Nome"
              v-model="attributeData.name"
            />
            <div class="row align-items-center">
              <div class="col-8">
                <select-input
                  name="attribute-type"
                  label="Tipo"
                  v-model="attributeData.usage"
                  :rules="v$.attributeType"
                  :options="[
                    { value: 'feature', label: 'Feature' },
                    { value: 'target', label: 'Target' },
                  ]"
                  :include-empty="false"
                />
              </div>
              <div class="col-4">
                <input
                  class="attr-check-input"
                  type="checkbox"
                  role="switch"
                  id="deleted"
                  v-model="attributeData.deleted"
                />
                <label class="attr-check-label ms-2" for="deleted">Desabilitado</label>
              </div>
            </div>
            <text-input
              name="attribute-description"
              label="Descrição"
              v-model="attributeData.description"
              :multi-line="true"
            />
        </template>
        <template #footer>
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal(attributeModal)"
            >
              Cancelar
            </button>
            <button v-if="!editing" type="button" class="btn btn-outline-success" @click="addAttribute(attributeData, state.attributes)">
                Adicionar
              </button>
            <button type="button" class="btn btn-success" @click="addAttribute(attributeData, state.attributes);closeModal(attributeModal)">
                {{!editing ? "Adicionar e sair" : "Editar"}}
              </button>
          </template>
      </ModalWindow>
      <ModalWindow
        ref="hyperparameterModal"
        modal-class="modal-window"
        title="Adicionar hiperparâmetro"
      >
        <template #body>
            <div class="row align-items-center">
              <div class="col-8">
                <text-input
                  name="hyperparameter-name"
                  label="Nome"
                  v-model="hyperparameterData.name"
                />
              </div>
              <div class="col-4">
                <text-input
                  name="hyperparameter-value"
                  label="Valor"
                  v-model="hyperparameterData.value"
                />
              </div>
            </div>
            <text-input
              name="hyperparameter-description"
              label="Descrição"
              v-model="hyperparameterData.description"
              :multi-line="true"
            />
        </template>
        <template #footer>
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal(hyperparameterModal)"
            >
              Cancelar
            </button>
            <button v-if="!editing" type="button" class="btn btn-outline-success" @click="addAttribute(hyperparameterData, state.hyper_parameters)">
                Adicionar
              </button>
            <button type="button" class="btn btn-success" @click="addAttribute(hyperparameterData, state.hyper_parameters);closeModal(hyperparameterModal)">
                {{!editing ? "Adicionar e sair" : "Editar"}}
              </button>
          </template>
        </ModalWindow>
  </div>
</template>
<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useVServerTable } from '@/composables/useVServerTable'
import { required, helpers, url } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useFetch } from '@/composables/useFetch.js'
import { useRoute } from 'vue-router'
import { useFetchResponseHandler } from '@/composables/useFetchResponseHandler'
import BreadCrumb from '@/components/ui/BreadCrumb.vue'
import TextInput from '@/components/ui/TextInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import VServerTable from '@/components/VServerTable.vue'
import EditButtons from '@/components/ui/EditButtons.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import RowListActionButtons from '@/components/ui/RowListActionButtons.vue'
import { createRandomId } from '@/util'
import { ref } from 'vue'

const route = useRoute()
const { handleFetchResponse } = useFetchResponseHandler()
var editing = ref(false) // editing parameter or hyperparameter

const newAttribute = () => ({
  id: null, 
  name: null, 
  description: null, 
  deleted: false, 
  usage: "feature"
})
const newHyperparameter = () => ({
  id: null,
  name: null,
  value: null,
  description: null
})

const attributeData = reactive(newAttribute())
const hyperparameterData = reactive(newHyperparameter())

const closeModal = (modal) => {
  editing.value = false
  modal.close()
}

const openModal = (modal) => {
  modal.show()
}

const handleEdit = (row, obj) => {
  editing.value = true
  if (obj == state.attributes){
    Object.assign(attributeData, row)
    openModal(attributeModal.value)
  }
  else{
    Object.assign(hyperparameterData, row)
    openModal(hyperparameterModal.value)
  }
}

// refatorar?
const handleDelete = (row, obj) => {
  if (obj == state.attributes)
  state.attributes = obj.filter(function(o) {
    return o.id !== row.id
  }).map(function(o,index) {
    return {
      ...o,
      id: index
    }
  })
  else
    state.hyper_parameters = obj.filter(function(o) {
    return o.id !== row.id
  }).map(function(o,index) {
    return {
      ...o,
      id: index
    }
  })
  listingAttributes.value.refresh()
  listingHyperparameters.value.refresh()
}

function addAttribute(data, obj) {
  if (data.name != null && data.name != ""){
    if (data.id != null)
      obj[data.id] = {...data}
    else{
      data.id = obj.length
      obj.push({...data})
    }
    if (obj == newAttribute())
      Object.assign(data, newAttribute())
    else{
      Object.assign(data, newHyperparameter())
    }
  listingAttributes.value.refresh()
  listingHyperparameters.value.refresh()
  }
}

// Validation rules
const rules = computed(() => ({
  name: {
    required: helpers.withMessage('Nome é obrigatório', required)
  },
  type: {
    required: helpers.withMessage('O tipo deve ser selecionado', required),
  },
  url: { url: helpers.withMessage('Informe um servidor válido', url) },
  deleted: {},
  //attributeName: {required: helpers.withMessage('Nome é obrigatório', required)},
  attributeType: {},
}))

const attributeModal = ref()
const hyperparameterModal = ref()

const state = reactive({
  name: "",
  get fully_qualified_name() {
    return this.name + '_' + createRandomId()
  },
  get display_name() {
    return this.name
  },
  description: "",
  deleted: false,
  type: null,
  attributes: [],
  hyper_parameters: [],
  server: undefined,
  source: undefined,
})

const { columns: attributeColumns, options: attributeOptions } = useVServerTable()
  .name('attributes')
  .columns('name', 'description', 'deleted', 'usage', 'actions')
  .headSkin('table-primary')
  .headings({
    name: 'Nome',
    description: 'Descrição',
    deleted: 'Desabilitado',
    usage: 'Tipo',
    actions: 'Ações',
  })
  .requestFunction(() => ({data:state.attributes, count: state.attributes.length}))
  .build()

const { columns: hyperparameterColumns, options: hyperparameterOptions } = useVServerTable()
  .name('hyperparameters')
  .columns('name', 'description', 'value', 'actions')
  .headSkin('table-primary')
  .headings({
    name: 'Nome',
    description: 'Descrição',
    value: 'Valor',
    actions: 'Ações',
  })
  .requestFunction(() => ({data:state.hyper_parameters, count: state.hyper_parameters.length}))
  .build()

const listingAttributes = ref()
const listingHyperparameters = ref()
const v$ = useVuelidate(rules, state)


const handleSave = async () => {
  const url = `/ai-models/`
  const { data, error, fetchData } = useFetch(url, {
    method: 'POST',
    body: JSON.stringify(state),
  })
  await fetchData()
  handleFetchResponse(error, data, {
    state,
    redirectRoute: {
      name: 'explore-ai-models',
      params: { id: data.value?.id },
    },
  })
}
const names = computed(() => [
  {
    label: 'Explorar',
    route: 'explore',
  },
  {
    label: 'Novo modelo',
  },
])
onMounted(async () => {
  //await load()
  //v$.value.$reset()
  v$.value.$validate()
})
</script>
