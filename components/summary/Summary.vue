<script setup lang="ts">
  import { usePerformers } from '@/stores/usePerformer'
  import { useTeacher } from '@/stores/useTeacher'
  import { useGroup } from '@/stores/useGroup'
  import { useSchool } from '@/stores/useSchool'
  import { useSchoolGroup } from '@/stores/useSchoolGroup'
  import { useCommunity } from '@/stores/useCommunity'
  import { useCommunityGroup } from '@/stores/useCommunityGroup'
  import { useClasses } from '@/stores/useClasses'
  import { useRegistration } from '@/stores/useRegistration'
  import { useAppStore } from '@/stores/appStore'
  import { formErrors } from '@/composables/formErrors'

  interface TeacherSummary {
    teacherSummary?: boolean
  }

  const props = withDefaults(defineProps<TeacherSummary>(), {
    teacherSummary: false,
  })

  const emit = defineEmits(['submitForm'])

  const performerStore = usePerformers()
  const teacherStore = useTeacher()
  const groupStore = useGroup()
  const schoolStore = useSchool()
  const schoolGroupStore = useSchoolGroup()
  const communityStore = useCommunity()
  const communityGroupStore = useCommunityGroup()
  const classesStore = useClasses()
  const appStore = useAppStore()
  const registrationStore = useRegistration()

  function schoolClassGroup(id: number) {
    return schoolGroupStore.schoolGroup.find((item) => item.id === id)
  }
  function communityClassGroup(id: number) {
    return communityGroupStore.communityGroup.find((item) => item.id === id)
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

  async function finalErrorCheck() {
    if (!totalErrors.value && !props.teacherSummary)
      await navigateTo('/Submission')
  }
</script>

<template>
  <div>
    <div
      v-if="totalErrors > 0 && !props.teacherSummary"
      v-auto-animate>
      <h3 class="text-center py-2 sm:py-4 bg-red-600 text-white rounded-lg">
        Incomplete registration form
      </h3>
      <br />
      <h4 class="text-center">
        All information is saved and can be returned to later.
      </h4>
      <h4 class="text-center">Only complete registrations can be submitted.</h4>
    </div>
    <div
      v-else
      v-auto-animate
      class="p-0 sm:px-8 sm:pt-8">
      <h2>Registration Summary</h2>
      <h3
        v-if="registrationStore.registration.confirmation"
        class="pt-2">
        Confirmation Number: {{ registrationStore.registration.confirmation }}
      </h3>
      <SummaryTable class="pt-8" />

      <!-- Solo and Group Performers -->
      <div v-if="appStore.performerType === 'GROUP'">
        <h3 class="pt-4 pb-4">Group Information</h3>
        <BaseSummaryCard>
          <template #heading1>
            <h4 class="text-lg sm:text-xl py-2">
              {{ groupStore.group.name }}
            </h4>
          </template>
          <template #details>
            <table>
              <tbody class="text-sm sm:text-base">
                <tr class="">
                  <td>Type of Group:</td>
                  <td>{{ groupStore.group.groupType }}</td>
                </tr>
                <tr class="">
                  <td>Number of Performers:</td>
                  <td>{{ groupStore.group.numberOfPerformers }}</td>
                </tr>
                <tr class="">
                  <td>Average age:</td>
                  <td>{{ groupStore.group.age }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </BaseSummaryCard>
      </div>

      <div
        v-if="
          appStore.performerType === 'GROUP' ||
          appStore.performerType === 'SOLO'
        ">
        <h3 class="pt-4 pb-4">Performer(s)</h3>
        <div
          v-for="(performer, index) in performerStore.performers"
          :key="performer.id">
          <SummaryContactInfo
            class="pb-4"
            :contact="performer"
            :full-name="performerStore.fullName[index]" />
        </div>
      </div>

      <!-- Teacher -->
      <div v-if="!props.teacherSummary">
        <h3 class="pt-4 pb-4">Teacher</h3>
        <div
          class="mb-4 flex align-bottom p-2 text-white bg-sky-700 border border-sky-700 shadow-md rounded-lg">
          <div>
            <h4 class="text-lg sm:text-xl">
              {{ teacherStore.fullName }}
            </h4>
          </div>
          <div
            v-if="teacherStore.teacher.id !== 2"
            class="text-sm sm:text-base px-2 sm:px-10">
            <div>Phone: {{ teacherStore.teacher.phone }}</div>
            <div>Email: {{ teacherStore.teacher.email }}</div>
          </div>
        </div>
      </div>

      <!-- Community Groups -->
      <div v-if="appStore.performerType === 'COMMUNITY'">
        <h3 class="pt-4 pb-4">Community Group Information</h3>
        <BaseSummaryCard>
          <template #heading1>
            <h4 class="text-lg sm:text-xl py-2">
              {{ communityStore.community.name }}
            </h4>
          </template>
          <template #details>
            <div class="flex justify-evenly">
              <div>
                <div>{{ communityStore.community.address }}</div>
                <div>
                  {{ communityStore.community.city }},
                  {{ communityStore.community.province }}
                </div>
                <div>{{ communityStore.community.postalCode }},</div>
                <div>{{ communityStore.community.phone }}</div>
                <div>{{ communityStore.community.email }}</div>
              </div>
            </div>
          </template>
        </BaseSummaryCard>

        <!-- Community Groups -->
        <BaseSummaryCard>
          <template #heading1> Community Group(s) </template>
          <template #details>
            <div class="flex justify-evenly">
              <div
                v-for="(
                  commGrp, commGrpIndex
                ) in communityGroupStore.communityGroup"
                :key="commGrp.id"
                class="">
                <div>
                  <h4 class="py-1 pl-2 text-lg sm:text-xl">
                    Group {{ commGrpIndex + 1 }}: {{ commGrp.name }}
                  </h4>
                  <table>
                    <tbody class="text-sm sm:text-base">
                      <tr>
                        <td>Size:</td>
                        <td>{{ commGrp.groupSize }}</td>
                      </tr>
                      <tr>
                        <td>Chaperones:</td>
                        <td>{{ commGrp.chaperones }}</td>
                      </tr>
                      <tr>
                        <td>Wheelchairs:</td>
                        <td>{{ commGrp.wheelchairs }}</td>
                      </tr>
                      <tr>
                        <td>Earliest Time:</td>
                        <td>{{ commGrp.earliestTime }}</td>
                      </tr>
                      <tr>
                        <td>Latest Time:</td>
                        <td>{{ commGrp.latestTime }}</td>
                      </tr>
                      <tr>
                        <td>Scheduling Requests:</td>
                        <td>{{ commGrp.unavailable }}</td>
                      </tr>
                      <tr>
                        <td>Multi-Class Participants:</td>
                        <td>
                          {{ commGrp.conflictPerformers }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>
        </BaseSummaryCard>
      </div>

      <!-- School Information -->
      <div v-if="appStore.performerType === 'SCHOOL'">
        <h3 class="pt-4 pb-4">School Information</h3>
        <BaseSummaryCard>
          <template #heading1>
            <h4 class="text-lg sm:text-xl">
              {{ schoolStore.school.name }}
            </h4>
          </template>
          <template
            #heading3
            class="text-sm sm:text-base">
            {{ schoolStore.school.division }}
          </template>
          <template #details>
            <div class="flex justify-evenly">
              <div>
                <div>{{ schoolStore.school.address }}</div>
                <div>
                  {{ schoolStore.school.city }},
                  {{ schoolStore.school.province }}
                </div>
                <div>{{ schoolStore.school.postalCode }},</div>
                <div>{{ schoolStore.school.phone }}</div>
              </div>
            </div>
          </template>
        </BaseSummaryCard>

        <!-- School Groups -->
        <BaseSummaryCard>
          <template #heading1> School Group(s) </template>
          <template #details>
            <div class="flex justify-evenly">
              <div
                v-for="(schlGrp, schlGrpIndex) in schoolGroupStore.schoolGroup"
                :key="schlGrp.id"
                class="">
                <div>
                  <h4 class="py-1 pl-2 text-lg sm:text-xl">
                    Group {{ schlGrpIndex + 1 }}: {{ schlGrp.name }}
                  </h4>
                  <table>
                    <tbody class="text-sm sm:text-base">
                      <tr>
                        <td>Size:</td>
                        <td>{{ schlGrp.groupSize }}</td>
                      </tr>
                      <tr>
                        <td>Chaperones:</td>
                        <td>{{ schlGrp.chaperones }}</td>
                      </tr>
                      <tr>
                        <td>Wheelchairs:</td>
                        <td>{{ schlGrp.wheelchairs }}</td>
                      </tr>
                      <tr>
                        <td>Earliest Time:</td>
                        <td>{{ schlGrp.earliestTime }}</td>
                      </tr>
                      <tr>
                        <td>Latest Time:</td>
                        <td>{{ schlGrp.latestTime }}</td>
                      </tr>
                      <tr>
                        <td>Scheduling Requests:</td>
                        <td>{{ schlGrp.unavailable }}</td>
                      </tr>
                      <tr>
                        <td>Multi-Class Participants:</td>
                        <td>
                          {{ schlGrp.conflictPerformers }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>
        </BaseSummaryCard>
      </div>

      <!-- Registered Classes -->
      <h3 class="pt-4 pb-4">Registered Classes</h3>
      <div
        v-for="registeredClass in classesStore.registeredClasses"
        :key="registeredClass.id">
        <BaseSummaryCard class="">
          <template
            #heading1
            class="text-lg sm:text-xl">
            Festival Class Number: {{ registeredClass.classNumber }}
          </template>
          <template #heading3>
            <h5 v-if="appStore.performerType === 'SCHOOL'">
              {{ schoolClassGroup(registeredClass.schoolGroupID!)?.name }}
            </h5>
            <h5 v-else-if="appStore.performerType === 'COMMUNITY'">
              {{ communityClassGroup(registeredClass.communityGroupID!)?.name }}
            </h5>
          </template>
          <template #heading2>
            <div>Class: {{ registeredClass.subdiscipline?.toUpperCase() }}</div>
            <div>Category: {{ registeredClass.category }}</div>
            <div>Level: {{ registeredClass.level }}</div>
          </template>
          <!-- <div>
            Number of Selections: {{ registeredClass.numberOfSelections }}
          </div> -->
          <template #details>
            <div class="flex justify-evenly flex-wrap">
              <div
                v-for="(
                  selection, selectionIndex
                ) in registeredClass.selections"
                :key="selection.id"
                class="sm:px-4 py-4">
                <h5 class="py-1 pl-2">Selection {{ selectionIndex + 1 }}</h5>
                <table>
                  <tbody>
                    <tr class="">
                      <td>Title:</td>
                      <td>{{ selection.title }}</td>
                    </tr>
                    <tr class="">
                      <td>Composer:</td>
                      <td>{{ selection.composer }}</td>
                    </tr>
                    <tr
                      v-if="selection.largerWork"
                      class="">
                      <td>from Work:</td>
                      <td>{{ selection.largerWork }}</td>
                    </tr>
                    <tr
                      v-if="selection.movement"
                      class="">
                      <td>Movement:</td>
                      <td>{{ selection.movement }}</td>
                    </tr>
                    <tr class="">
                      <td>Duration:</td>
                      <td>{{ selection.duration }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </BaseSummaryCard>
      </div>
    </div>

    <!-- Submission -->
    <div class="pt-4 px sm:px-8">
      <BaseButton
        v-if="
          !registrationStore.registration.confirmation && !props.teacherSummary
        "
        class="btn btn-blue"
        :disabled="totalErrors !== 0"
        @click="finalErrorCheck">
        Prepare to Submit
      </BaseButton>
      <BaseButton
        v-if="totalErrors === 0 || props.teacherSummary"
        class="btn btn-blue"
        @click="printWindow">
        Print this page
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
  table {
    table-layout: auto;
    border-collapse: collapse;
  }

  td {
    padding: 0px 8px;
  }
</style>
