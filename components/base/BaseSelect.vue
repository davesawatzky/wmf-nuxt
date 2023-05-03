<script lang="ts" setup>
  interface Options {
    id: string
    name: string
  }

  defineProps({
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array as PropType<Options[]>,
      required: true,
    },
  })

  defineEmits(['update:modelValue'])
  const uuid = UniqueID().getID()
</script>

<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <select
      :id="uuid"
      :value="modelValue"
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
