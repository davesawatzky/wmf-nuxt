<script setup lang="ts">
  import type { StatusEnum } from '@/composables/types'

  interface Checkbox {
    label?: string
    modelValue?: boolean | null
    name?: string
    class?: string
    status?: StatusEnum
    helpMessage?: string
  }

  const props = withDefaults(defineProps<Checkbox>(), {
    label: '',
    modelValue: false,
    name: '',
    class: '',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    changeStatus: [stat: string]
  }>()

  const uuid = UniqueID().getID()
  const name = toRef(props.name)

  const { value, handleChange, handleBlur, meta, errorMessage, checked } =
    useField(name, undefined, {
      type: 'checkbox',
      checkedValue: true,
      uncheckedValue: false,
      initialValue: props.modelValue,
      syncVModel: true,
    })

  const validationListeners = {
    blur: (evt: Event) => handleBlur(evt, true),
    change: (evt: Event) => {
      handleChange(evt, true)
      if (meta.valid) {
        emit('changeStatus', 'saved')
      }
    },
    input: (evt: Event) => {
      handleChange(evt, !!errorMessage.value)
    },
  }
</script>

<template>
  <div class="py-1">
    <div :class="class">
      <input
        :id="uuid"
        v-bind="{ ...$attrs }"
        type="checkbox"
        :checked="checked"
        :value="value"
        :name="name"
        v-on="validationListeners" />
      <label
        v-if="label"
        :for="uuid"
        class="flex-none ml-3">
        {{ label }}
      </label>
      <BaseHelpButton :help-message="helpMessage" />
      <BaseSaved
        class="flex-none mr-2"
        :status="status" />
    </div>
    <BaseErrorMessage v-if="errorMessage">
      {{ errorMessage }}
    </BaseErrorMessage>
  </div>
</template>
