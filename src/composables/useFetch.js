import { ref } from 'vue'
import { fetchResource } from '@/services/api.js'

export function useFetch(endpoint) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  const fetchData = async () => {
    isLoading.value = true
    try {
      data.value = await fetchResource(endpoint)
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  return { data, error, isLoading, fetchData }
}
