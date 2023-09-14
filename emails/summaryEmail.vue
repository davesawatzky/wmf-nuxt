<script setup lang="ts">
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

  function schoolClassGroup(id: number) {
    return schoolGroupStore.schoolGroup.find((item) => item.id === id)
  }
</script>

<template>
  <EHtml lang="en">
    <ETailwind>
      <EContainer>
        <EHeading as="h2">Winnipeg Music Festival</EHeading>
        <EHeading as="h3">Registration Summary</EHeading>
        <EHeading as="h3"
          >Confirmation Number:
          {{ registrationStore.registration.confirmation }}</EHeading
        >
        <EHr />

        <!-- Registered Classes -->
        <EHeading as="h3">Registered Classes</EHeading>
        <ESection
          v-for="registeredClass in classesStore.registeredClasses"
          :key="registeredClass.id">
          <EHeading as="h4"
            >Festival Class Number: {{ registeredClass.classNumber }}
          </EHeading>
          <EHeading
            v-if="appStore.performerType === 'SCHOOL'"
            as="h4">
            School Group:
            {{ schoolClassGroup(registeredClass.schoolGroupID!)?.name }}
          </EHeading>
          <EText
            >Class: {{ registeredClass.subdiscipline?.toUpperCase() }}</EText
          >
          <EText>Category: {{ registeredClass.category }}</EText>
          <EText>Level: {{ registeredClass.level }}</EText>
          <ESection
            v-for="(selection, selectionIndex) in registeredClass.selections"
            :key="selection.id">
            <EHeading as="h5">Selection {{ selectionIndex + 1 }}</EHeading>
            <EText>Title: {{ selection.title }}</EText>
            <EText>Composer: {{ selection.composer }}</EText>
            <EText v-if="selection.largerWork"
              >from Work: {{ selection.largerWork }}</EText
            >
            <EText v-if="selection.movement"
              >Movement: {{ selection.movement }}</EText
            >
            <EText>Duration: {{ selection.duration }}</EText>
          </ESection>
        </ESection>
      </EContainer>
    </ETailwind>
  </EHtml>
</template>
