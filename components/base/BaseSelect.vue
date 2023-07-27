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

  const emits = defineEmits<{
    'update:modelValue': [value: string | number]
  }>()

  const uuid = UniqueID().getID()

  // Aggressive
  const { value, errorMessage, meta, handleChange, handleBlur } = useField(
    () => props.name,
    undefined,
    {
      initialValue: props.modelValue,
      syncVModel: true,
    }
  )

  const validationListeners = computed(() => {
    // If the field is valid or has not been validated yet
    // lazy
    if (!errorMessage.value) {
      return {
        blur: handleChange,
        change: (e: string | number) => handleChange(e, true),
        // input: (e: string | number) => handleChange(e, false),
      }
    }
    return {
      blur: handleChange,
      change: handleChange,
      // input: handleChange, // only switched this
    }
  })
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
      v-on="validationListeners">
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

<!-- ,
        onChange: ($event) => {
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        }, -->
