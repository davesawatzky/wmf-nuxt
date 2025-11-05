<script setup lang="ts">
  import { useTabErrors } from '~/composables/tabErrors'

  defineProps<{
    currentTab: string
    tabs: string[]
  }>()

  const emit = defineEmits<{
    setTab: [tab: string, index: number]
  }>()

  const queryLoading = useGlobalQueryLoading()
  const mutationLoading = useGlobalMutationLoading()
  const appStore = useAppStore()
  const tabErrors = useTabErrors()

  function getErrorCount(tab: string): number {
    return tabErrors.value[tab] ?? 0
  }

  function changeTab(tab: string, index: number) {
    emit('setTab', tab, index)
  }

  const disableButton = computed(() => {
    if (queryLoading.value || mutationLoading.value || appStore.dataLoading) {
      return true
    } else {
      return false
    }
  })
</script>

<template>
  <div
    id="stepperGridContainer"
    class="grid grid-flow-col auto-cols-fr md:mx-28 my-4 z-20">
    <div
      v-for="(tab, index) in tabs"
      :key="tab"
      class="flex flex-col relative z-20">
      <button
        class="text-white justify-self-center mx-auto w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full font-bold sm:text-lg z-20 relative"
        :class="[
          { active: currentTab === tab },
          currentTab === tab
            ? 'bg-sky-400 ring-sky-300 ring-4'
            : 'btn-blue hover:ring-2',
        ]"
        :disabled="disableButton"
        @click="changeTab(tab, index)">
        {{ index + 1 }}
        <BaseBadge
          v-if="getErrorCount(tab) > 0"
          has-errors
          class="-right-2 top-0">
          {{ getErrorCount(tab) }}
        </BaseBadge>
        <BaseBadge v-else-if="tab !== 'Summary'" />
      </button>
      <div
        v-if="tab !== 'Summary'"
        class="absolute z-10 h-1 bg-sky-900 top-[23px] w-full left-[50%]" />
      <div class="text-center font-semibold text-sm sm:text-lg z-20">
        {{ tab }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
