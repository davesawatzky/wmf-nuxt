<script setup lang="ts">
  import type { StatusEnum } from '@/composables/types'

  interface Props {
    type?: string
    label?: string
    helpMessage?: string
    status?: StatusEnum
    name: string
    placeholder?: string
    modelValue?: string | number
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
    changeStatus: [stat: string]
  }>()

  const uuid = UniqueID().getID()

  const { value, resetField, errorMessage, meta, handleChange, handleBlur } =
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
    <input
      :id="uuid"
      :type="props.type"
      :name="name"
      :placeholder="placeholder"
      v-bind="{ ...$attrs }"
      :value="value"
      :aria-describedby="errorMessage ? `${uuid}-error` : ''"
      :aria-invalid="errorMessage ? true : false"
      v-on="validationListeners" />
    <BaseErrorMessage>
      {{ errorMessage }}
    </BaseErrorMessage>
  </div>
</template>
