<script setup lang="ts">
import type {
  CommunityGroup,
  CommunityGroupInput,
} from '~/graphql/gql/graphql'
import * as yup from 'yup'
import { useCommunityGroup } from '~/stores/useCommunityGroup'

const props = defineProps<{
  modelValue: CommunityGroupInput
  communityGroupIndex: number
  communityGroupId: number
}>()

const emits = defineEmits<{
  'update:modelValue': [value: CommunityGroupInput]
}>()

const communityGroupStore = useCommunityGroup()
const fieldConfigStore = useFieldConfig()
const { handleError } = useErrorHandler()

const communityGroup = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})

const status = reactive<Status>({
  name: props.modelValue.name ? StatusEnum.saved : StatusEnum.null,
  earliestTime: props.modelValue.earliestTime
    ? StatusEnum.saved
    : StatusEnum.null,
  latestTime: props.modelValue.latestTime
    ? StatusEnum.saved
    : StatusEnum.null,
  groupSize:
      props.modelValue.groupSize || props.modelValue.groupSize === 0
        ? StatusEnum.saved
        : StatusEnum.null,
  chaperones:
      props.modelValue.chaperones || props.modelValue.chaperones === 0
        ? StatusEnum.saved
        : StatusEnum.null,
  wheelchairs:
      props.modelValue.wheelchairs || props.modelValue.wheelchairs === 0
        ? StatusEnum.saved
        : StatusEnum.null,
  unavailable: props.modelValue.unavailable
    ? StatusEnum.saved
    : StatusEnum.null,
  conflictPerformers: props.modelValue.conflictPerformers
    ? StatusEnum.saved
    : StatusEnum.null,
  photoPermission: props.modelValue.photoPermission
    ? StatusEnum.saved
    : StatusEnum.null,
})

const totalParticipants = computed<number>(() => {
  return (
    (communityGroup.value.groupSize ?? 0)
    + (communityGroup.value.chaperones ?? 0)
    + (communityGroup.value.wheelchairs ?? 0)
  )
})

const FIELD_STATUS_MESSAGES: Record<string, { error: string, userMessage: string }> = {
  valid: {
    error: 'Could not update community group field',
    userMessage: 'Could not update field.  Please exit and reload Registration',
  },
  invalid: {
    error: 'Could not remove invalid community group field',
    userMessage: 'Could not remove invalid field. Please exit and reload Registration',
  },
  removed: {
    error: 'Could not remove community group field',
    userMessage: 'Could not remove field.  Please exit and reload Registration',
  },
}

async function fieldStatus(stat: string, fieldName: string) {
  await nextTick()
  const messages = FIELD_STATUS_MESSAGES[stat]
  if (!messages) return

  status[fieldName] = StatusEnum.pending
  const result = await communityGroupStore.updateCommunityGroup(
    props.communityGroupId,
    fieldName,
  )
  status[fieldName] = StatusEnum.null

  if (result !== 'complete') {
    handleError(new Error(messages.error), {
      context: {
        communityGroupId: props.communityGroupId,
        communityGroupIndex: props.communityGroupIndex,
        fieldName: fieldName,
      },
      operation: 'fieldStatus in CommunityGroup',
      level: 'error',
      toastSeverity: 'error',
      userMessage: messages.userMessage,
    })
    return
  }

  if (stat === 'valid') {
    if (
      communityGroup.value[fieldName as keyof CommunityGroupInput] !== null
    ) {
      status[fieldName] = StatusEnum.saved
    }
  }
  else {
    status[fieldName] = StatusEnum.removed
  }
}

const validationSchema = toTypedSchema(
  yup.object({
    groupName: yup.string().trim().required('Required'),
    earliestTime: yup
      .string()
      .matches(/[01]?\d:[0-5]\d/, 'Enter a time')
      .default('08:00')
      .required('Required'),
    latestTime: yup
      .string()
      .matches(/[01]?\d:[0-5]\d/, 'Enter a time')
      .default('17:00')
      .required('Required'),
    groupSize: yup
      .number()
      .min(2)
      .max(300)
      .integer()
      .typeError('Please enter a valid number')
      .required('Required'),
    chaperones: yup
      .number()
      .min(0)
      .max(100)
      .integer()
      .typeError('Please enter a valid number')
      .required('Required'),
    wheelchairs: yup
      .number()
      .min(0)
      .max(100)
      .integer()
      .typeError('Please enter a valid number')
      .required('Required'),
    unavailable: yup.string().trim().nullable(),
    conflictPerformers: yup.string().trim().nullable(),
    photoPermission: yup
      .string()
      .trim()
      .required('Required')
      .oneOf(['Yes', 'No']),
  }),
)

