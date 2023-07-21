<script setup lang="ts">
  import type { Component } from 'vue'

  interface DynamicComponent {
    [key: string]: Component
  }

  const props = defineProps<{
    tabs: DynamicComponent
  }>()

  const emit = defineEmits<{
    (ev: 'setTab', tab: string, index: number): void
  }>()

  const currentTab = ref('')
  const tabIndex = ref(0)

  function changeTab(tab: string, index: number) {
    currentTab.value = tab
    tabIndex.value = index
  }

  watchEffect(() => {
    if (!currentTab.value) {
      currentTab.value = Object.keys(props.tabs)[0]
    }
    emit('setTab', currentTab.value, tabIndex.value)
  })
</script>

<template>
  <div
    id="stepperGridContainer"
    class="grid grid-flow-col auto-cols-fr mx-28 my-4 z-20">
    <div
      v-for="(_, tab, index) in tabs"
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

        <!-- TODO: Add conditional statement to BaseBadge -->
        <BaseBadge class="-right-2 top-0">25</BaseBadge>
      </button>
      <div
        v-if="tab !== 'Summary'"
        class="absolute z-10 h-1 bg-sky-900 top-[23px] w-full left-[50%]"></div>
      <div class="text-center font-semibold text-lg z-20">{{ tab }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .progress {
    position: absolute;
    background-color: #850101;
    height: 6px;
    z-index: -1;
    top: 22px;
    left: 50px;
    right: -50px;
    margin: 0 auto;
  }
</style>
