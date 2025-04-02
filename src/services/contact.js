import { useFetch } from '@/composables/useFetch'

export async function getContacts(query) {
  const { data, fetchData, error } = useFetch(`/contacts/?sort_by=name&query=${query}`)
  await fetchData()
  return { contacts: data.value.items, error }
}
