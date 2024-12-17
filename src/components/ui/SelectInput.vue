<template>
  <label :for="name" class="control-label" :class="{ required: rules && 'required' in rules }">
    {{ label }}
  </label>
  <select
    :id="name"
    v-model="modelValueProxy"
    v-bind="$attrs"
    class="form-select form-select-sm"
    :class="{ 'border-danger shadow-none': rules.$errors.length }"
    @blur="rules.$touch"
  >
    <option v-if="includeEmpty"></option>
    <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
  </select>
  <div class="form-text text-danger">
    <span v-for="error in rules.$errors" :key="error.$uid">
      {{ error.$message }}
    </span>
    &nbsp;
  </div>
</template>
<script setup>
import { defineProps, computed, ref, defineEmits, defineOptions } from 'vue'

defineOptions({ inheritAttrs: true })
const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { required: true },
  rules: { type: Object, required: true },
  options: { type: Array, required: true },
  includeEmpty: { type: Boolean, required: false, default: true },
})
const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
const emit = defineEmits(['update:modelValue'])
</script>
