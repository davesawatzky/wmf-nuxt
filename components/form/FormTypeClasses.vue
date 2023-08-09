<script setup lang="ts">
  import * as yup from 'yup'
  import type { Status } from '@/composables/types'
  import { useClasses } from '@/stores/userClasses'
  import { useRegistration } from '@/stores/userRegistration'
  import { useSchoolGroup } from '@/stores/userSchoolGroup'
  import { useAppStore } from '@/stores/appStore'
  import { PerformerType } from '~/graphql/gql/graphql'

  const emits = defineEmits<{
    errorCounts: [count: number]
  }>()

  const classesStore = useClasses()
  const registrationStore = useRegistration()
  const schoolGroupStore = useSchoolGroup()
  const appStore = useAppStore()
  const numberOfErrors = ref<number[]>([0])

  const status = reactive<Status[]>([
    {
      schoolGroupID: classesStore.registeredClasses[0].schoolGroupID
        ? StatusEnum.saved
        : StatusEnum.null,
    },
  ])

  async function addClass(registrationId: number) {
    await classesStore.createClass(registrationId)
    numberOfErrors.value.push(0)
    if (appStore.performerType === PerformerType.SCHOOL) {
      status.push({ schoolGroupID: StatusEnum.null })
    }
  }

  async function removeClass(classId: number, index: number) {
    const classIndex = await classesStore.deleteClass(classId)
    numberOfErrors.value.splice(index, 1)
    if (appStore.performerType === PerformerType.SCHOOL) {
      status.splice(classIndex, 1)
    }
  }

  // SchoolGroup status validation

  const schoolGroups = computed(() => {
    const newArray = []
    for (const schlGroup of schoolGroupStore.schoolGroup)
      newArray.push({ id: schlGroup.id, name: schlGroup.name })
    return newArray
  })

  async function fieldStatus(
    stat: string,
    fieldName: string,
    classId: number,
    classIndex: number
  ) {
    console.log(stat, fieldName, classId, classIndex)
    console.log(classesStore.registeredClasses[classIndex].schoolGroupID)
    status[classIndex][fieldName] = StatusEnum.pending
    await classesStore.updateClass(classId, fieldName)
    if (stat === 'saved') {
      status[classIndex][fieldName] = StatusEnum.saved
    } else if (stat === 'remove') {
      status[classIndex][fieldName] = StatusEnum.removed
    } else {
      status[classIndex][fieldName] = StatusEnum.null
    }
  }

  const validationSchema = toTypedSchema(
    yup.object({
      schoolGroups: yup.array().of(
        yup.object({
          id: yup.number().integer().required('Please select a group'),
        })
      ),
    })
  )

  // Class error counts

  const { errors, validate } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  function errorCounts(count: number, index: number) {
    numberOfErrors.value[index] = count
  }

  const totalErrors = computed(() => {
    const pageErrors = Object.keys(errors.value).length
    return (
      numberOfErrors.value.reduce((a, b) => {
        return a + b
      }, 0) + pageErrors
    )
  })

  watchEffect(() => {
    emits('errorCounts', totalErrors.value)
  })

  onActivated(async () => {
    await validate()
    emits('errorCounts', totalErrors.value)
  })
</script>

<template>
  <div v-auto-animate>
    <h2 class="pt-8">Class Information</h2>
    <div
      v-for="(selectedClass, classIndex) in classesStore.registeredClasses"
      :key="selectedClass.id">
      <div class="py-4">
        <h3 class="pb-4">Class {{ classIndex + 1 }}</h3>
        <div v-if="appStore.performerType === PerformerType.SCHOOL">
          <BaseSelect
            v-model.number="
              classesStore.registeredClasses[classIndex].schoolGroupID
            "
            :status="status[classIndex].schoolGroupID"
            :name="`schoolGroups[${classIndex}].id`"
            return-id
            label="Select a school Group"
            :options="schoolGroups"
            @change-status="(stat:string) => fieldStatus(stat, 'schoolGroupID', selectedClass.id, classIndex)"></BaseSelect>
        </div>
        <FormClass
          v-model="classesStore.registeredClasses[classIndex]"
          :class-index="classIndex"
          :class-id="selectedClass.id"
          @error-counts="(count:number) => errorCounts(count, classIndex)" />
      </div>
      <div class="pt-4 col-span-12">
        <BaseButton
          v-if="
            classIndex + 1 === classesStore.registeredClasses.length
              ? true
              : false
          "
          class="btn btn-blue mb-6"
          @click="addClass(registrationStore.registrationId)">
          Add Another Class
        </BaseButton>
        <BaseButton
          v-if="classesStore.registeredClasses.length > 1 ? true : false"
          class="btn btn-red mb-6"
          @click="removeClass(selectedClass.id, classIndex)">
          Remove This Class
        </BaseButton>
        <br /><br />
        <svg viewBox="0 0 800 2">
          <line
            x1="0"
            x2="800"
            stroke="black" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
