<script setup lang="ts">
  import { DateTime } from 'luxon'
  import { usePerformers } from '../stores/userPerformer'
  import { useTeacher } from '../stores/userTeacher'
  import { useGroup } from '../stores/userGroup'
  import { useSchool } from '../stores/userSchool'
  import { useSchoolGroup } from '../stores/userSchoolGroup'
  import { useCommunity } from '../stores/userCommunity'
  import { useClasses } from '../stores/userClasses'
  import { useRegistration } from '../stores/userRegistration'
  import { useAppStore } from '../stores/appStore'
  import { formErrors } from '../composables/formErrors'

  const performerStore = usePerformers()
  const teacherStore = useTeacher()
  const groupStore = useGroup()
  const schoolStore = useSchool()
  const schoolGroupStore = useSchoolGroup()
  const communityStore = useCommunity()
  const classesStore = useClasses()
  const appStore = useAppStore()
  const registrationStore = useRegistration()

  const performers = performerStore.performers
  const teacher = teacherStore.teacher
  const group = groupStore.group
  const school = schoolStore.school
  const schoolGroups = schoolGroupStore.schoolGroup
  const community = communityStore.community
  const festivalClasses = classesStore.registeredClasses
  const performerType = appStore.performerType
  const registration = registrationStore.registration
  const userFirstName = registrationStore.user.firstName
  const userLastName = registrationStore.user.lastName
  const userEmail = registrationStore.user.email

  function schoolClassGroup(id: number) {
    return schoolGroups.find((item) => item.id === id)
  }

  function dateFunction(date: Date | undefined) {
    if (date) {
      const dateString = date.toString()
      return DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_MED)
    }
  }
</script>

