<script setup lang="ts"></script>

<template>
  <div>
    <div
      class="flex align-bottom p-2 text-white bg-sky-700 border border-sky-700 shadow-md rounded-t-lg">
      <slot name="heading1"> </slot>
      <div class="px-8">
        <slot name="heading2"> </slot>
      </div>
    </div>
    <div class="p-4 border border-sky-500 shadow-md rounded-b-lg bg-white">
      <slot name="details"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
