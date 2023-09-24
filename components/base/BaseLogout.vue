<script setup lang="ts">
  import { useAppStore } from '@/stores/appStore'
  import { useRegistration } from '@/stores/userRegistration'
  import { usePerformers } from '@/stores/userPerformer'
  import { useTeacher } from '@/stores/userTeacher'
  import { useClasses } from '@/stores/userClasses'
  import { useGroup } from '@/stores/userGroup'
  import { useSchool } from '@/stores/userSchool'

  const appStore = useAppStore()
  const registratinStore = useRegistration()
  const performerStore = usePerformers()
  const teacherStore = useTeacher()
  const classStore = useClasses()
  const groupStore = useGroup()
  const schoolStore = useSchool()

  function signout() {
    appStore.$reset()
    registratinStore.$reset()
    performerStore.$reset()
    teacherStore.$resetTeacher()
    teacherStore.$resetAllTeachers()
    classStore.$reset()
    groupStore.$reset()
    schoolStore.$reset()

    const { onResult, onError } = useQuery(gql`
      query Logout {
        logout
      }
    `)
    onResult((result) => {
      navigateTo('/login')
    })
    onError((error) => {
      console.log(error)
      navigateTo('/login')
    })
    navigateTo('/login')
  }
</script>

<template>
  <div>
    <a
      class="hover:cursor-pointer"
      @click="signout"
      >Logout</a
    >
  </div>
</template>

<style scoped></style>
