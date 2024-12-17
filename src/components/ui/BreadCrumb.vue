<template>
  <div v-if="items.length" class="bread-crumb">
    <span v-for="(item, index) in items">
      <span v-if="index !== items.length - 1">
        <router-link :to="{ name: item.route, params: { id: item.id } }">
          {{ item.label }}
        </router-link>
        »
      </span>
      <span v-else>{{ item.label }}</span>
    </span>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
})
</script>
<style lang="scss" scoped>
.bread-crumb {
  font-size: 0.9em;
}
.bread-crumb span {
  margin-right: 5px;
}
</style>
