<script setup lang="ts">
  interface Props {
    type?: string
    label?: string
    helpMessage?: string
    autocomplete?: string
    status?: StatusEnum
    name: string
    placeholder?: string
    modelValue?: string | number | null
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    label: '',
    helpMessage: undefined,
    status: StatusEnum.null,
    placeholder: '',
    modelValue: null,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
    changeStatus: [stat: string]
  }>()

  const name = toRef(props, 'name')

  const uuid = UniqueID().getID()

  const { value, resetField, errorMessage, meta, handleChange, validate } =
    useField(() => props.name, undefined, {
      validateOnValueUpdate: false,
      initialValue: props.modelValue,
      syncVModel: true,
    })

  const validationListeners = {
    input: (evt: Event) => {
      // Only validate after first blur (when field is touched)
      handleChange(evt, meta.touched && !!errorMessage.value)
    },
    change: async (evt: Event) => {
      handleChange(evt, !!errorMessage.value)
      await validate()
      if (!meta.valid && value.value) {
        emit('changeStatus', 'invalid')
      } else if (!meta.valid! && !value.value) {
        resetField({ value: props.type === 'number' ? 0 : null })
        emit('changeStatus', 'invalid')
      } else if (meta.valid) {
        resetField({ value: value.value })
        emit('changeStatus', 'valid')
      }
    },
  }
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center ml-2">
      <div class="">
        <label
          v-if="label"
          class="baseLabel"
          :for="uuid">
          {{ label }}
          <BaseHelpButton :help-message="helpMessage" />
        </label>
      </div>
      <div class="grow" />
      <BaseSaved
        class="flex-none mr-2"
        :status="status" />
    </div>
    <input
      :id="uuid"
      class="baseInput"
      :type="props.type"
      :name="name"
      :placeholder="placeholder"
      v-bind="{ ...$attrs }"
      :value="value"
      :aria-describedby="errorMessage ? `${uuid}-error` : ''"
      :aria-invalid="errorMessage ? true : false"
      v-on="validationListeners" />
    <BaseErrorMessage :data-testid="errorMessage ? 'input-error' : ''">
      {{ errorMessage }}
    </BaseErrorMessage>
  </div>
</template>

<style scoped></style>
