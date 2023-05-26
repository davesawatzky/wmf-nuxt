<script setup lang="ts">
  import * as yup from 'yup'

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    workNumber: {
      type: Number,
      default: 0,
    },
  })

  const emits = defineEmits(['update:modelValue'])
  const work = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  const validationSchema = yup.object({
    title: yup
      .string()
      .trim()
      .nullable()
      .required('Enter the title of the selection'),
    composer: yup
      .string()
      .trim()
      .nullable()
      .required('Enter the name of the composer'),
    largerWork: yup.string().trim().nullable(),
    movement: yup.string().trim().nullable(),
    duration: yup
      .string()
      .trim()
      .nullable()
      .required('Indicate total duration of selection'),
  })

  useForm({ validationSchema })
</script>

<template>
  <div>
    <h3 class="pt-6">Selection {{ workNumber + 1 }}</h3>
    <div class="grid grid-cols-12 gap-x-3 gap-y-1 pt-4 items-end">
      <div class="col-span-12 sm:col-span-7">
        <BaseInput
          v-model="work.title"
          name="title"
          label="Title (including Opus number if applicable)"
          type="text" />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model="work.composer"
          name="composer"
          label="Composer"
          type="text" />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model="work.largerWork"
          name="largerWork"
          label="Title of Larger Work (if applicable)"
          type="text" />
      </div>
      <div class="col-span-6 sm:col-span-4">
        <BaseInput
          v-model="work.movement"
          name="movement"
          label="Movement (if applicable)"
          type="text" />
      </div>
      <div class="col-span-6 sm:col-span-3">
        <BaseInput
          v-model="work.duration"
          v-maska
          data-maska="##:##"
          name="duration"
          label="Duration"
          type="text" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
