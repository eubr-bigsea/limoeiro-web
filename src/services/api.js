const BASE_URL = import.meta.env.VITE_API_URL

export async function fetchResource(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const response = await fetch(url, options)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'API Error')
  }

  return response.json()
}
