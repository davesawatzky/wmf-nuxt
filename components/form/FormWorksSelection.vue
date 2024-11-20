<script setup lang="ts">
  import * as yup from 'yup'
  import { useClasses } from '@/stores/useClasses'
  import type {
    RegisteredClass,
    Selection,
    SelectionInput,
  } from '~/graphql/gql/graphql'
  import { useToast } from 'vue-toastification'

  const toast = useToast()

  const props = defineProps<{
    modelValue: SelectionInput
    selectionIndex: number
    selectionId: number
    classIndex: number
    classId: number
  }>()

  const emits = defineEmits<{
    'update:modelValue': [value: SelectionInput]
  }>()

  const classesStore = useClasses()
  const fieldConfigStore = useFieldConfig()
  // const selectionError = ref(0)

  const work = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  const status = reactive<Status>({
    title: props.modelValue.title ? StatusEnum.saved : StatusEnum.null,
    largerWork: props.modelValue.largerWork
      ? StatusEnum.saved
      : StatusEnum.null,
    movement: props.modelValue.movement ? StatusEnum.saved : StatusEnum.null,
    composer: props.modelValue.composer ? StatusEnum.saved : StatusEnum.null,
    duration: props.modelValue.duration ? StatusEnum.saved : StatusEnum.null,
  })

  // async function fieldStatus(stat: string, fieldName: string) {
  //   await nextTick()
  //   status[fieldName] = StatusEnum.pending
  //   const result = await classesStore.updateSelection(
  //     props.classId,
  //     props.selectionId,
  //     fieldName
  //   )
  //   if (result === 'complete') {
  //     if (work.value[fieldName as keyof SelectionInput]) {
  //       status[fieldName] = StatusEnum.saved
  //     } else {
  //       status[fieldName] = StatusEnum.removed
  //     }
  //   } else {
  //     status[fieldName] = StatusEnum.null
  //     work.value[fieldName as keyof SelectionInput] = null
  //     toast.error('Something went wrong. Please exit and reload Registration')
  //   }
  // }

  async function fieldStatus(stat: string, fieldName: string) {
    await nextTick()
    if (stat === 'valid') {
      status[fieldName] = StatusEnum.pending
      const result = await classesStore.updateSelection(
        props.classId,
        props.selectionId,
        fieldName
      )
      status[fieldName] = StatusEnum.null
      if (result === 'complete') {
        if (work.value[fieldName as keyof SelectionInput] !== null) {
          status[fieldName] = StatusEnum.saved
        }
      } else {
        toast.error(
          'Could not update field.  Please exit and reload Registration'
        )
      }
    } else if (stat === 'invalid') {
      status[fieldName] = StatusEnum.pending
      const result = await classesStore.updateSelection(
        props.classId,
        props.selectionId,
        fieldName
      )
      status[fieldName] = StatusEnum.null
      if (result === 'complete') {
        status[fieldName] = StatusEnum.removed
      } else {
        toast.error(
          'Could not remove invalid field. Please exit and reload Registration'
        )
      }
    } else if (stat === 'removed') {
      status[fieldName] = StatusEnum.pending
      const result = await classesStore.updateSelection(
        props.classId,
        props.selectionId,
        fieldName
      )
      status[fieldName] = StatusEnum.null
      if (result === 'complete') {
        status[fieldName] = StatusEnum.removed
      } else {
        toast.error(
          'Could not remove field.  Please exit and reload Registration'
        )
      }
    }
  }

  const validationSchema = toTypedSchema(
    yup.object({
      title: yup.string().trim().required('Required'),
      composer: yup.string().trim().required('Required'),
      largerWork: yup.string().trim().nullable(),
      movement: yup.string().trim().nullable(),
      duration: yup
        .string()
        .matches(/[0-5]{0,1}[0-9]:(?<!00:)[0-5][0-9]/, 'use 01:30 format')
        .trim()
        .required('Required'),
    })
  )

  const selectionKeys = fieldConfigStore.performerTypeFields('Selection')
  watchEffect(() => {
    let count = 0
    for (let key of selectionKeys) {
      if (status[key as keyof Selection] !== StatusEnum.saved) {
        count++
      }
    }
    classesStore.classErrors[props.classIndex].selections[
      props.selectionIndex
    ].count = count
  })

  const { errors, validate } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  onActivated(async () => {
    await validate()
  })
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
          type="text"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'title')
          " />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model="work.composer"
          :status="status.composer"
          name="composer"
          label="Composer"
          type="text"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'composer')
          " />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model="work.largerWork"
          :status="status.largerWork"
          name="largerWork"
          label="Title of Larger Work (if applicable)"
          type="text"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'largerWork')
          " />
      </div>
      <div class="col-span-6 sm:col-span-4">
        <BaseInput
          v-model="work.movement"
          :status="status.movement"
          name="movement"
          label="Movement (if applicable)"
          type="text"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'movement')
          " />
      </div>
      <div class="col-span-6 sm:col-span-3">
        <BaseInput
          v-model="work.duration"
          v-maska
          :status="status.duration"
          placeholder="mm:ss"
          data-maska="A#:A#"
          data-maska-tokens="A:[0-5]"
          data-maska-eager
          name="duration"
          label="Duration"
          type="text"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'duration')
          " />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
