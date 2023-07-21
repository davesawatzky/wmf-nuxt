<script setup lang="ts">
  interface OptionsType {
    value: string | number
    label: string
    description: string
  }

  interface Props {
    options: OptionsType[]
    name: string
    modelValue: string | number
    vertical: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    vertical: false,
  })

  const emits = defineEmits<{
    'update:modelValue': [value: string | number]
  }>()

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
      v-for="option in options"
      :key="option.value"
      :class="{
        horizontal: !vertical,
      }">
      <BaseRadio
        :label="option.label"
        :checked="props.modelValue === option.value ? true : false"
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
