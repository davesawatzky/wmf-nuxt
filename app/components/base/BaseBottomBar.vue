<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const mobile = breakpoints.smaller('sm')
</script>

<template>
  <div
    v-if="mobile"
    class="h-[60px] fixed bottom-0 left-0 right-0 bg-white w-full border-t border-slate-400"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped></style>
