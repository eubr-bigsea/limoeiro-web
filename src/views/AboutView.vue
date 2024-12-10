<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button v-for="c in types" :class="`me-2 btn btn-${c}`">{{ c }}</button>
  </div>
</template>

<script setup>
const types = [
  'lemonade',
  'primary',
  'secondary',
  'success',
  'danger',
  'info',
  'warning',
  'light',
  'dark',
]
</script>
