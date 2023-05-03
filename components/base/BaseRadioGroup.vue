<script setup lang="ts">
  interface OptionsType {
    value: string | number
    label: string
    description: string
  }

  const props = defineProps({
    options: {
      type: Array as PropType<OptionsType[]>,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      required: true,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
  })

  defineEmits(['update:modelValue'])

  const name = toRef(props, 'name')

  const {
    value: optionValue,
    errorMessage,
    handleChange,
  } = useField(name, undefined, {
    initialValue: props.modelValue,
  })
</script>

<template>
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
      :model-value="optionValue"
      :name="name"
      @change="handleChange" />
  </component>
  <BaseErrorMessage :name="name">
    {{ errorMessage }}
  </BaseErrorMessage>
</template>

<style scoped>
  .horizontal {
    margin-right: 20px;
  }
</style>
