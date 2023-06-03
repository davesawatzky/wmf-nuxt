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

  const nameRef = toRef(props, 'name')
  const errorMessage = ref('')

  // const {
  //   value: optionValue,
  //   errorMessage,
  //   handleChange,
  // } = useField(nameRef, undefined, {
  //   initialValue: props.modelValue,
  // })
</script>

<template>
  <div>
  <label>
    <h4>Selections</h4>
  </label>
  <component
    :is="vertical ? 'div' : 'span'"
    v-for="(option, optionIndex) in options"
    :key="option.value"
    :class="{
      horizontal: !vertical,
    }">
    <BaseRadio
      :label="option.label"
      :checked="optionIndex === 0 ? true : false"
      :description="option.description"
      :value="option.value"
      :model-value="option.value"
      :name="props.name"
      @change="$emit('update:modelValue', option.value)" />
  </component>
  <BaseErrorMessage :name="props.name">
    {{ errorMessage }}
  </BaseErrorMessage>
  </div>
</template>

<style scoped>
  .horizontal {
    margin-right: 20px;
  }
</style>
