<script setup lang="ts">
  import { useClasses } from '@/stores/userClasses'
  import { useRegistration } from '@/stores/userRegistration'
  import { useCommunity } from '@/stores/userCommunity'

  const classesStore = useClasses()
  const registrationStore = useRegistration()
  const communityStore = useCommunity()

  function addClass(registrationId: number) {
    classesStore.createClass(registrationId)
  }
  function removeClass(classIndex: number, classId: number) {
    classesStore.deleteClass(classIndex, classId)
  }

  const schoolGroups = computed(() => {
    const newArray = []
    for (const group of communityStore.communityInfo)
      newArray.push({ id: group.id, name: group.name })

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
      :key="classIndex">
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
            v-for="group in schoolGroups"
            :key="group.id"
            :value="group.id"
            :selected="
              classesStore.registeredClasses[classIndex].schoolGroupID ===
              group.id
            ">
            {{ group.name }}
          </option>
        </select>
        <Class
          v-model="classesStore.registeredClasses[classIndex]"
          :class-index="classIndex" />
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
          @click="
            removeClass(
              classIndex,
              classesStore.registeredClasses[classIndex].id!
            )
          ">
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
