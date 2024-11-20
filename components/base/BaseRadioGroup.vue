<script setup lang="ts">
  interface Options {
    value: string | number
    label: string
    helpMessage?: string
    description?: string
  }

  const props = defineProps<{
    label?: string
    options: Options[]
    helpMessage?: string
    name: string
    status?: StatusEnum
    modelValue?: string | number | null
    vertical?: boolean
  }>()

  const emit = defineEmits<{
    (ev: 'changeStatus', stat: string): void
    (ev: 'update:modelValue', value: any): void
  }>()

  const uuid = UniqueID().getID()

  const { value, resetField, errorMessage, meta, handleChange, validate } =
    useField(() => props.name, undefined, {
      validateOnValueUpdate: false,
      initialValue: props.modelValue,
      syncVModel: true,
    })

  const validationListeners = {
    change: async (evt: Event) => {
      handleChange(evt, true)
      await validate()
      console.log(meta.valid)
      if (meta.valid) {
        emit('changeStatus', 'valid')
        resetField({ value: value.value })
      } else if (!meta.valid && value.value) {
        emit('changeStatus', 'removed')
        resetField({ value: '' })
      }
    },
  }
</script>

<template>
  <fieldset>
    <div class="flex items-center ml-2">
      <div class="flex-none">
        <label
          v-if="label"
          class="baseLabel"
          :for="uuid">
          <h3>{{ label }}</h3>
          <BaseHelpButton :help-message="helpMessage" />
        </label>
      </div>
      <div class="grow" />
      <BaseSaved
        class="flex-none mr-2"
        :status="status" />
    </div>
    <BaseErrorMessage>{{ errorMessage }}</BaseErrorMessage>
    <component
      :is="vertical ? 'div' : 'span'"
      v-for="option in options"
      :key="option.value"
      :class="{
        horizontal: !vertical,
      }">
      <BaseRadio
        :label="option.label"
        :description="option.description"
        :value="option.value"
        :model-value="value ?? undefined"
        :name="props.name"
        v-on="validationListeners" />
    </component>
  </fieldset>
</template>

<style scoped>
  .horizontal {
    margin-right: 20px;
  }
</style>
