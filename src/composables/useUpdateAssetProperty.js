import { ref } from 'vue'
import { useFetch } from './useFetch'
import { useFetchResponseHandler } from './useFetchResponseHandler'

export function useUpdateAssetProperty(assetPath) {
  const asset = ref(null)
  const update = async (property, value) => {
    const url = `/${assetPath}/${asset.value.id}`
    if (value === undefined) {
      value = null
    }
    const { data, error, fetchData } = useFetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [property]: value }),
    })
    await fetchData()
    const { handleFetchResponse } = useFetchResponseHandler()
    handleFetchResponse(error, data)
    return { data, error }
  }

  return { asset, update }
}
