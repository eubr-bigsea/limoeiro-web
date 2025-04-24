import { ref } from 'vue'
import { fetchResource } from '@/services/api.js'
import { useAuthToken } from '@/composables/useAuthToken.js'  

export function useFetch(endpoint, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  const fetchData = async () => {
    isLoading.value = true
    const token = await useAuthToken()

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    try {
      data.value = await fetchResource(endpoint, {
        ...options,
        headers,
      })
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  return { data, error, isLoading, fetchData }
}