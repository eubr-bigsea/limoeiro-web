<template>
    <div>Processando login...</div>
  </template>
  
  <script>
  import { authService } from '../services/auth';
  export default {
    async created() {
      try {
        await authService.handleCallback();
        this.$router.push('/');
      } catch (error) {
        this.$router.push('/auth');
      }
    }
  };
</script>