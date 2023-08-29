<script setup lang="ts">
  import { usePerformers } from '@/stores/userPerformer'
  import { useTeacher } from '@/stores/userTeacher'
  import { useGroup } from '@/stores/userGroup'
  import { useSchool } from '@/stores/userSchool'
  import { useSchoolGroup } from '@/stores/userSchoolGroup'
  import { useCommunity } from '@/stores/userCommunity'
  import { useClasses } from '@/stores/userClasses'
  import { useRegistration } from '@/stores/userRegistration'
  import { useAppStore } from '@/stores/appStore'
  import { formErrors } from '@/composables/formErrors'

  const emits = defineEmits<{
    submitForm: [value: any]
  }>()

  definePageMeta({
    middleware: 'auth',
  })

  const performerStore = usePerformers()
  const teacherStore = useTeacher()
  const groupStore = useGroup()
  const schoolStore = useSchool()
  const schoolGroupStore = useSchoolGroup()
  const communityStore = useCommunity()
  const classesStore = useClasses()
  const appStore = useAppStore()
  const registrationStore = useRegistration()

  function schoolClassGroup(id: number) {
    return schoolGroupStore.schoolGroup.find((item) => item.id === id)
  }

  function printWindow() {
    window.print()
  }

  const totalErrors = computed(() => {
    const errors: number[] = Object.values(formErrors.value.value)
    return errors.reduce((a, b) => {
      return a + b
    }, 0)
  })
</script>

<template>
  <div>
    <div
      v-if="totalErrors > 0"
      v-auto-animate>
      <h2>Errors were found in the registration form</h2>
      <h3>
        Please fix any errors on this registration. Incomplete registrations
        will not be submitted.
      </h3>
    </div>
    <div
      v-else
      v-auto-animate>
      <h1 class="pt-8">Registration Summary</h1>

      <!-- Community Groups -->
      <div v-if="appStore.performerType === 'COMMUNITY'">
        <h2 class="pt-8 pb-4">Community Group Information</h2>

        <div>Community Group Name: {{ communityStore.community.name }}</div>
        <div>
          Community Group Size: {{ communityStore.community.groupSize }}
        </div>
        <div v-if="communityStore.community.chaperones">
          Number of Chaperones: {{ communityStore.community.chaperones }}
        </div>
        <div v-if="communityStore.community.wheelchairs">
          Number of Wheelchairs:
          {{ communityStore.community.wheelchairs }}
        </div>
        <div v-if="communityStore.community.conflictPerformers">
          Performers participating in other classes
          {{ communityStore.community.conflictPerformers }}
        </div>
      </div>

      <!-- School Groups -->
      <div v-if="appStore.performerType === 'SCHOOL'">
        <h2 class="pt-8 pb-4">School Information</h2>
        <div>School Name: {{ schoolStore.school.name }}</div>
        <div>School Division: {{ schoolStore.school.division }}</div>
        <div>Address:</div>
        {{ schoolStore.school.streetNumber }}
        {{ schoolStore.school.streetName }}
        <div>
          {{ schoolStore.school.city }},
          {{ schoolStore.school.province }}
        </div>
        <div>{{ schoolStore.school.postalCode }}</div>
        <div>Phone: {{ schoolStore.school.phone }}</div>
        <h3 class="pt-6 pb-2">School Group(s)</h3>
        <div
          v-for="(schlGrp, schlGrpIndex) in schoolGroupStore.schoolGroup"
          :key="schlGrp.id">
          <h4>Group {{ schlGrpIndex + 1 }}:</h4>
          <div>Name: {{ schlGrp.name }}</div>
          <div>Size: {{ schlGrp.groupSize }}</div>
          <div v-if="schlGrp.chaperones">
            Chaperones: {{ schlGrp.chaperones }}
          </div>
          <div v-if="schlGrp.wheelchairs">
            Wheelchairs: {{ schlGrp.wheelchairs }}
          </div>
          <div v-if="schlGrp.earliestTime">
            Earliest Time: {{ schlGrp.earliestTime }}
          </div>
          <div v-if="schlGrp.latestTime">
            Latest Time: {{ schlGrp.latestTime }}
          </div>
          <div v-if="schlGrp.unavailable">
            Unavailable Times: {{ schlGrp.unavailable }}
          </div>
          <div v-if="schlGrp.conflictPerformers">
            Multiple Class Participants: {{ schlGrp.conflictPerformers }}
          </div>
        </div>
      </div>

      <!-- Registered Classes -->
      <h2 class="pt-8 pb-4">Registered Classes</h2>
      <div
        v-for="registeredClass in classesStore.registeredClasses"
        :key="registeredClass.id">
        <h4 class="py-2">
          Festival Class Number: {{ registeredClass.classNumber }}
        </h4>
        <h5 v-if="appStore.performerType === 'SCHOOL'">
          {{ schoolClassGroup(registeredClass.schoolGroupID!)?.name }}
        </h5>
        <div>Festival Class: {{ registeredClass.classNumber }}</div>
        <div>{{ registeredClass.discipline }}</div>
        <div>{{ registeredClass.category }}</div>
        <div>{{ registeredClass.level }}</div>
        <div>
          Number of Selections: {{ registeredClass.numberOfSelections }}
        </div>
        <div
          v-for="(selection, selectionIndex) in registeredClass.selections"
          :key="selection.id"
          class="ml-8">
          <h5 class="py-2">Selection {{ selectionIndex + 1 }}</h5>
          <div>Title: {{ selection.title }}</div>
          <div>Composer: {{ selection.composer }}</div>
          <div v-if="selection.largerWork">
            from Work: {{ selection.largerWork }}
          </div>
          <div v-if="selection.movement">
            Movement: {{ selection.movement }}
          </div>
          <div>Duration: {{ selection.duration }}</div>
        </div>
      </div>

      <!-- Solo and Group Performers -->
      <div v-if="appStore.performerType === 'GROUP'">
        <h2 class="pt-8 pb-4">Group Information</h2>
        <div>Name: {{ groupStore.group.name }}</div>
        <div>Type of Group: {{ groupStore.group.groupType }}</div>
        <div>
          Number of Performers: {{ groupStore.group.numberOfPerformers }}
        </div>
        <div>Age of the Group: {{ groupStore.group.age }}</div>
      </div>
      <div
        v-if="
          appStore.performerType === 'GROUP' ||
          appStore.performerType === 'SOLO'
        ">
        <h2 class="pt-8 pb-4">Performer(s)</h2>
        <div
          v-for="(performer, index) in performerStore.performers"
          :key="performer.id">
          <SummaryContactInfo
            :contact="performer"
            :full-name="performerStore.fullName[index]" />
        </div>
      </div>

      <!-- Teacher -->
      <div>
        <h2 class="pt-8 pb-4">Teacher</h2>
        <SummaryContactInfo
          :contact="teacherStore.teacher"
          :full-name="teacherStore.fullName" />
      </div>
      <h3 class="pt-8 pb-4">Class Summary</h3>
      <SummaryTable />
    </div>

    <!-- Submission -->
    <div v-if="totalErrors === 0">
      <BaseButton
        v-if="!registrationStore.registration.confirmation"
        class="btn btn-blue"
        @click="$emit('submitForm')">
        Prepare to Submit
      </BaseButton>
      <BaseButton
        class="btn btn-blue"
        @click="printWindow">
        Print this page
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
