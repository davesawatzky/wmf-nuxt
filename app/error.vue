<script setup lang="ts">
  const error = useError()
</script>

<template>
  <div>
    <BaseHeader />
    <div class="bg-sky-600 pt-5 pb-8 section-min-height">
      <div
        class="container bg-sky-100 py-8 px-2 sm:px-10 lg:max-w-5xl sm:mx-auto rounded-lg shadow-xl">
        <h1>Error - {{ error!.statusCode }}</h1>
        <p>{{ error!.message }}</p>
        <button
          class="btn btn-blue mt-2"
          @click="navigateTo('/login')">
          Return to Sign in
        </button>
      </div>
    </div>
    <footer class="bg-sky-800 text-white">
      <div
        class="container pt-4 px-2 sm:px-10 lg:max-w-5xl mx-auto flex items-center">
        <div>
          <div class="text-lg font-semibold">Winnipeg Music Festival</div>
          <address class="text-sm">
            2-88 St. Anne's Rd.<br >Winnipeg, MB R2M 2Y7<br >Phone: (204)
            947-0184<br >Email:
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