const { validate } = useForm({
  validationSchema,
  validateOnMount: true,
})

const communityGroupKeys
  = fieldConfigStore.performerTypeFields('CommunityGroup')

watchEffect(() => {
  let count = 0
  for (const key of communityGroupKeys) {
    if (status[key as keyof CommunityGroup] !== StatusEnum.saved) {
      count++
    }
  }
  const index = communityGroupStore.communityGroupErrors.findIndex(
    item => item.id === props.communityGroupId,
  )
  communityGroupStore.communityGroupErrors[index]!.count = count
})

onActivated(() => {
  validate()
})
</script>

<template>
  <div class="grid grid-cols-12 gap-x-3 gap-y-2 items-start">
    <div class="col-span-12 lg:col-span-7 grid grid-cols-12 gap-x-3 gap-y-2">
      <div class="col-span-12 sm:col-span-8 lg:col-span-8">
        <BaseInput
          v-model="communityGroup.name"
          :status="status.name"
          label="Group Name"
          name="groupName"
          type="text"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'name')
          "
        />

        <BaseInput
          v-model="communityGroup.earliestTime"
          :status="status.earliestTime"
          name="earliestTime"
          label="Earliest time your group can perform"
          type="time"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'earliestTime')
          "
        />

        <BaseInput
          v-model="communityGroup.latestTime"
          :status="status.latestTime"
          name="latestTime"
          label="Latest time your group can perform"
          type="time"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'latestTime')
          "
        />
      </div>
      <div
        class="col-span-12 sm:col-span-4 lg:col-span-4 grid grid-cols-2 gap-x-3 items-start"
      >
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="communityGroup.groupSize"
            :status="status.groupSize"
            min="2"
            max="300"
            step="1"
            name="groupSize"
            label="Number of performers"
            type="number"
            @change-status="
              async (stat: string) => await fieldStatus(stat, 'groupSize')
            "
          />
        </div>
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="communityGroup.chaperones"
            :status="status.chaperones"
            name="chaperones"
            min="0"
            max="100"
            step="1"
            label="Number of chaperones"
            type="number"
            @change-status="
              async (stat: string) => await fieldStatus(stat, 'chaperones')
            "
          />
        </div>
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="communityGroup.wheelchairs"
            :status="status.wheelchairs"
            name="wheelchairs"
            min="0"
            max="100"
            step="1"
            label="Number of wheelchairs"
            type="number"
            @change-status="
              async (stat: string) => await fieldStatus(stat, 'wheelchairs')
            "
          />
        </div>
        <div class="off col-1 sm:col-span-2 text-sm font-bold">
          Total Number: {{ totalParticipants }}
        </div>
      </div>
      <div class="col-span-3 sm:col-span-2 lg:col-span-2 self-end">
        <BaseSelect
          id="photo-permission"
          v-model="communityGroup.photoPermission"
          :status="status.photoPermission"
          :options="[
            { id: 'Yes', name: 'Yes' },
            { id: 'No', name: 'No' },
          ]"
          name="photoPermission"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'photoPermission')
          "
        />
      </div>
      <div class="col-span-9 sm:col-span-10 lg:col-span-8 text-sm self-center">
        I give permission to use photographs of this participant in Winnipeg
        Music Festival newsletters, funding requests, archival purposes,
        marketing and social media.
      </div>
    </div>
    <div class="col-span-12 lg:col-span-5">
      <BaseTextarea
        v-model="communityGroup.unavailable"
        :status="status.unavailable"
        name="unavailable"
        label="Scheduling Requests"
        rows="3"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'unavailable')
        "
      />
      <p class="text-sm mb-2">
        List any scheduling requests. The Festival cannot guarantee that
        submitted requests can be accommodated. Entry fees are non-refundable
      </p>

      <BaseTextarea
        v-model="communityGroup.conflictPerformers"
        :status="status.conflictPerformers"
        name="conflictPerformers"
        label="Performers participating in other classes."
        rows="3"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'conflictPerformers')
        "
      />
      <p class="text-sm mb-2">
        If there are any performers in your group participating in other
        festival classes, list their names so that we can do our best to avoid
        scheduling conflicts:
      </p>
    </div>
  </div>
</template>

<style scoped></style>
