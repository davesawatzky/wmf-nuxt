<script setup lang="ts">
  const props = defineProps({
    label: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
  })

  defineEmits(['update:modelValue'])

  const uuid = UniqueID().getID()

  const nameRef = toRef(props, 'name')

  const {
    value: inputValue,
    errorMessage,
    handleBlur,
    handleChange,
  } = useField(nameRef, undefined, { initialValue: props.modelValue })
</script>

<template>
  <label
    v-if="label"
    class=""
    :for="uuid"
    >{{ label }}</label
  >
  <textarea
    v-bind="{ ...$attrs }"
    :id="uuid"
    :value="inputValue"
    :aria-describedby="error ? `${uuid}-error` : ''"
    :aria-invalid="error ? true : false"
    @input="handleChange"
    @blur="handleBlur" />

  <BaseErrorMessage v-if="errorMessage">
    {{ errorMessage }}
  </BaseErrorMessage>
</template>
