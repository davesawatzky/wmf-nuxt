<script setup lang="ts">
  import type { StatusEnum } from '@/composables/types'

  interface Options {
    val: string | number
    label: string
    helpMessage?: string
    description: string
  }

  interface Props {
    label?: string
    options: Options[]
    helpMessage?: string
    name: string
    status?: StatusEnum
    modelValue?: string | number
    vertical?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    vertical: false,
  })

  const emit = defineEmits<{
    (ev: 'changeStatus', stat: string): void
    (ev: 'update:modelValue', value: any): void
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
      if ((meta.dirty && meta.valid && !!value.value) || !meta.initialValue) {
        emit('changeStatus', 'saved')
        resetField({ value: value.value })
      } else if (meta.dirty && !value.value && !!meta.initialValue) {
        emit('changeStatus', 'remove')
        resetField({ value: '' })
      }
    },
    input: (evt: Event) => {
      handleChange(evt, true)
    },
  }
</script>

<template>
  <fieldset>
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
    <BaseErrorMessage>{{ errorMessage }}</BaseErrorMessage>
    <component
      :is="vertical ? 'div' : 'span'"
      v-for="option in options"
      :key="option.val"
      :class="{
        horizontal: !vertical,
      }">
      <BaseRadio
        :label="option.label"
        :description="option.description"
        :val="option.val"
        :model-value="value"
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
