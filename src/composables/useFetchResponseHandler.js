import { ref } from 'vue'
import ErrorDisplay from '@/components/ui/ErrorDisplay.vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

export function useFetchResponseHandler() {
  const handleFetchResponse = (error, data, options = {}) => {
    const toast = useToast()
    // const router = useRouter()
    const {
      editing = ref(false),
      state = {},
      successMessage = 'Dados salvos com sucesso!',
      redirectRoute,
    } = options

    if (error.value) {
      if ('detail' in error.value) {
        // Log detailed errors in a table
        const msg = error.value.detail?.map((err) => ({ [err.type]: err.msg })) || []
        console.table(msg)

        // Display error toast with ErrorDisplay component
        toast.error(
          {
            component: ErrorDisplay,
            props: { errors: error.value },
          },
          { timeout: 5000 },
        )
      } else {
        // Log non-detailed errors in debug mode
        console.debug(error.value)
      }
    } else {
      // Success scenario
      if (editing.value) {
        // Update state with fetched data
        Object.keys(state).forEach((key) => {
          if (data.value && key in data.value) {
            state[key] = data.value[key]
          }
        })
        // } else if (router && redirectRoute) {
        //   // Redirect to specified route if not in editing mode
        //   router.push({
        //     name: redirectRoute.name,
        //     params: redirectRoute.params || {},
        //   })
      }

      // Show success toast
      toast.success(successMessage, { timeout: 5000 })
    }
  }

  return { handleFetchResponse }
}
