<script setup lang="ts">
  import * as yup from 'yup'
  import { useClasses } from '~/stores/useClasses'
  import { useRegistration } from '~/stores/useRegistration'
  import { useSchoolGroup } from '~/stores/useSchoolGroup'
  import { useCommunityGroup } from '~/stores/useCommunityGroup'
  import { useAppStore } from '~/stores/appStore'
  import { PerformerType, type RegisteredClass } from '~/graphql/gql/graphql'
  import { useToast } from 'vue-toastification'

  const classesStore = useClasses()
  const registrationStore = useRegistration()
  const schoolGroupStore = useSchoolGroup()
  const communityGroupStore = useCommunityGroup()
  const appStore = useAppStore()
  const toast = useToast()

  const status = reactive<Status[]>([])
  onMounted(() => {
    for (let i = 0; i < classesStore.registeredClasses.length; i++) {
      status.push({ schoolGroupID: StatusEnum.null })
      status.push({ communityGroupID: StatusEnum.null })
      if (classesStore.registeredClasses[i]?.schoolGroupID)
        status[i]!.schoolGroupID = StatusEnum.saved
      if (classesStore.registeredClasses[i]?.communityGroupID)
        status[i]!.communityGroupID = StatusEnum.saved
    }
  })

  async function addClass() {
    await classesStore.createClass(registrationStore.registrationId)
    if (appStore.performerType === PerformerType.SCHOOL)
      status.push({ schoolGroupID: StatusEnum.null })
    if (appStore.performerType === PerformerType.COMMUNITY)
      status.push({ communityGroupID: StatusEnum.null })
    validate()
  }

  async function removeClass(classId: number, index: number) {
    const classIndex = await classesStore.deleteClass(classId)
    if (appStore.performerType === PerformerType.SCHOOL)
      status.splice(classIndex, 1)
    if (appStore.performerType === PerformerType.COMMUNITY)
      status.splice(classIndex, 1)
  }

  // SchoolGroup and CommunityGroup status validation

  const schoolGroupsList = computed(() => {
    const newArray = []
    for (const schlGroup of schoolGroupStore.schoolGroup)
      newArray.push({ id: schlGroup.id, name: schlGroup.name ?? undefined })
    return newArray
  })

  const communityGroupsList = computed(() => {
    const newArray = []
    for (const commGroup of communityGroupStore.communityGroup)
      newArray.push({ id: commGroup.id, name: commGroup.name ?? undefined })
    return newArray
  })

  const validationSchema = toTypedSchema(
    yup.object({
      schoolGroups: yup.array().of(
        yup.object({
          id: yup.number().integer().required('Required'),
        })
      ),
      communityGroups: yup.array().of(
        yup.object({
          id: yup.number().integer().required('Required'),
        })
      ),
    })
  )

  // async function fieldStatus(
  //   stat: string,
  //   fieldName: string,
  //   classId: number,
  //   classIndex: number
  // ) {
  //   await nextTick()
  //   status[classIndex][fieldName] = StatusEnum.pending
  //   await classesStore.updateClass(classId, fieldName)
  //   if (stat === 'saved') status[classIndex][fieldName] = StatusEnum.saved
  //   else if (stat === 'remove')
  //     status[classIndex][fieldName] = StatusEnum.removed
  //   else status[classIndex][fieldName] = StatusEnum.null
  // }
  async function fieldStatus(
    stat: string,
    fieldName: string,
    classId: number,
    classIndex: number
  ) {
    await nextTick()
    status[classIndex]![fieldName] = StatusEnum.pending
    const result = await classesStore.updateClass(classId, fieldName)
    if (result === 'complete') {
      if (
        classesStore.registeredClasses[classIndex]![
          fieldName as keyof RegisteredClass
        ]
      ) {
        status[classIndex]![fieldName] = StatusEnum.saved
      } else {
        status[classIndex]![fieldName] = StatusEnum.removed
      }
    } else {
      status[classIndex]![fieldName] = StatusEnum.null
      toast.error('Something went wrong. Please exit and reload Registration')
    }
  }

  // Class error counts

  const { errors, meta, validate } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  onActivated(async () => {
    await validate()
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
              classesStore.registeredClasses[classIndex]!.schoolGroupID
            "
            :status="status[classIndex]?.schoolGroupID"
            :name="`schoolGroups[${classIndex}].id`"
            return-id
            label="Select a School Group"
            :options="schoolGroupsList"
            @change-status="
              async (stat: string) => {
                await fieldStatus(
                  stat,
                  'schoolGroupID',
                  selectedClass.id,
                  classIndex
                )
              }
            " />
        </div>
        <div v-else-if="appStore.performerType === PerformerType.COMMUNITY">
          <BaseSelect
            v-model.number="
              classesStore.registeredClasses[classIndex]!.communityGroupID
            "
            :status="status[classIndex]?.communityGroupID"
            :name="`communityGroups[${classIndex}].id`"
            return-id
            label="Select a Community Group"
            :options="communityGroupsList"
            @change-status="
              async (stat: string) => {
                await fieldStatus(
                  stat,
                  'communityGroupID',
                  selectedClass.id,
                  classIndex
                )
              }
            " />
        </div>
        <FormClass
          v-model="classesStore.registeredClasses[classIndex]!"
          :class-index="classIndex"
          :class-id="selectedClass.id" />
      </div>
      <div class="pt-4 col-span-12">
        <BaseButton
          v-if="
            classIndex + 1 === classesStore.registeredClasses.length
              ? true
              : false
          "
          class="btn btn-blue mb-6"
          @click="addClass()">
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
