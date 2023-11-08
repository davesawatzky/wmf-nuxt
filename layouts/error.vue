<script setup lang="ts">
  const mutationLoading = useGlobalMutationLoading()
  const queryLoading = useGlobalQueryLoading()
</script>

<template>
  <div>
    <base-spinner v-if="queryLoading || mutationLoading" />

    <header class="bg-sky-800 py-2 text-white">
      <section
        class="px-3 mx-auto lg:max-w-5xl flex justify-between items-center">
        <!-- Music Festival Logo -->
        <div class="flex">
          <img
            class="inline h-16"
            src="/images/wmf-logo-banner.jpg"
            alt="Winnipeg Music Festival Logo" />
          <div class="ml-4 font-semibold">
            Winnipeg<br />Music<br />Festival
          </div>
        </div>

        <!-- Centered Title -->
        <div class="font-bold text-2xl invisible md:visible">
          Festival Registration
        </div>
      </section>
    </header>

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
            <a href="mailto:wmf@mts.net">wmf@mts.net</a>
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
