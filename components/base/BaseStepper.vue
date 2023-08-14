<script setup lang="ts">
  import type { ErrorCounts } from '@/composables/types'

  const props = defineProps<{
    tabs: string[]
    fieldErrors: ErrorCounts
  }>()

  const emit = defineEmits<{
    setTab: [tab: string, index: number]
  }>()

  const currentTab = ref('')
  const tabIndex = ref(0)

  function changeTab(tab: string, index: number) {
    currentTab.value = tab
    tabIndex.value = index
    emit('setTab', currentTab.value, tabIndex.value)
  }

  onMounted(() => {
    currentTab.value = props.tabs[0]
    emit('setTab', currentTab.value, tabIndex.value)
  })
</script>

<template>
  <div
    id="stepperGridContainer"
    class="grid grid-flow-col auto-cols-fr mx-28 my-4 z-20">
    <div
      v-for="(tab, index) in tabs"
      :key="tab"
      class="flex flex-col relative z-20">
      <button
        class="text-white justify-self-center mx-auto w-[50px] h-[50px] rounded-full font-bold text-lg z-20 relative"
        :class="[
          { active: currentTab === tab },
          currentTab === tab
            ? 'bg-sky-400 ring-sky-300 ring-4'
            : 'btn-blue hover:ring-2',
        ]"
        @click="changeTab(tab, index)">
        {{ index + 1 }}
        <BaseBadge
          v-if="fieldErrors[tab] > 0"
          class="-right-2 top-0"
          >{{ fieldErrors[tab] }}</BaseBadge
        >
      </button>
      <div
        v-if="tab !== 'Summary'"
        class="absolute z-10 h-1 bg-sky-900 top-[23px] w-full left-[50%]"></div>
      <div class="text-center font-semibold text-lg z-20">{{ tab }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
