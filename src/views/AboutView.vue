<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button v-for="c in types" :class="`me-2 btn btn-${c}`">{{ c }}</button>

    <form class="my-5 mx-4">
      <input
        type="text"
        class="form-control"
        v-model="v$.shippingAddress.$model"
        @blur="$v.shippingAddress.$touch()"
      />
      <div v-if="v$.shippingAddress.$error">shippingAddress field has an error.</div>
      {{ v$.shippingAddress }}
    </form>
    <div class="bg-danger p-2">{{ v$ }}</div>
    <p v-for="error of v$.$errors" :key="error.$uid">
      {{ error.$message }}
    </p>
    <div v-for="c in types" class="alert mt-2 ms-4 w-25 text-white" :class="`bg-${c}`">
      Alerta {{ c }}
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
const types = [
  'lemonade',
  'primary',
  'secondary',
  'success',
  'danger',
  'info',
  'warning',
  'light',
  'dark',
]

const state = reactive({
  shippingAddress: '',
  billingSameAsShipping: false,
  billingAddress: '',
})
const rules = computed(() => {
  const localRules = {
    shippingAddress: { required },
  }
  if (!state.billingSameAsShipping) {
    // if billing is not the same as shipping, require it
    localRules.billingAddress = {
      required,
    }
  }
  return localRules
})
const v$ = useVuelidate(rules, state)
</script>
