<!-- MarkdownEditor.vue -->
<template>
  <div class="markdown-editor container">
    <div class="toolbar mb-2 d-flex gap-2">
      <div class="dropdown">
        <button
          class="btn btn-outline-secondary btn-sm dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          @click="toggleHeadingDropdown"
        >
          <Heading1 :size="16" /> Heading
        </button>
        <ul class="dropdown-menu">
          <li v-for="level in 6" :key="level">
            <a class="dropdown-item" href="#" @click.prevent="applyFormat('heading', level)">
              H{{ level }}
            </a>
          </li>
        </ul>
      </div>

      <button
        v-for="tool in toolbarItems"
        :key="tool.action"
        class="btn btn-outline-secondary btn-sm"
        @click="applyFormat(tool.action)"
        :title="tool.tooltip"
      >
        <component :is="tool.icon" :size="16" />
      </button>
    </div>
    <div class="row">
      <div class="col-md-6">
        <textarea
          ref="editorTextarea"
          v-model="markdown"
          class="xform-control w-100 border-danger"
          rows="10"
          placeholder="Write your markdown here..."
        ></textarea>
      </div>
      <div class="col-md-6">
        <div class="preview border p-3" v-html="compiledMarkdown"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Heading1,
  Italic,
  Bold,
  ListOrdered,
  List,
  Link,
  Quote,
  Strikethrough,
} from 'lucide-vue-next'
import { marked } from 'marked'
const isHeadingDropdownOpen = ref(false)
// Markdown formatting actions
const markdown = ref('')
const editorTextarea = ref(null)

// Toolbar configuration
const toolbarItems = [
  {
    action: 'heading',
    icon: Heading1,
    tooltip: 'Add Heading',
  },
  {
    action: 'italic',
    icon: Italic,
    tooltip: 'Italic',
  },
  {
    action: 'bold',
    icon: Bold,
    tooltip: 'Bold',
  },
  {
    action: 'strikethrough',
    icon: Strikethrough,
    tooltip: 'Strikethrough',
  },
  {
    action: 'orderedList',
    icon: ListOrdered,
    tooltip: 'Ordered List',
  },
  {
    action: 'unorderedList',
    icon: List,
    tooltip: 'Unordered List',
  },
  {
    action: 'quote',
    icon: Quote,
    tooltip: 'Blockquote',
  },
  {
    action: 'link',
    icon: Link,
    tooltip: 'Insert Link',
  },
]

// Markdown compilation
const compiledMarkdown = computed(() => {
  return marked.parse(markdown.value)
})

// Format application logic
const applyFormat = (action) => {
  const textarea = editorTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = markdown.value.substring(start, end)

  const formatActions = {
    heading: () => `# ${selected || 'Heading'}`,
    italic: () => `*${selected || 'italic text'}*`,
    bold: () => `**${selected || 'bold text'}**`,
    strikethrough: () => `~~${selected || 'strikethrough text'}~~`,
    orderedList: () => `1. ${selected || 'List item'}`,
    unorderedList: () => `- ${selected || 'List item'}`,
    quote: () => `> ${selected || 'Quote'}`,
    link: () => {
      const text = selected || 'Link text'
      const url = prompt('Enter URL:') || '#'
      return `[${text}](${url})`
    },
  }

  const formattedText = formatActions[action]()

  markdown.value =
    markdown.value.substring(0, start) + formattedText + markdown.value.substring(end)

  // Restore focus and set cursor position
  textarea.focus()
  textarea.selectionStart = start + formattedText.length
  textarea.selectionEnd = start + formattedText.length
}

// Dropdown toggle
const toggleHeadingDropdown = () => {
  isHeadingDropdownOpen.value = !isHeadingDropdownOpen.value
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const dropdownContainer = event.target.closest('.position-relative')
  if (!dropdownContainer) {
    closeDropdowns()
  }
}

const closeDropdowns = () => {
  isHeadingDropdownOpen.value = false
}

// Add global click listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Remove global click listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.preview {
  min-height: 250px;
  background-color: #f4f4f4;
  overflow-y: auto;
}
</style>
