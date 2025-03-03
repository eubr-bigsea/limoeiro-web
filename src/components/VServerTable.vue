<!-- VServerTable.vue -->
<template>
  <div class="v-server-table-area border p-3 rounded-3">
    <slot v-if="options.filterable" name="filters">
      <div class="filters">
        <form class="mb-4 px-1" @submit.prevent="$event.preventDefault()">
          <div class="justify-content-between d-flex">
            <div class="col-5">
              <label for="filter font-weight-bold">Filtro</label>
              <input
                :value="query"
                type="text"
                placeholder="Busca"
                name="filter"
                autocomplete="off"
                class="form-control form-control-sm"
                maxlength="50"
                @input="search($event)"
              />
            </div>
            <div class="col-5">
              <slot name="afterFilter"></slot>
            </div>
            <div class="col-2 text-end">
              <span
                v-if="perPageValues && perPageValues.length"
                class="form-group form-inline float-end"
              >
                <label :for="`limit-${limitId}`">Limite</label>
                <select
                  v-model="perPage"
                  name="limit"
                  class="form-select form-select-sm"
                  :id="`limit-${limitId}`"
                >
                  <option v-for="value in perPageValues" :key="value" :value="value">
                    {{ value }}
                  </option>
                </select>
              </span>
            </div>
          </div>
        </form>
      </div>
    </slot>
    <table v-show="showSkeleton && firstLoad" class="table b-table table-striped table-bordered">
      <tbody>
        <tr v-for="row in 10" :key="row">
          <td v-for="(col, i) in columns.length" :key="i">
            <div class="skeleton skeleton-text skeleton-animate-wave" style="width: 75%"></div>
          </td>
        </tr>
      </tbody>
    </table>
    <section v-show="!firstLoad">
      <div class="table-area scroll-area">
        <table
          v-if="tableData?.length"
          ref="table"
          class="server-table"
          :class="options.skin"
          :data-name="props.name"
        >
          <colgroup>
            <col
              v-for="(heading, index) in columns"
              :style="getColumnStyle(heading)"
              :key="index"
              class="text-center"
            />
          </colgroup>
          <thead :class="options.headSkin">
            <tr>
              <th
                v-for="(heading, index) in columns"
                :key="index"
                class="header"
                :class="getColumnClass(heading, true)"
                @click="handleSort(heading, $event)"
              >
                {{ getTableHeader(heading) }}
              </th>
            </tr>
          </thead>
          <tbody v-if="tableData.length !== 0">
            <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
              <td v-for="colName in columns" :key="colName" :class="getColumnClass(colName)">
                <slot :name="colName" :row="row">
                  <span :class="`${getColumnClass(colName)}-scoped`">
                    {{ row[colName] }}
                  </span>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <slot name="pagination">
        <div
          v-if="paginationEnabled"
          class="pagination-text text-center d-flex justify-content-between align-items-baseline"
        >
          <p class="pagination-message">{{ pagerMessage }}</p>
          <pager-component
            v-if="tableCount > 0"
            v-model:page="currentPage"
            :total="tableCount"
            :per-page="perPage"
          />
        </div>
      </slot>
    </section>
    <div
      v-if="loading"
      class="text-center preview-loading"
      style="border: none; background: transparent"
    >
      <SpinnerDisplay />
    </div>
  </div>
</template>

<script setup>
import { debounce } from '@/util.js'
import SpinnerDisplay from '@/components/SpinnerDisplay.vue'
import PagerComponent from '@/components/PagerComponent.vue'

import { ref, onMounted, computed, defineProps, watch, shallowRef } from 'vue'
import { useId } from 'vue'

const limitId = useId()

const props = defineProps({
  options: { type: Object, required: true },
  columns: { type: Array, required: true },
  name: { type: String, required: false, default: Math.random().toString(36).slice(2, 7) },
  showSkeleton: { type: Boolean, required: false, default: true },
})

const getTableHeader = (col) =>
  'headings' in props.options && props.options.headings[col]
    ? props.options.headings[col]
    : col.charAt(0).toUpperCase() + col.slice(1)

const loading = ref(false)
const firstLoad = ref(true)
const paginationEnabled = computed(() => {
  return true
})
const tableData = shallowRef([])
const tableCount = ref(0)
const currentPage = ref(1)
const perPage = ref(10)
const sortableColumns = ref(props.options.sortable || [])
const sortDirection = ref('asc')
const sortColumn = ref(props.columns[0])
const table = ref()
const tableCustomQueries = ref()

const sortIcon = ref({
  base: 'sort-base',
  is: 'sort-is ms-10',
  up: 'sort-up',
  down: 'sort-down',
  ...(props.options.sortIcon || {}),
})
const perPageValues = ref(props.options?.perPageValues || [5, 10, 25, 50, 100])

const query = ref()
const setFilter = (value, customQueries) => {
  query.value = value
  tableCustomQueries.value = customQueries
  populateTable()
}
const setCustomQuery = (value) => {
  tableCustomQueries.value = value
}
const search = debounce((ev) => {
  query.value = ev.target.value
  populateTable()
}, props.options.debounce || 500)

