<script setup lang="ts"></script>

<template>
  <div class="mb-4">
    <div
      class="flex align-bottom p-2 text-white bg-sky-700 border border-sky-700 shadow-md rounded-t-lg"
    >
      <div>
        <h4 class="text-lg sm:text-xl">
          <slot name="heading1" />
        </h4>
        <div><slot name="heading3" /></div>
      </div>
      <div class="text-sm sm:text-base px-2 sm:px-10">
        <slot name="heading2" />
      </div>
    </div>
    <div
      class="text-sm sm:text-base p-2 sm:p-4 border border-sky-500 shadow-md rounded-b-lg bg-white"
    >
      <slot name="details" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
