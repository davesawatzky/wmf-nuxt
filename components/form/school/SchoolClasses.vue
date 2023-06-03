<script setup lang="ts">
  import { useClasses } from '@/stores/userClasses'
  import { useRegistration } from '@/stores/userRegistration'
  import { useSchoolGroup } from '@/stores/userSchoolGroup'

  const classesStore = useClasses()
  const registrationStore = useRegistration()
  const schoolGroupStore = useSchoolGroup()

  function addClass(registrationId: number) {
    classesStore.createClass(registrationId)
  }
  function removeClass(classId: number) {
    classesStore.deleteClass(classId)
  }

  const schoolGroups = computed(() => {
    const newArray = []
    for (const schlGroup of schoolGroupStore.schoolGroup)
      newArray.push({ id: schlGroup.id, name: schlGroup.name })

    return newArray
  })
</script>

<template>
  <div
    v-auto-animate
    class="pb-8">
    <h2 class="pb-4">School Class Information</h2>
    <div
      v-for="(selectedClass, classIndex) in classesStore.registeredClasses"
      :key="selectedClass.id">
      <div class="pb-8">
        <h3 class="pb-4">Class {{ classIndex + 1 }}</h3>
        <label for="schoolGroupSelect">Select a school group</label>
        <select
          id="schoolGroupSelect"
          v-model.number="
            classesStore.registeredClasses[classIndex].schoolGroupID
          "
          class="mb-6"
          name="schoolGroup">
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
        <FormClass
          v-model="classesStore.registeredClasses[classIndex]"
          :class-index="classIndex"
          :class-id="selectedClass.id" />
      </div>
      <div class="pt-4">
        <BaseButton
          v-if="
            classIndex + 1 === classesStore.registeredClasses.length
              ? true
              : false
          "
          class="btn btn-blue"
          @click="addClass(registrationStore.registrationId)">
          Add Class
        </BaseButton>
        <BaseButton
          v-if="classesStore.registeredClasses.length > 1 ? true : false"
          id="index"
          class="btn btn-red"
          @click="removeClass(selectedClass.id)">
          Remove Class
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
