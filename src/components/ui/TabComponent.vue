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
import { ref, defineExpose, defineEmits } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  cssClass: { type: String },
  activeTab: { type: Number, default: 0 },
})

const activeTab = ref(props.activeTab)

//const emit = defineEmits([''])
const setActiveTab = (index) => {
  activeTab.value = index
  if (props.tabs[index].onActivate) {
    props.tabs[index].onActivate()
  }
}
defineExpose({ setActiveTab })
</script>
