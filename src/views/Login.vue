<template>

</template>

<script>
import { authService } from '../services/auth';

export default {
  async created() {
    const urlParams = new URLSearchParams(window.location.search);
    const hasCode = urlParams.has('code');
    const hasState = urlParams.has('state');
    const hasError = urlParams.has('error');

    if (hasError) {
      await authService.logout();
      return;
    }

    if (hasCode && hasState) {
      try {
        await authService.handleCallback();
        this.$router.push('/');
        return;
      } catch (error) {
        console.error('Erro ao processar callback:', error);
        await authService.logout();
        return;
      }
    }

    try {
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        this.$router.push('/');
      } else {
        await authService.login();
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      await authService.logout();
    }
  }
};
</script>
