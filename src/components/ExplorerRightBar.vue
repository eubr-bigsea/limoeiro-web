<template>
  <div class="right-side">
    <asset-tag-display
      v-model="tags"
      title="Marcadores (Tags)"
      :loading="loadingTags.value"
      class="mb-2 border-bottom pb-3"
      @remove="removeTag"
      @save="saveTag"
    />
    <asset-responsibility-display
      v-model="responsibility"
      title="Responsabilidades"
      :loading="loadingResponsibility.value"
      :asset-id="assetId"
      class="mb-2 border-bottom pb-3"
      @save="saveResponsibility"
      @remove="removeResponsibility"
    />

    <asset-link-display
      title="Links"
      v-model="links"
      missing="Nenhum link associado"
      :loading="loadingLinks.value"
      @save="saveLink"
      @remove="removeLink"
    />
  </div>
</template>

<script setup>
import AssetTagDisplay from '@/components/AssetTagDisplay.vue'
import AssetLinkDisplay from '@/components/AssetLinkDisplay.vue'
import AssetResponsibilityDisplay from '@/components/AssetResponsibilityDisplay.vue'

import { ref, defineProps, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'

const props = defineProps({
  assetId: { type: String, required: true },
})

const tags = ref([])
const links = ref([])
const responsibility = ref([])

const loadingLinks = ref({})
const loadLinks = async () => {
  const { data, fetchData, isLoading } = useFetch(`/assets/links/${props.assetId}`)
  loadingLinks.value = isLoading
  await fetchData()
  links.value = data.value
}

const loadingTags = ref({})
const loadTags = async () => {
  const { data, fetchData, isLoading } = useFetch(`/assets/tags/${props.assetId}`)
  loadingTags.value = isLoading
  await fetchData()
  tags.value = data.value
}

const loadingResponsibility = ref({})
const loadResponsibility = async () => {
  const { data, fetchData, isLoading } = useFetch(`/assets/responsibilities/${props.assetId}`)
  loadingResponsibility.value = isLoading
  await fetchData()
  responsibility.value = data.value
}

onMounted(async () => {
  await Promise.all([loadLinks(), loadTags(), loadResponsibility()])
})

const removeTag = async (tag) => {
  const { fetchData } = useFetch(`/assets/tags/${props.assetId}/${tag.id}`, {
    method: 'DELETE',
  })
  await fetchData()
  await loadTags()
}
const saveTag = async (tag) => {
  const { fetchData } = useFetch(`/assets/tags/${props.assetId}/${tag.id}`, {
    method: 'POST',
  })
  await fetchData()
  await loadTags()
}
const saveLink = async (link) => {
  let url = `/assets/links/${props.assetId}`
  let method = 'POST'
  if (link.id) {
    url = `${url}/${link.id}`
    method = 'PATCH'
  }
  const { fetchData } = useFetch(url, {
    method: method,
    body: JSON.stringify(link),
  })
  await fetchData()
  await loadLinks()
}
const removeLink = async (link) => {
  const { fetchData } = useFetch(`/assets/links/${props.assetId}/${link.id}`, {
    method: 'DELETE',
  })
  await fetchData()
  await loadLinks()
}
const saveResponsibility = async (responsibility) => {
  let url = `/assets/responsibilities/${props.assetId}`
  let method = 'POST'
  if (responsibility.id) {
    url = `${url}/${responsibility.id}`
    method = 'PATCH'
  }
  const { fetchData } = useFetch(url, {
    method: method,
    body: JSON.stringify(responsibility),
  })
  await fetchData()
  await loadResponsibility()
}
const removeResponsibility = async (responsibility) => {
  const { fetchData } = useFetch(
    `/assets/responsibilities/${props.assetId}/${responsibility.contact.id}/${responsibility.type.id}`,
    {
      method: 'DELETE',
    },
  )
  await fetchData()
  await loadResponsibility()
}
</script>
<style scoped>
div.right-side {
  font-size: 0.9em;
  height: 80vh;
  overflow-y: scroll;
}
</style>
