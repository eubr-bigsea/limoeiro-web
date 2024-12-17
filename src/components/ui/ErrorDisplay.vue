<template>
  <div class="small">
    <p class="fw-bold">Erros reportados:</p>
    <dl v-for="error in errors.detail">
      <dt>{{ error.loc[1] }}</dt>
      <dd>{{ error.msg }}</dd>
    </dl>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  errors: { required: true },
})
</script>
