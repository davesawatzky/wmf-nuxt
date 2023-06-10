<script setup lang="ts">
  import { useClasses } from '@/stores/userClasses'
  import { useRegistration } from '@/stores/userRegistration'

  const classesStore = useClasses()
  const registrationStore = useRegistration()

  // interface Status {
  //   [key: string]: null | 'saved' | 'saving'
  // }

  enum Status {
    null,
    saved,
    saving,
  }

  const classStatus = {
    discipline: Status.null,
    subdiscipline: Status.null,
    level: Status.null,
    category: Status.null,
    selections: [
      {
        title: Status.null,
        largerWork: Status.null,
        movement: Status.null,
        composer: Status.null,
        duration: Status.null,
      },
    ],
  }

  const selectionStatus = {
    title: Status.null,
    largerWork: Status.null,
    movement: Status.null,
    composer: Status.null,
    duration: Status.null,
  }

  const status = reactive([
    {
      discipline: Status.null,
      subdiscipline: Status.null,
      level: Status.null,
      category: Status.null,
      selections: [
        {
          title: Status.null,
          largerWork: Status.null,
          movement: Status.null,
          composer: Status.null,
          duration: Status.null,
        },
      ],
    },
  ])

  function addClass(registrationId: number) {
    classesStore.createClass(registrationId)
    status.push(classStatus)
  }
  function removeClass(classId: number) {
    classesStore.deleteClass(classId)
  }
</script>

<template>
  <div v-auto-animate>
    <h2 class="pt-8">Solo Class Information</h2>
    <div
      v-for="(selectedClass, classIndex) in classesStore.registeredClasses"
      :key="selectedClass.id">
      <div class="py-4">
        <h3 class="pb-4">Class {{ classIndex + 1 }}</h3>
        <FormClass
          v-model="classesStore.registeredClasses[classIndex]"
          :status="status[classIndex]"
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
          Add Class
        </BaseButton>
        <BaseButton
          v-if="classesStore.registeredClasses.length > 1 ? true : false"
          id="index"
          class="btn btn-red mb-6"
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
