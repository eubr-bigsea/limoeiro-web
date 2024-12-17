import { ref, reactive } from 'vue'

export function useVServerTable() {
  const state = reactive({
    columns: [],
    options: {
      debounce: 800,
      skin: 'table table-hover',
      columnClasses: {},
      preserveState: true,
      saveState: true,
      filterByColumn: false,
      sortIcon: {
        base: 'sort-base',
        is: 'sort-is ml-10',
        up: 'sort-up',
        down: 'sort-down',
      },
      texts: {
        filter: 'Filtros',
        count:
          'Exibindo {from} até {to}, de um total de {count} registros|{count} registros|Um registro',
        limit: 'Limite',
        noResults: 'Sem resultados',
        loading: 'Carregando',
        filterPlaceholder: 'Filtro ',
      },
    },
  })

  return {
    build() {
      return {
        columns: state.columns,
        options: state.options,
      }
    },
    columns(...names) {
      state.columns = names
      return this
    },
    sortable(...names) {
      state.options.sortable = names
      return this
    },
    columnsStyles(styles) {
      state.options.columnsStyles = styles
      return this
    },
    columnsClasses(cls) {
      state.options.columnsClasses = cls
      return this
    },
    headSkin(skin) {
      state.options.headSkin = skin
      return this
    },
    skin(skin) {
      state.options.skin = skin
      return this
    },
    filterable(...names) {
      state.options.filterable = names
      return this
    },
    requestFunction(fn) {
      state.options.requestFunction = fn
      return this
    },
    headings(h) {
      state.options.headings = h
      return this
    },
    saveState(v) {
      state.options.saveState = v
      return this
    },
    perPageValues(v) {
      state.options.perPageValues = v
      return this
    },
    name(v) {
      state.options.name = v
      return this
    },
  }
}
