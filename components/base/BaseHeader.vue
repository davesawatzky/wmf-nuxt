<script lang="ts" setup>
  const showMenu = ref(false)

  function toggleNav() {
    showMenu.value = !showMenu.value
  }
</script>

<template>
  <header class="bg-sky-800 py-2 text-white">
    <section class="px-3 mx-auto lg:max-w-5xl flex justify-between items-center">
      <!-- Music Festival Logo -->
      <div class="flex">
        <img
          class="inline h-16"
          src="@/assets/images/wmf-logo-banner.jpg"
          alt="Winnipeg Music Festival Logo" />
        <div class="ml-4 font-semibold">Winnipeg<br />Music<br />Festival</div>
      </div>

      <!-- Centered Title -->
      <div class="font-bold text-2xl invisible md:visible">Festival Registration</div>

      <!-- Toggle Button -->
      <div v-if="$route.name !== 'Login'">
        <button
          id="hamburger-button"
          type="button"
          class="relative w-8 h-8 md:hidden text-3xl cursor-pointer"
          :class="showMenu ? 'toggle-btn' : ''"
          @click="toggleNav">
          <div
            class="absolute top-4 -mt-0.5 h-1 w-8 rounded bg-white transition-all duration-500 before:absolute before:h-1 before:w-8 before:-translate-x-4 before:-translate-y-3 before:rounded before:bg-white before:transition-all before:duration-500 before:content-[''] after:absolute after:h-1 after:w-8 after:-translate-x-4 after:translate-y-3 after:rounded after:bg-white after:transition-all after:duration-500 after:content-['']" />
        </button>

        <nav
          class="hidden md:block"
          aria-label="main">
          <ul class="md:flex">
            <li
              v-if="$route.name !== 'Registrations'"
              class="px-3 py-1 mx-1 hover:bg-sky-500 hover:ring-2 rounded-md">
              <router-link to="Registrations"> Registration Forms </router-link>
            </li>
            <li class="px-3 py-1 mx-1 hover:bg-sky-500 hover:ring-2 rounded-md">
              <BaseLogout />
            </li>
          </ul>
        </nav>
      </div>
    </section>
    <section
      v-if="$route.name !== 'Login'"
      id="mobile-menu"
      :class="showMenu ? 'flex' : 'hidden'"
      class="absolute top-84 bg-sky-800 z-10 w-full text-4xl flex-col justify-content-center origin-top animate-open-menu">
      <nav
        class="flex flex-col min-h-screen items-center py-16"
        aria-label="mobile">
        <ul>
          <li
            v-if="$route.name !== 'Registrations'"
            class="px-3 py-4 mx-1 hover:bg-sky-500 hover:ring-2 rounded-md text-center">
            <router-link
              to="Registrations"
              @click="toggleNav">
              Registration Forms
            </router-link>
          </li>
          <li class="px-3 py-4 mx-1 hover:bg-sky-500 hover:ring-2 rounded-md text-center">
            <BaseLogout @click="toggleNav" />
          </li>
        </ul>
      </nav>
    </section>
  </header>
</template>

<style></style>
