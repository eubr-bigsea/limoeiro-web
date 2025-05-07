import { ref } from 'vue'
import { getApimToken } from '@/services/api.js'

const token = ref(null)

export async function useAuthToken() {
  const storedToken = localStorage.getItem('apim_token')
  const storedExpiry = localStorage.getItem('apim_token_expiry')

  const now = Date.now();
  const isExpired = !storedExpiry || now > Number(storedExpiry);

  if (!storedToken || isExpired) {
    const { access_token, expires_in } = await getApimToken();
    const expiryTime = now + expires_in * 1000;

    localStorage.setItem('apim_token', access_token)
    localStorage.setItem('apim_token_expiry', expiryTime.toString())

    token.value = access_token
  } else {
    token.value = storedToken
  }

  return token.value
}
