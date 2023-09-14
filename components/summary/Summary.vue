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

  const emit = defineEmits(['submitForm'])

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

  async function printWindow() {
    // await useFetch('/api/send-email', { method: 'POST' })
    window.print()
  }

  const totalErrors = computed(() => {
    const errors: number[] = Object.values(formErrors.value.value)
    return errors.reduce((a, b) => {
      return a + b
    }, 0)
  })

  async function finalErrorCheck() {
    if (!totalErrors.value) {
      await navigateTo('/Submission')
    }
  }
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
      v-auto-animate
      class="px-8 pt-8">
      <h2>Registration Summary</h2>
      <h3
        v-if="registrationStore.registration.confirmation"
        class="pt-2">
        Confirmation Number: {{ registrationStore.registration.confirmation }}
      </h3>
      <SummaryTable class="pt-8" />

      <!-- Teacher -->
      <div>
        <h3 class="pt-4 pb-4">Teacher</h3>
        <SummaryContactInfo
          :contact="teacherStore.teacher"
          :full-name="teacherStore.fullName" />
      </div>

      <!-- Community Groups -->
      <div v-if="appStore.performerType === 'COMMUNITY'">
        <h3 class="pt-4 pb-4">Community Group Information</h3>
        <BaseSummaryCard>
          <template #heading1>
            <h4 class="py-2">
              Community Group Name: {{ communityStore.community.name }}
            </h4>
          </template>
          <template #details>
            <table>
              <tbody>
                <tr class="border-sky-400">
                  <td>Community Group Size:</td>
                  <td>{{ communityStore.community.groupSize }}</td>
                </tr>
                <tr class="border-sky-400">
                  <td>Number of Chaperones:</td>
                  <td>
                    {{ communityStore.community.chaperones }}
                  </td>
                </tr>
                <tr class="border-sky-400">
                  <td>Number of Wheelchairs:</td>
                  <td>
                    {{ communityStore.community.wheelchairs }}
                  </td>
                </tr>
                <tr class="border-sky-400">
                  <td>Performers participating in other classes</td>
                  <td>
                    {{ communityStore.community.conflictPerformers }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </BaseSummaryCard>
      </div>

      <!-- School Groups -->
      <div v-if="appStore.performerType === 'SCHOOL'">
        <h3 class="pt-4 pb-4">School Information</h3>
        <BaseSummaryCard>
          <template #heading1>
            <h4 class="py-2">{{ schoolStore.school.name }}</h4>
          </template>
          <template #heading3>
            School Division: {{ schoolStore.school.division }}
          </template>
          <template #details>
            <table>
              <tbody>
                <tr>
                  <td>Address:</td>
                  <td>
                    {{ schoolStore.school.streetNumber }}
                    {{ schoolStore.school.streetName }}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    {{ schoolStore.school.city }},
                    {{ schoolStore.school.province }}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>{{ schoolStore.school.postalCode }},</td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    {{ schoolStore.school.phone }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </BaseSummaryCard>

        <!-- School Groups -->
        <BaseSummaryCard>
          <template #heading1> School Group(s) </template>
          <template #details>
            <div class="flex gap-5 justify-around">
              <div
                v-for="(schlGrp, schlGrpIndex) in schoolGroupStore.schoolGroup"
                :key="schlGrp.id"
                class="">
                <div>
                  <h4>Group {{ schlGrpIndex + 1 }}:</h4>
                  <table>
                    <tbody>
                      <tr>
                        <td>Name:</td>
                        <td>{{ schlGrp.name }}</td>
                      </tr>
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
                        <td>Unavailable Times:</td>
                        <td>{{ schlGrp.unavailable }}</td>
                      </tr>
                      <tr>
                        <td>Multiple Class Participants:</td>
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
          <template #heading1>
            Festival Class Number: {{ registeredClass.classNumber }}
          </template>
          <template #heading3>
            <h5 v-if="appStore.performerType === 'SCHOOL'">
              School Group:
              {{ schoolClassGroup(registeredClass.schoolGroupID!)?.name }}
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
            <div class="flex">
              <div
                v-for="(
                  selection, selectionIndex
                ) in registeredClass.selections"
                :key="selection.id"
                class="px-4">
                <h5 class="py-2">Selection {{ selectionIndex + 1 }}</h5>
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

      <!-- Solo and Group Performers -->
      <div v-if="appStore.performerType === 'GROUP'">
        <h3 class="pt-4 pb-4">Group Information</h3>
        <BaseSummaryCard>
          <template #heading1>
            <h4 class="py-2">{{ groupStore.group.name }}</h4>
          </template>
          <template #details>
            <table>
              <tbody>
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
    </div>

    <!-- Submission -->
    <div class="pt-4 px-8">
      <BaseButton
        v-if="!registrationStore.registration.confirmation"
        class="btn btn-blue"
        @click="finalErrorCheck">
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

<style scoped>
  table {
    table-layout: auto;
    border-collapse: collapse;
  }

  td {
    padding: 0px 8px;
  }
</style>
