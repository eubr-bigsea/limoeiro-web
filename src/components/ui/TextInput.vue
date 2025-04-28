<template>
  <label :for="name" class="control-label" :class="{ required: rules && 'required' in rules }">
    {{ label }}
  </label>
  <input
    v-if="!multiLine"
    :id="name"
    v-model="modelValueProxy"
    type="text"
    class="form-control form-control-sm"
    :class="{ 'border-danger shadow-none': rules?.$errors?.length }"
    v-bind="$attrs"
    @blur="rules?.$touch"
    ref="input"
    :disabled="disabled"
  />
  <textarea
    v-else
    :id="name"
    v-model="modelValueProxy"
    class="form-control form-control-sm"
    :class="{ 'border-danger shadow-none': rules?.$errors?.length }"
    v-bind="$attrs"
    @blur="rules?.$touch"
    ref="input"
    rows="4"
    :disabled="disabled"
  />
  <div v-if="displayError" class="form-text text-danger">
    <span v-for="error in rules?.$errors" :key="error.$uid">
      {{ error.$message }}
    </span>
    &nbsp;
  </div>
</template>
<script setup>
import { defineProps, computed, ref, defineEmits, defineOptions, onMounted } from 'vue'

defineOptions({ inheritAttrs: true })
const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { required: true },
  rules: { type: Object, required: false },
  displayError: { type: Boolean, default: true },
  multiLine: { type: Boolean, default: false },
  focus: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
const emit = defineEmits(['update:modelValue'])
const input = ref()
onMounted(() => {
  if (props.focus) {
    input.value.focus()
  }
})
</script>