const pagerMessage = computed(() => {
  const txt =
    'texts' in props.options
      ? props.options.texts.count
      : 'Showing {from} to {to}, of {count} records|{count} records|One record'
  const parts = txt.split(/\|/)

  if (tableCount.value === 0) {
    return props.options.texts?.noResults || 'No records found'
  } else if (tableCount.value === 1) {
    return parts[2]
  } else if (perPage.value < tableCount.value) {
    return parts[0]
      .replace('{from}', (currentPage.value - 1) * perPage.value + 1)
      .replace('{to}', Math.min(currentPage.value * perPage.value, tableCount.value))
      .replace('{count}', tableCount.value)
  } else {
    return parts[1].replace('{count}', tableCount.value)
  }
})
const populateTable = async () => {
  if (typeof props.options.requestFunction === 'function') {
    const defaultOptions = {
      orderBy: sortColumn.value,
      ascending: sortDirection.value === 'asc' ? 1 : 0,
      limit: perPage.value,
      query: query.value,
      fields: null,
      page: currentPage.value,
      customQueries: tableCustomQueries?.value,
    }
    loading.value = true
    try {
      const { data, count, customQueries } = await props.options.requestFunction(defaultOptions)

      if (props.options?.saveState) {
        tableCustomQueries.value = customQueries
        const params = { orderBy: {} }
        params.orderBy.column = sortColumn.value
        params.orderBy.ascending = sortDirection.value === 'asc'
        params.perPage = perPage.value
        params.query = query.value
        params.page = currentPage.value
        params.customQueries = tableCustomQueries.value
        localStorage[`vuetables_${props.name}`] = JSON.stringify(params)
      }
      tableData.value = data || []
      tableCount.value = count
    } catch (e) {
      throw e
    }
    loading.value = false

    if ((currentPage.value - 1) * perPage.value > tableCount.value) {
      currentPage.value = 1
    }
    firstLoad.value = false
  } else {
    console.error('Invalid requestFunction specified in options')
  }
}

const getColumnClass = (columnName, header) => {
  if (header) {
    const result = {
      'sort-is': sortableColumns.value.includes(columnName),
      'can-be-sorted': sortableColumns.value.includes(columnName),
    }
    const newClasses = props.options?.columnsClasses?.[columnName] || []
    newClasses.forEach((cls) => (result[cls] = true))
    return result
  } else if (props.options.columnsClasses) {
    return props.options.columnsClasses[columnName] || ''
  } else {
    return null
  }
}
const getColumnStyle = (columnName) => {
  if (props.options.columnsStyles && props.options.columnsStyles[columnName]) {
    return props.options.columnsStyles[columnName]
  } else {
    return null
  }
}

const handleSort = (column, event) => {
  if (sortableColumns.value.includes(column)) {
    if (sortColumn.value !== column) {
      sortColumn.value = column
      table.value.querySelectorAll('th.can-be-sorted').forEach((el) => {
        el.classList.remove('sort-up', 'sort-down')
        //el.classList.add('sort-is')
      })
    } else {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    }
    populateTable()
    if (sortDirection.value === 'desc') {
      event.currentTarget.classList.add('sort-up')
      event.currentTarget.classList.remove('sort-down')
    } else {
      event.currentTarget.classList.add('sort-down')
      event.currentTarget.classList.remove('sort-up')
    }
    //event.currentTarget.classList.remove('sort-is')
  }
}
const load = () => {
  if (props.options?.saveState) {
    if (props.options.saveState) {
      const saved = localStorage[`vuetables_${props.name}`]
      if (saved) {
        try {
          const params = JSON.parse(saved)
          sortColumn.value = params.orderBy?.column
          ;(sortDirection.value = params.orderBy.ascending ? 'asc' : 'desc'),
            (perPage.value = params.perPage),
            (query.value = params.query),
            (currentPage.value = params.page)
          tableCustomQueries.value = params.customQueries
        } catch (e) {
          console.debug(e)
          //ignore
        }
      }
    }
  }
  if (props.options?.requestFunction) {
    populateTable()
  }
}
onMounted(load)
//onRenderTriggered(() => load());
const getData = populateTable
const refresh = populateTable
const setCurrentPage = (v) => (currentPage.value = v)
const setFirstLoad = (v) => (firstLoad.value = v)
const setLoading = (v) => (loading.value = v)

watch(currentPage, populateTable)
watch(perPage, populateTable)

defineExpose({
  setFilter,
  getData,
  setCustomQuery,
  refresh,
  setCurrentPage,
  setFirstLoad,
  setLoading,
})
</script>

<style scoped>
div.table-area {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.server-table >>> td {
  padding: 5px 5px;
  font-size: 0.9em;
}
.server-table {
  table-layout: auto;
}

/* Add your component-specific styles here */
.sortable {
  cursor: pointer;
}

.sort-icon {
  margin-left: 5px;
}

/* Add scoped styles for each column */
/*[tableHeadings[colIndex]]-scoped {
  }*/

.pagination {
  margin-top: 10px;
  /* Add styles for pagination container */
}

.pagination-text {
  font-size: 0.9em;
}

.filters {
  background-color: #fafafa;
  padding: 5px;
  border-top: 1px solid #eee;
}

.filters >>> label {
  font-weight: bold;
}

.sort-is {
  position: relative;
  cursor: pointer;
  padding-right: 24px;
}

.sort-is::before,
.sort-is::after {
  content: '';
  position: absolute;
  right: 4px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
}

.sort-is::before {
  top: 40%;
  border-bottom: 6px solid #aaa;
  opacity: 0.5;
}

.sort-is::after {
  top: 60%;
  border-top: 6px solid #888;
  opacity: 0.5;
}

.sort-is:hover::before,
.sort-is:hover::after {
  opacity: 0.8;
}

.sort-up::before {
  border-bottom-color: transparent;
}

.sort-up::after {
  border-top: 6px solid black;
}

.sort-down::before {
  border-bottom: 6px solid black;
}

.sort-down::after {
  border-top-color: transparent;
}
</style>
