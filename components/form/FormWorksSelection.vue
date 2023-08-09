<script setup lang="ts">
  import * as yup from 'yup'
  import { useClasses } from '@/stores/userClasses'
  import type { SelectionInput } from '~/graphql/gql/graphql'
  import type { Status } from '@/composables/types'

  const props = defineProps<{
    modelValue: SelectionInput
    selectionIndex: number
    selectionId: number
    classIndex: number
    classId: number
  }>()

  const emits = defineEmits<{ 'update:modelValue': [SelectionInput] }>()

  const classesStore = useClasses()
  const status = reactive<Status>({
    title: StatusEnum.null,
    largerWork: StatusEnum.null,
    movement: StatusEnum.null,
    composer: StatusEnum.null,
    duration: StatusEnum.null,
  })

  const work = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  // const validationSchema = toTypedSchema(
  //   yup.object({
  //     selection: yup.array().of(
  //       yup.object({
  //         title: yup
  //           .string()
  //           .trim()
  //           .required('Enter the title of the selection'),
  //         composer: yup
  //           .string()
  //           .trim()
  //           .required('Enter the name of the composer'),
  //         largerWork: yup.string().trim().nullable(),
  //         movement: yup.string().trim().nullable(),
  //         duration: yup
  //           .string()
  //           .trim()
  //           .required('Indicate total duration of selection'),
  //       })
  //     ),
  //   })
  // )

  // useForm({ validationSchema })

  async function fieldStatus(fieldName: string) {
    status[fieldName] = StatusEnum.pending
    await classesStore.updateSelection(
      props.classId,
      props.selectionId,
      fieldName
    )
    status[fieldName] = StatusEnum.saved
  }
</script>

<template>
  <div>
    <h3 class="pt-6">Selection {{ selectionIndex + 1 }}</h3>
    <div class="grid grid-cols-12 gap-x-3 gap-y-1 pt-4 items-end">
      <div class="col-span-12 sm:col-span-7">
        <BaseInput
          v-model="work.title"
          :status="status.title"
          :name="`selection_${selectionId}.title`"
          label="Title (including Opus number if applicable)"
          type="text"
          @change="fieldStatus('title')" />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model="work.composer"
          :status="status.composer"
          :name="`selection_${selectionId}.composer`"
          label="Composer"
          type="text"
          @change="fieldStatus('composer')" />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model="work.largerWork"
          :status="status.largerWork"
          :name="`selection_${selectionId}.largerWork`"
          label="Title of Larger Work (if applicable)"
          type="text"
          @change="fieldStatus('largerWork')" />
      </div>
      <div class="col-span-6 sm:col-span-4">
        <BaseInput
          v-model="work.movement"
          :status="status.movement"
          :name="`selection_${selectionId}.movement`"
          label="Movement (if applicable)"
          type="text"
          @change="fieldStatus('movement')" />
      </div>
      <div class="col-span-6 sm:col-span-3">
        <BaseInput
          v-model="work.duration"
          :status="status.duration"
          :name="`selection_${selectionId}.duration`"
          label="Duration"
          type="text"
          @change="fieldStatus('duration')" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
