<template>
  <img :src="providerImageSrc" alt="" class="logo" :style="cssStyles" />
</template>
<script setup>
import { ref, defineProps, onMounted } from 'vue'

const providerImageSrc = ref()
const props = defineProps({
  type: { type: String, required: true },
  cssStyles: { type: Object },
})
onMounted(async () => {
  try {
    const img = await import(`@/assets/${props.type}.svg`)
    providerImageSrc.value = img.default
  } catch (ignore) {}
})
</script>
<style scoped>
img.logo {
  object-fit: cover;
  border-radius: 2px;
  margin-bottom: 1px;
  padding: 2px;
}
</style>
