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

  const uuid = UniqueID().getID()

  const { value, resetField, errorMessage, meta, handleChange, validate } =
    useField(() => props.name, undefined, {
      validateOnValueUpdate: true,
      initialValue: props.modelValue,
      syncVModel: true,
    })

  const validationListeners = {
    change: async (evt: Event) => {
      handleChange(evt, true)
      await validate()
      if (value.value && !meta.valid) {
        resetField({ value: props.type === 'number' ? 0 : null })
        emit('changeStatus', 'invalid')
      } else if (!value.value && meta.initialValue) {
        resetField({ value: props.type === 'number' ? 0 : null })
        emit('changeStatus', 'removed')
      } else if (meta.valid) {
        resetField({ value: value.value })
        emit('changeStatus', 'valid')
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
    <BaseErrorMessage>
      {{ errorMessage }}
    </BaseErrorMessage>
    <!-- <BaseErrorMessage> Initial Value: {{ meta.initialValue }} </BaseErrorMessage
    ><BaseErrorMessage>Dirty: {{ meta.dirty }}</BaseErrorMessage
    ><BaseErrorMessage>Valid: {{ meta.valid }}</BaseErrorMessage
    ><BaseErrorMessage>Touched: {{ meta.touched }}</BaseErrorMessage
    ><BaseErrorMessage>Value: {{ value }}</BaseErrorMessage> -->
  </div>
</template>

<style scoped></style>
