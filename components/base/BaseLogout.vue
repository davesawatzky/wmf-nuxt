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
  const userStore = useUser()

  const {
    load: loadLogout,
    onResult,
    onError,
  } = useLazyQuery(gql`
    query Logout {
      logout
    }
  `)
  onResult(async () => {
    await navigateTo('/login')
  })
  onError(async (error) => {
    console.log(error)
    await navigateTo('/login')
  })

  async function signout() {
    appStore.$reset()
    registratinStore.$reset()
    performerStore.$reset()
    teacherStore.$resetTeacher()
    teacherStore.$resetAllTeachers()
    classStore.$reset()
    groupStore.$reset()
    schoolStore.$reset()
    userStore.$reset()
    await loadLogout()
    await navigateTo('/login')
  }
</script>

<template>
  <div>
    <a
      class="hover:cursor-pointer w-full"
      @click="signout"
      ><slot /> Sign out</a
    >
  </div>
</template>

<style scoped></style>
