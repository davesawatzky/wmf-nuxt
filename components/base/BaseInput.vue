<script setup lang="ts">
  // 	@input ="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"

  interface Props {
    type?: string
    label?: string
    helpMessage?: string
    name: string
    placeholder?: string
    status?: null | 'saving' | 'saved'
    modelValue: string | number
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    label: '',
    placeholder: '',
    status: null,
    modelValue: '',
  })

  defineEmits<{
    (event: 'update:modelValue', payload: string | number): void
  }>()

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
        change: (e: string | number) => handleChange(e, false),
        // disable `shouldValidate` to avoid validating on input
        // input: (e: string | number) => handleChange(e, false),
      }
    }
    return {
      blur: handleChange,
      change: handleChange,
      // input: handleChange, // only switched this
    }
  })

  const msg = () => alert(props.helpMessage)
</script>

<template>
  <div>
    <div class="flex items-center ml-2">
      <div class="flex-none">
        <label
          v-if="label"
          :for="uuid">
          {{ label }}
          <button
            v-if="helpMessage"
            @click="msg">
            <Icon
              class="text-lg"
              name="fluent:question-circle-12-filled" />
          </button>
        </label>
      </div>
      <div class="grow"></div>
      <div class="flex-none mr-2">
        <Icon
          v-if="status === 'saving'"
          class="animate-spin"
          name="icomoon-free:spinner9" />
        <BaseSaved v-else-if="status === 'saved'" />
      </div>
    </div>
    <input
      :id="uuid"
      :type="props.type"
      :name="name"
      :placeholder="placeholder"
      v-bind="{ ...$attrs }"
      :value="inputValue"
      :aria-describedby="errorMessage ? `${uuid}-error` : ''"
      :aria-invalid="errorMessage ? true : false"
      v-on="validationListeners" />
    <BaseErrorMessage> {{ errorMessage }}</BaseErrorMessage>
  </div>
</template>