<template>
  <mjml>
    <mj-body>
      <!-- Company Header -->
      <mj-section>
        <mj-column>
          <mj-text>
            <h1>Winnipeg Music Festival</h1>
            <h2>Registration Summary</h2>
            <h3>
              Confirmation Number:
              {{ registration.confirmation }}
            </h3>
            <div>Submitted by:</div>
            <div>{{ userFirstName }} {{ userLastName }}</div>
            <div>{{ userEmail }}</div>
            <div>{{ dateFunction(registration.submittedAt) }}</div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Group Info -->
      <mj-section
        v-if="performerType === 'GROUP'"
        background-color="#fafafa">
        <mj-column>
          <mj-text>
            <h1>Group Information</h1>
            <h2>Name: {{ group.name }}</h2>
            <div>Group Type: {{ group.groupType }}</div>
            <div>Number of Performers: {{ group.numberOfPerformers }}</div>
            <div>Average age: {{ group.age }}</div>
            <div>Instruments: {{ group.instruments }}</div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Performer Info -->
      <mj-section
        v-if="performerType === 'GROUP' || performerType === 'SOLO'"
        background-color="#f0f0f0">
        <mj-column>
          <mj-text>
            <h1>Performer(s)</h1>
          </mj-text>
          <mj-text
            v-for="performer in performers"
            v-bind:key="performer.id">
            <div>{{ performer.firstName }} {{ performer.lastName }}</div>
            <div v-if="performer.apartment">
              {{ performer.apartment }} -
              {{ performer.streetNumber }}
              {{ performer.streetName }}
            </div>
            <div v-else>
              {{ performer.streetNumber }}
              {{ performer.streetName }}
            </div>
            <div>
              {{ performer.city }},
              {{ performer.province }}
            </div>
            <div>{{ performer.postalCode }}</div>
            <div>Phone: {{ performer.phone }}</div>
            <div>Email: {{ performer.email }}</div>
            <div v-if="performer.age">
              <div>Age: {{ performer.age }}</div>
            </div>
            <div v-if="performer.instrument">
              <div>Instrument: {{ performer.instrument }}</div>
            </div>
            <div v-if="performer.level">
              <div>Grade Level: {{ performer.level }}</div>
            </div>
            <div v-if="performer.otherClasses">
              <div>
                Participating in other classes:
                {{ performer.otherClasses }}
              </div>
            </div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- School Info -->
      <mj-section
        v-if="performerType === 'SCHOOL'"
        background-color="#f4f4f4">
        <mj-column>
          <mj-text>
            <h1>School</h1>
            <h2>{{ school.name }}</h2>
            <h3>Division: {{ school.division }}</h3>
            <div>
              {{ school.streetNumber }}, {{ school.streetName }},
              {{ school.city }}, {{ school.province }}
            </div>
            <div>{{ school.postalCode }}</div>
            <div>Phone: {{ school.phone }}</div>
          </mj-text>
          <mj-text>School Groups</mj-text>
          <mj-text
            v-for="group in school.schoolGroups"
            v-bind:key="group.id">
            <div>Group: {{ group.name }}</div>
            <br />
            <div>Chaperones: {{ group.chaperones }}</div>
            <div>Wheelchairs: {{ group.wheelchairs }}</div>
            <div>Total Group Size: {{ group.groupSize }}</div>
            <br />
            <div>Earliest Time: {{ group.earliestTime }}</div>
            <div>Latest Time: {{ group.latestTime }}</div>
            <div>Unavailable Time {{ group.unavailable }}</div>
            <div>
              Performers in other classes: {{ group.conflictPerformers }}
            </div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Community Info -->
      <mj-section
        v-if="performerType === 'COMMUNITY'"
        background-color="#fcfcfc">
        <mj-column>
          <mj-text>
            <h1>Community</h1>
            <h2>Group Name: {{ community.name }}</h2>
            <br />
            <div>Chaperones: {{ community.chaperones }}</div>
            <div>Wheelchairs: {{ community.wheelchairs }}</div>
            <div>Total Group Size: {{ community.groupSize }}</div>
            <br />
            <div>Earliest Time: {{ community.earliestTime }}</div>
            <div>Latest Time: {{ community.latestTime }}</div>
            <div>Unavailable Time:{{ community.unavailable }}</div>
            <div>
              Performers in other classes: {{ community.conflictPerformers }}
            </div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Teacher Info -->
      <mj-section background-color="#f0f0f0">
        <mj-column>
          <mj-text>
            <h1>Teacher</h1>
          </mj-text>
          <mj-text>
            <div>{{ teacher.firstName }} {{ teacher.lastName }}</div>
            <div v-if="teacher.apartment">
              {{ teacher.apartment }} -
              {{ teacher.streetNumber }}
              {{ teacher.streetName }}
            </div>
            <div v-else>
              {{ teacher.streetNumber }}
              {{ teacher.streetName }}
            </div>
            <div>
              {{ teacher.city }},
              {{ teacher.province }}
            </div>
            <div>{{ teacher.postalCode }}</div>
            <div>Phone: {{ teacher.phone }}</div>
            <div>Email: {{ teacher.email }}</div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Registered Classes -->
      <mj-section background-color="#fafafa">
        <mj-column>
          <mj-text>
            <h1>Registered Classes</h1>
          </mj-text>
          <mj-text
            v-for="registeredClass in festivalClasses"
            v-bind:key="registeredClass.id">
            <h2>Festival Class Number: {{ registeredClass.classNumber }}</h2>
            <h3 v-if="performerType === 'SCHOOL'">
              School Group:
              {{ schoolClassGroup(registeredClass.schoolGroupID).name }}
            </h3>
            <h4>Amount: {{ registeredClass.price }}</h4>
            <div>Class: {{ registeredClass.subdiscipline }}</div>
            <div>Category: {{ registeredClass.category }}</div>
            <div>Level: {{ registeredClass.level }}</div>
            <div
              v-for="(selection, selectionIndex) in registeredClass.selections"
              v-bind:key="selection.id">
              <h4>Selection {{ selectionIndex + 1 }}</h4>
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
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Total Payment -->
      <mj-section>
        <mj-column>
          <mj-text>
            <h2>Total Amount - {{ registration.totalAmt }}</h2>
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
</template>
