<script lang="ts" setup>
  import type { StatusEnum } from '@/composables/types'

  interface Options {
    id: string | number
    name?: string
  }

  const props = defineProps<{
    label?: string
    helpMessage?: string
    status?: StatusEnum
    name: string
    options: Options[]
    modelValue?: string | number | null
    returnId?: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
    changeStatus: [stat: string]
  }>()

  const uuid = UniqueID().getID()

  // Aggressive
  const { value, resetField, errorMessage, meta, handleChange, handleBlur } =
    useField(() => props.name, undefined, {
      validateOnValueUpdate: false,
      initialValue: props.modelValue,
      syncVModel: true,
    })

  const validationListeners = {
    blur: (evt: Event) => handleBlur(evt, true),
    input: async (evt: Event) => {
      await handleChange(evt, true)
      if (meta.valid) {
        emit('changeStatus', 'saved')
      }
    },
  }
</script>

<template>
  <div>
    <div class="flex items-center ml-2">
      <div class="flex-none">
        <label
          v-if="label"
          :for="uuid">
          {{ label }}
          <BaseHelpButton :help-message="helpMessage" />
        </label>
      </div>
      <div class="grow"></div>
      <BaseSaved
        class="flex-none mr-2"
        :status="status" />
    </div>
    <select
      :id="uuid"
      :value="value"
      :name="name"
      v-bind="{ ...$attrs }"
      :aria-describedby="errorMessage ? `${uuid}-error` : ''"
      :aria-invalid="errorMessage ? true : false"
      v-on="validationListeners">
      <option
        v-for="option in options"
        :key="option.id"
        :value="!!returnId ? option.id : option.name"
        :selected="option.name === modelValue">
        {{ option.name }}
      </option>
    </select>
    <BaseErrorMessage> {{ errorMessage }}</BaseErrorMessage>
  </div>
</template>
