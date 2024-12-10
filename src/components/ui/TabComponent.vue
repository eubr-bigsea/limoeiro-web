<!-- TabComponent.vue -->
<template>
  <div class="tab-container">
    <ul :class="cssClass" role="tablist" class="nav">
      <li v-for="(tab, index) in tabs" :key="index" class="nav-item" role="presentation">
        <button
          :class="['nav-link', { active: activeTab === index }]"
          @click="setActiveTab(index)"
          role="tab"
        >
          {{ tab.title }}
        </button>
      </li>
    </ul>
    <div class="tab-content mt-3">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['tab-pane', { 'show active': activeTab === index }]"
        role="tabpanel"
      >
        <slot :name="tab.slotName" :active="activeTab === index"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  cssClass: { type: String },
})

const activeTab = ref(0)

const setActiveTab = (index) => {
  activeTab.value = index
}
</script>
