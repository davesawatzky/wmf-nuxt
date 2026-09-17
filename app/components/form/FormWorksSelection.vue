<script setup lang="ts">
import type { Selection, SelectionInput } from '~/graphql/gql/graphql'
import * as yup from 'yup'
import { useClasses } from '~/stores/useClasses'

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

const {handleError} = useErrorHandler()
const classesStore = useClasses()
const fieldConfigStore = useFieldConfig()

const work = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
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

const FIELD_STATUS_MESSAGES: Record<string, { error: string, userMessage: string }> = {
  valid: {
    error: 'Could not update selection field',
    userMessage: 'Could not update field.  Please exit and reload Registration',
  },
  invalid: {
    error: 'Could not remove invalid selection field',
    userMessage: 'Could not remove invalid field. Please exit and reload Registration',
  },
  removed: {
    error: 'Could not remove selection field',
    userMessage: 'Could not remove field.  Please exit and reload Registration',
  },
}

async function fieldStatus(stat: string, fieldName: string) {
  await nextTick()
  const messages = FIELD_STATUS_MESSAGES[stat]
  if (!messages) return

  status[fieldName] = StatusEnum.pending
  const result = await classesStore.updateSelection(
    props.classId,
    props.selectionId,
    fieldName,
  )
  status[fieldName] = StatusEnum.null

  if (result !== 'complete') {
    handleError(new Error(messages.error), {
      context: {
        classId: props.classId,
        classIndex: props.classIndex,
        selectionId: props.selectionId,
        selectionIndex: props.selectionIndex,
        fieldName: fieldName,
      },
      operation: 'fieldStatus in FormWorksSelection',
      level: 'error',
      toastSeverity: 'error',
      userMessage: messages.userMessage,
    })
    return
  }

  if (stat === 'valid') {
    if (work.value[fieldName as keyof SelectionInput] !== null) {
      status[fieldName] = StatusEnum.saved
    }
  }
  else {
    status[fieldName] = StatusEnum.removed
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
      .matches(/[0-5]?\d:(?<!00:)[0-5]\d/, 'use 01:30 format')
      .trim()
      .required('Required'),
  }),
)

const selectionKeys = fieldConfigStore.performerTypeFields('Selection')
watchEffect(() => {
  let count = 0
  for (const key of selectionKeys) {
    if (status[key as keyof Selection] !== StatusEnum.saved) {
      count++
    }
  }
  classesStore.classErrors[props.classIndex]!.selections[
    props.selectionIndex
  ]!.count = count
})

const { validate } = useForm({
  validationSchema,
  validateOnMount: true,
})

onActivated(async () => {
  await validate()
})
</script>

<template>
  <div>
    <h3 class="pt-6">
      Selection {{ selectionIndex + 1 }}
    </h3>
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
          "
        />
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
          "
        />
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
          "
        />
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
          "
        />
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
          "
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
