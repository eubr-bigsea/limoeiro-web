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

export async function getApimToken() {
  const apimTokenUrl = import.meta.env.VITE_APIM_TOKEN_URL;
  const clientId = import.meta.env.VITE_APIM_CONSUMER_KEY;
  const clientSecret = import.meta.env.VITE_APIM_CONSUMER_SECRET;
  const username = localStorage.getItem('username')

  const body = new URLSearchParams()
  body.append('grant_type', 'client_credentials')
  body.append('client_id', clientId)
  body.append('client_secret', clientSecret)
  body.append('scope', username)

  const response = await fetch(apimTokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })

  const data = await response.json()
  return {
    access_token: data.access_token,
    expires_in: data.expires_in
  }	
}
