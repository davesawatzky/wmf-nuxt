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

  watch(
    () => [
      classesStore.registeredClasses[props.classIndex].selections![
        props.selectionIndex
      ].title,
      classesStore.registeredClasses[props.classIndex].selections![
        props.selectionIndex
      ].composer,
      classesStore.registeredClasses[props.classIndex].selections![
        props.selectionIndex
      ].largerWork,
      classesStore.registeredClasses[props.classIndex].selections![
        props.selectionIndex
      ].movement,
      classesStore.registeredClasses[props.classIndex].selections![
        props.selectionIndex
      ].duration,
    ],
    async (
      [newTitle, newComposer, newLargerWork, newMovement, newDuration],
      [oldTitle, oldComposer, oldLargerWork, oldMovement, oldDuration]
    ) => {
      if (newTitle !== oldTitle) {
        status.title = StatusEnum.saving
        await classesStore.updateSelection(
          props.classId,
          props.selectionId,
          'title'
        )
        status.title = StatusEnum.saved
      }
      if (newComposer !== oldComposer) {
        status.composer = StatusEnum.saving
        await classesStore.updateSelection(
          props.classId,
          props.selectionId,
          'composer'
        )
        status.composer = StatusEnum.saved
      }
      if (newLargerWork !== oldLargerWork) {
        status.largerWork = StatusEnum.saving
        await classesStore.updateSelection(
          props.classId,
          props.selectionId,
          'largerWork'
        )
        status.largerWork = StatusEnum.saved
      }
      if (newMovement !== oldMovement) {
        status.movement = StatusEnum.saving
        await classesStore.updateSelection(
          props.classId,
          props.selectionId,
          'movement'
        )
        status.movement = StatusEnum.saved
      }
      if (newDuration !== oldDuration) {
        status.duration = StatusEnum.saving
        await classesStore.updateSelection(
          props.classId,
          props.selectionId,
          'duration'
        )
        status.duration = StatusEnum.saved
      }
    },
    { flush: 'post' }
  )
</script>

<template>
  <div>
    <h3 class="pt-6">Selection {{ selectionIndex + 1 }}</h3>
    <div class="grid grid-cols-12 gap-x-3 gap-y-1 pt-4 items-end">
      <div class="col-span-12 sm:col-span-7">
        <BaseInput
          v-model="work.title"
          :status="status.title"
          name="title"
          label="Title (including Opus number if applicable)"
          type="text" />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model="work.composer"
          :status="status.composer"
          name="composer"
          label="Composer"
          type="text" />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model="work.largerWork"
          :status="status.largerWork"
          name="largerWork"
          label="Title of Larger Work (if applicable)"
          type="text" />
      </div>
      <div class="col-span-6 sm:col-span-4">
        <BaseInput
          v-model="work.movement"
          :status="status.movement"
          name="movement"
          label="Movement (if applicable)"
          type="text" />
      </div>
      <div class="col-span-6 sm:col-span-3">
        <BaseInput
          v-model="work.duration"
          :status="status.duration"
          name="duration"
          label="Duration"
          type="text" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
