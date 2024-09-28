<script setup lang="ts">
  import * as yup from 'yup'
  import { useCommunityGroup } from '@/stores/userCommunityGroup'
  import type { CommunityGroupInput } from '@/graphql/gql/graphql'

  const props = defineProps<{
    modelValue: CommunityGroupInput
    communityGroupIndex: number
    communityGroupId: number
  }>()

  const emits = defineEmits<{
    'update:modelValue': [value: CommunityGroupInput]
  }>()

  const communityGroupStore = useCommunityGroup()

  const communityGroup = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
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
      (communityGroup.value.groupSize ?? 0) +
      (communityGroup.value.chaperones ?? 0) +
      (communityGroup.value.wheelchairs ?? 0)
    )
  })

  async function fieldStatus(stat: string, fieldName: string) {
    await nextTick()
    status[fieldName] = StatusEnum.pending
    await communityGroupStore.updateCommunityGroup(
      props.communityGroupId,
      fieldName
    )
    if (stat === 'saved') status[fieldName] = StatusEnum.saved
    else if (stat === 'remove') status[fieldName] = StatusEnum.removed
    else status[fieldName] = StatusEnum.null
  }

  const validationSchema = toTypedSchema(
    yup.object({
      groupName: yup.string().trim().required('Enter a name for your group'),
      earliestTime: yup
        .string()
        .matches(/[0-1]{0,1}[0-9]:[0-5][0-9]/, 'Enter a time')
        .default('08:00')
        .required('Enter a time'),
      latestTime: yup
        .string()
        .matches(/[0-1]{0,1}[0-9]:[0-5][0-9]/, 'Enter a time')
        .default('17:00')
        .required('Enter a time'),
      groupSize: yup
        .number()
        .min(2)
        .max(300)
        .integer()
        .typeError('Please enter a valid number')
        .required('Enter the # of performers'),
      chaperones: yup
        .number()
        .min(0)
        .max(100)
        .integer()
        .typeError('Please enter a valid number')
        .required('Enter the # of chaperones.'),
      wheelchairs: yup
        .number()
        .min(0)
        .max(100)
        .integer()
        .typeError('Please enter a valid number')
        .required('Enter the # of wheelchairs'),
      unavailable: yup
        .string()
        .trim()
        .required('Please indicate unavailable dates/times.'),
      conflictPerformers: yup.string().trim().nullable(),
      photoPermission: yup.boolean().default(false),
    })
  )

  const { errors, validate } = useForm({
    validationSchema,
    validateOnMount: true,
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
          @change-status="(stat: string) => fieldStatus(stat, 'name')" />

        <BaseInput
          v-model="communityGroup.earliestTime"
          :status="status.earliestTime"
          name="earliestTime"
          label="Earliest time your group can perform"
          type="time"
          @change-status="
            (stat: string) => fieldStatus(stat, 'earliestTime')
          " />

        <BaseInput
          v-model="communityGroup.latestTime"
          :status="status.latestTime"
          name="latestTime"
          label="Latest time your group can perform"
          type="time"
          @change-status="(stat: string) => fieldStatus(stat, 'latestTime')" />
      </div>
      <div
        class="col-span-12 sm:col-span-4 lg:col-span-4 grid grid-cols-2 gap-x-3 items-end">
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="communityGroup.groupSize"
            v-maska
            :status="status.groupSize"
            min="2"
            max="300"
            step="1"
            data-maska="###"
            data-maska-eager
            name="groupSize"
            label="Number of performers"
            type="number"
            @change-status="(stat: string) => fieldStatus(stat, 'groupSize')" />
        </div>
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="communityGroup.chaperones"
            v-maska
            :status="status.chaperones"
            name="chaperones"
            min="0"
            max="100"
            step="1"
            data-maska="###"
            data-maska-eager
            label="Number of chaperones"
            type="number"
            @change-status="
              (stat: string) => fieldStatus(stat, 'chaperones')
            " />
        </div>
        <div class="col-1 sm:col-span-2">
          <BaseInput
            v-model.number="communityGroup.wheelchairs"
            v-maska
            :status="status.wheelchairs"
            name="wheelchairs"
            min="0"
            max="100"
            step="1"
            data-maska="###"
            data-maska-eager
            label="Number of wheelchairs"
            type="number"
            @change-status="
              (stat: string) => fieldStatus(stat, 'wheelchairs')
            " />
        </div>
        <div class="off col-1 sm:col-span-2 text-sm font-bold">
          Total Number: {{ totalParticipants }}
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-5">
      <BaseTextarea
        v-model="communityGroup.unavailable"
        :status="status.unavailable"
        name="unavailable"
        label="Unavailable Dates/Times"
        rows="3"
        @change-status="(stat: string) => fieldStatus(stat, 'unavailable')" />
      <p class="text-sm mb-2">
        List any date/time when you are unavailable for performance using
        <strong>calendar dates</strong>, between February 23 and March 20, 2025.
      </p>

      <BaseTextarea
        v-model="communityGroup.conflictPerformers"
        :status="status.conflictPerformers"
        name="conflictPerformers"
        label="Performers participating in other classes."
        rows="3"
        @change-status="
          (stat: string) => fieldStatus(stat, 'conflictPerformers')
        " />
      <p class="text-sm mb-2">
        If there are any performers in your group participating in other
        festival classes, list their names so that we can do our best to avoid
        scheduling conflicts:
      </p>
    </div>
    <BaseCheckbox
      id="photo-permission"
      v-model="communityGroup.photoPermission"
      :status="status.photoPermission"
      name="photoPermission"
      label="I give permission for the Festival to use photographs of this participant in marketing materials."
      @change-status="(stat: string) => fieldStatus(stat, 'photoPermission')" />
  </div>
</template>

<style scoped></style>
