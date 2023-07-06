<script lang="ts" setup>
  import { StatusEnum } from '@/composables/types'

  interface Options {
    id: string
    name: string
  }

  interface Props {
    label?: string
    modelValue: string | number
    options: Options[]
    status?: StatusEnum
    name: string
    helpMessage?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    status: StatusEnum.null,
    modelValue: '',
    name: '',
    helpMessage: '',
  })

  defineEmits<{
    'update:modelValue': [value: string | number]
  }>()

  const uuid = UniqueID().getID()
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
      :value="modelValue"
      :name="name"
      v-bind="{
        ...$attrs,
        onChange: ($event) => {
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        },
      }">
      <option
        v-for="option in options"
        :key="option.id"
        :value="option.name"
        :selected="option.name === modelValue">
        {{ option.name }}
      </option>
    </select>
  </div>
</template>
