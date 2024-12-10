<template>
  <div class="text-nowrap">
    <div>
      <Server class="icon" />
      <span class="">Provedores de Bancos de Dados</span>
    </div>
    <ul>
      <li v-for="(provider, providerIndex) in tree" :key="`provider-${providerIndex}`">
        <div class="node">
          <span @click="toggleNode(provider, 'database-provider')">
            <ChevronRight v-if="!provider.expanded" class="icon" />
            <ChevronDown v-if="provider.expanded" class="icon" />
          </span>
          <router-link
            :to="{ name: 'explore-database-providers', params: { id: provider.id } }"
            class="text-decoration-none"
            @click="select(provider)"
          >
            <database-provider-logo
              :type="provider.type"
              :css-styles="{ width: 'auto', height: '32px' }"
            />
            {{ provider.label }}
          </router-link>
        </div>
        <ul v-if="provider.expanded">
          <li v-for="(db, dbIndex) in provider.databases" :key="`db-${dbIndex}`">
            <!-- Database Node -->
            <div class="node">
              <span @click="toggleNode(db, 'database')">
                <ChevronRight v-if="!db.expanded" class="icon" />
                <ChevronDown v-if="db.expanded" class="icon" />
              </span>
              <router-link
                :to="{ name: 'explore-databases', params: { id: db.id } }"
                class="text-decoration-none"
              >
                <Database class="icon" />
                {{ db.label }}
              </router-link>
            </div>

            <!-- Schemas -->
            <ul v-if="db.expanded">
              <li v-for="(schema, schemaIndex) in db.schemas" :key="`schema-${schemaIndex}`">
                <div class="node">
                  <span @click="toggleNode(schema, 'schema')">
                    <ChevronRight v-if="!schema.expanded" class="icon" />
                    <ChevronDown v-if="schema.expanded" class="icon" />
                  </span>
                  <router-link
                    :to="{ name: 'explore-schemas', params: { id: schema.id } }"
                    class="text-decoration-none"
                  >
                    <Folder class="icon" />
                    {{ schema.label }}
                  </router-link>
                </div>

                <!-- Tables -->
                <ul v-if="schema.expanded">
                  <li v-for="(table, tableIndex) in schema.tables" :key="`table-${tableIndex}`">
                    <div class="node">
                      <router-link
                        :to="{ name: 'explore-tables', params: { id: table.id } }"
                        class="text-decoration-none"
                      >
                        <Table2 class="icon ms-4" />
                        {{ table.label }}
                      </router-link>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, defineEmits, onMounted, defineProps } from 'vue'
import { ChevronRight, ChevronDown, Database, Folder, Table2, Server } from 'lucide-vue-next'
import DatabaseProviderLogo from './ui/DatabaseProviderLogo.vue'

const props = defineProps({
  tree: { type: Array, required: true },
  selected: { type: Object, required: false },
})

onMounted(() => {
  emit('update', 0, null)
})
const toggleNode = (node, type) => {
  if (!node.expanded) {
    emit('toggleNode', node, type)
  }
  node.expanded = !node.expanded
}
let currentSelected = { selected: false }
const select = (node) => {
  if (currentSelected.selected) {
    currentSelected.selected = false
  }
  currentSelected = node
  currentSelected.selected = true
}
const emit = defineEmits(['update', 'toggleNode'])
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 1rem;
}

.node {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.icon {
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
}
.node >>> .router-link-exact-active {
  font-weight: bold;
}
</style>
