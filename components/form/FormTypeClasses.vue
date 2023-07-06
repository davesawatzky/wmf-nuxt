<script setup lang="ts">
  import { useClasses } from '@/stores/userClasses'
  import { useRegistration } from '@/stores/userRegistration'
  import { useSchoolGroup } from '@/stores/userSchoolGroup'
  import { useAppStore } from '@/stores/appStore'
  import { PerformerType } from '~/graphql/gql/graphql'
  import type { Status } from '@/composables/types'

  const classesStore = useClasses()
  const registrationStore = useRegistration()
  const schoolGroupStore = useSchoolGroup()
  const appStore = useAppStore()

  const status = ref<Status[]>([{ schoolGroupStatus: StatusEnum.null }])

  async function addClass(registrationId: number) {
    await classesStore.createClass(registrationId)
    if (appStore.performerType === PerformerType.SCHOOL) {
      status.value.push({ schoolGroupStatus: StatusEnum.null })
    }
  }

  async function removeClass(classId: number) {
    const classIndex = await classesStore.deleteClass(classId)
    if (appStore.performerType === PerformerType.SCHOOL) {
      status.value.splice(classIndex, 1)
    }
  }

  const schoolGroups = computed(() => {
    const newArray = []
    for (const schlGroup of schoolGroupStore.schoolGroup)
      newArray.push({ id: schlGroup.id, name: schlGroup.name })
    return newArray
  })

  async function saveSelect(classId: number, classIndex: number) {
    status.value[classIndex].schoolGroupStatus = StatusEnum.saving
    await classesStore.updateClass(classId, 'schoolGroupID')
    status.value[classIndex].schoolGroupStatus = StatusEnum.saved
  }
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
          <div class="flex items-center ml-2">
            <div class="flex-none">
              <label :for="`schoolGroupSelect${classIndex}`"
                >Select a school group</label
              >
            </div>
            <div class="grow"></div>
            <BaseSaved
              class="flex-none mr-2"
              :status="status[classIndex].schoolGroupStatus" />
          </div>
          <select
            :id="`schoolGroupSelect${classIndex}`"
            v-model.number="
              classesStore.registeredClasses[classIndex].schoolGroupID
            "
            class="mb-6"
            name="schoolGroup"
            @input="saveSelect(selectedClass.id, classIndex)">
            <option
              v-for="schoolGrp in schoolGroups"
              :key="schoolGrp.id"
              :value="schoolGrp.id"
              :selected="
                classesStore.registeredClasses[classIndex].schoolGroupID ===
                schoolGrp.id
              ">
              {{ schoolGrp.name }}
            </option>
          </select>
        </div>
        <FormClass
          v-model="classesStore.registeredClasses[classIndex]"
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
          @click="addClass(registrationStore.registrationId)">
          Add Another Class
        </BaseButton>
        <BaseButton
          v-if="classesStore.registeredClasses.length > 1 ? true : false"
          class="btn btn-red mb-6"
          @click="removeClass(selectedClass.id)">
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
