<script setup>
import { onMounted } from 'vue';
import { authService } from '../services/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
  try {
    const isAuthenticated = await authService.isAuthenticated();
    if (!isAuthenticated) {
      await authService.login(); 
    } else {
      router.push('/'); 
    }
  } catch (error) {
    console.error('Erro no redirecionamento automático:', error);
  }
});
</script>

<template>
  <div >
    <p>Redirecionando para o servidor de autenticação...</p>
  </div>
</template>