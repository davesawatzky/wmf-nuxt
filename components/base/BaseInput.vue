<script setup lang="ts">
  // 	@input ="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"

  interface Props {
    type?: string
    label?: string
    name: string
    placeholder?: string
    status?: string
    modelValue: string | number
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    label: '',
    placeholder: '',
    status: '',
    modelValue: '',
  })

  defineEmits(['update:modelValue'])

  const uuid = UniqueID().getID()
  const nameRef = toRef(props, 'name')
  // Aggressive
  const {
    value: inputValue,
    errorMessage,
    handleChange,
  } = useField(nameRef, undefined, {
    validateOnValueUpdate: false,
    initialValue: props.modelValue,
  })
  const validationListeners = computed(() => {
    // If the field is valid or has not been validated yet
    // lazy
    if (!errorMessage.value) {
      return {
        blur: handleChange,
        change: handleChange,
        // disable `shouldValidate` to avoid validating on input
        input: (e: string | number) => handleChange(e, false),
      }
    }
    return {
      blur: handleChange,
      change: handleChange,
      input: handleChange, // only switched this
    }
  })
</script>

<template>
  <div class="ml-2">
    <label
      v-if="label"
      :for="uuid"
      >{{ label }}</label
    >
  </div>
  <input
    :type="props.type"
    :id="uuid"
    :name="name"
    :placeholder="placeholder"
    v-bind="{ ...$attrs }"
    :value="inputValue"
    :aria-describedby="errorMessage ? `${uuid}-error` : ''"
    :aria-invalid="errorMessage ? true : false"
    v-on="validationListeners" />
  <BaseErrorMessage> {{ errorMessage }}</BaseErrorMessage>
</template>
