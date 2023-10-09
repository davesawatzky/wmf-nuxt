<script setup lang="ts">
  const props = defineProps<{
    label: string
    modelValue: boolean
    name: string
    class: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    changeStatus: [stat: string]
  }>()

  const uuid = UniqueID().getID()
  const name = toRef(props.name)

  const { value, handleChange, checked } = useField(name, undefined, {
    type: 'checkbox',
    checkedValue: true,
    uncheckedValue: false,
    syncVModel: true,
  })
</script>

<template>
  <div :class="class">
    <input
      :id="uuid"
      v-bind="{ ...$attrs }"
      type="checkbox"
      :checked="checked"
      :value="value"
      :name="name"
      @change="handleChange(value)" />
    <label
      v-if="label"
      class="pl-4"
      :for="uuid"
      >{{ label }}</label
    >
  </div>
</template>
