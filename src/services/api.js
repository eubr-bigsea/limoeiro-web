const BASE_URL = import.meta.env.VITE_API_URL

export async function fetchResource(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const response = await fetch(url, options)

  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  if (response.status != 204) {
    return response.json()
  } else {
    return null
  }
}
