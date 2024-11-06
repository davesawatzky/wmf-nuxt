<script setup lang="ts">
  const props = defineProps<{
    label?: string
    name: string
    helpMessage?: string
    status?: StatusEnum
    placeholder?: string
    modelValue?: string | number | null
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    changeStatus: [stat: string]
  }>()

  const uuid = UniqueID().getID()

  const { value, resetField, errorMessage, meta, validate, handleChange } =
    useField(() => props.name, undefined, {
      validateOnValueUpdate: false,
      initialValue: props.modelValue,
      syncVModel: true,
    })

  const validationListeners = {
    change: async (evt: Event) => {
      handleChange(evt, true)
      await validate()
      if (meta.valid) {
        emit('changeStatus', 'valid')
        resetField({ value: value.value })
      } else if (meta.dirty && !value.value && !!meta.initialValue) {
        emit('changeStatus', 'removed')
        resetField({ value: '' })
      } else if (!meta.valid && value.value) {
        emit('changeStatus', 'invalid')
        resetField({ value: '' })
      }
    },
    input: (evt: Event) => {
      handleChange(evt, !!errorMessage.value)
    },
  }
</script>

<template>
  <div>
    <div class="flex items-center ml-2">
      <div class="flex-none">
        <label
          v-if="label"
          :for="uuid"
          class="baseLabel break-normal">
          {{ label }}
          <BaseHelpButton :help-message="helpMessage" />
        </label>
      </div>
      <div class="grow" />
      <BaseSaved
        class="flex-none mr-2"
        :status="status" />
    </div>
    <textarea
      v-bind="{ ...$attrs }"
      :id="uuid"
      class="baseTextArea"
      type="string"
      autocomplete="off"
      :value="value ?? ''"
      :name="name"
      :aria-describedby="errorMessage ? `${uuid}-error` : ''"
      :aria-invalid="errorMessage ? true : false"
      v-on="validationListeners" />

    <BaseErrorMessage>
      {{ errorMessage }}
    </BaseErrorMessage>
  </div>
</template>
