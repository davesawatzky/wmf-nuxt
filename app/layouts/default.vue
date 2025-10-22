<script setup lang="ts">
  import { useAppStore } from '~/stores/appStore'
  import { useUser } from '~/stores/useUser'

  const appStore = useAppStore()
  const userStore = useUser()
  const mutationLoading = useGlobalMutationLoading()
  const queryLoading = useGlobalQueryLoading()
</script>

<template>
  <div>
    <BaseHeader
      :private-teacher="userStore.user.privateTeacher ?? false"
      :school-teacher="userStore.user.schoolTeacher ?? false" />
    <PVProgressBar
      v-if="queryLoading || mutationLoading || appStore.dataLoading"
      mode="indeterminate"
      class="fixed top-[0px] z-50 w-full h-[5px]" />
    <div class="bg-sky-600 pt-5 pb-8 section-min-height">
      <div
        class="container bg-sky-100 py-8 px-2 sm:px-10 lg:max-w-5xl sm:mx-auto rounded-lg shadow-xl">
        <slot />
      </div>
    </div>
    <footer class="bg-sky-800 text-white">
      <div
        class="container pt-4 px-2 sm:px-10 lg:max-w-5xl mx-auto flex items-center">
        <div>
          <div class="text-lg font-semibold">Winnipeg Music Festival</div>
          <address class="text-sm">
            2-88 St. Anne's Rd.<br />Winnipeg, MB R2M 2Y7<br />Phone: (204)
            947-0184<br />Email:
            <a href="mailto:wmf@mymts.net">wmf@mymts.net</a>
          </address>
        </div>
      </div>
      <div
        class="container text-sky-400 text-sm pb-6 pt-4 sm:px-10 lg:max-w-5xl mx-auto flex flex-col items-center justify-center">
        <div class="">Created by</div>
        <a
          class=""
          href="https://www.diatonic.io"
          target="_blank"
          >Diatonic Web Design and Development</a
        >
      </div>
    </footer>
  </div>
</template>

<style lang="css" scoped></style>
