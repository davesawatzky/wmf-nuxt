<script setup lang="ts">
  import type { StatusEnum } from '@/composables/types'

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

  const { value, resetField, errorMessage, meta, handleBlur, handleChange } =
    useField(() => props.name, undefined, {
      validateOnValueUpdate: false,
      initialValue: props.modelValue,
      syncVModel: true,
    })

  const validationListeners = {
    blur: (evt: Event) => handleBlur(evt, true),
    change: (evt: Event) => {
      handleChange(evt, true)
      if (meta.dirty && meta.valid && !!value.value) {
        emit('changeStatus', 'saved')
        resetField({ value: value.value })
      } else if (meta.dirty && !value.value && !!meta.initialValue) {
        emit('changeStatus', 'remove')
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
          class="break-normal">
          {{ label }}
          <BaseHelpButton :help-message="helpMessage" />
        </label>
      </div>
      <div class="grow"></div>
      <BaseSaved
        class="flex-none mr-2"
        :status="status" />
    </div>
    <textarea
      v-bind="{ ...$attrs }"
      :id="uuid"
      type="string"
      :value="value ?? ''"
      :name="name"
      :aria-describedby="errorMessage ? `${uuid}-error` : ''"
      :aria-invalid="errorMessage ? true : false"
      v-on="validationListeners"></textarea>

    <BaseErrorMessage>
      {{ errorMessage }}
    </BaseErrorMessage>
  </div>
</template>
