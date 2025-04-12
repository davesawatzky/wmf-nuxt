<script lang="ts" setup>
  const props = defineProps<{
    privateTeacher?: boolean
    schoolTeacher?: boolean
  }>()

  const showMenu = ref(false)
  const route = useRoute()
  const teacherStore = useTeacher()
  const appStore = useAppStore()

  function toggleNav() {
    showMenu.value = !showMenu.value
  }

  // async function cleanUpTeachers() {
  //   if (route.name === 'Form') {
  //     if (teacherStore.unlistedTeacher === true) {
  //       await teacherStore.removeUnlistedTeacher()
  //     }
  //   }
  // }
</script>

<template>
  <header class="bg-sky-800 py-2 text-white">
    <section
      class="px-3 mx-auto lg:max-w-5xl flex justify-between items-center">
      <!-- Music Festival Logo -->
      <div class="flex">
        <NuxtPicture
          :imgAttrs="{ class: 'inline h-16' }"
          src="/images/wmf-logo-banner.jpg"
          alt="Winnipeg Music Festival Logo" />
        <div class="ml-4 font-semibold">Winnipeg<br />Music<br />Festival</div>
      </div>

      <!-- Centered Title -->
      <div class="font-bold text-2xl invisible md:visible">
        Festival Registration
      </div>

      <!-- Toggle Button -->
      <div v-if="route.name !== 'Login' && route.name !== 'EmailConfirmation'">
        <button
          id="hamburger-button"
          type="button"
          class="relative w-8 h-8 md:hidden text-3xl cursor-pointer"
          :class="showMenu ? 'toggle-btn' : ''"
          @click="toggleNav">
          <div
            class="absolute top-4 -mt-0.5 h-1 w-8 rounded-sm bg-white transition-all duration-500 before:absolute before:h-1 before:w-8 before:-translate-x-4 before:-translate-y-3 before:rounded-sm before:bg-white before:transition-all before:duration-500 before:content-[''] after:absolute after:h-1 after:w-8 after:-translate-x-4 after:translate-y-3 after:rounded-sm after:bg-white after:transition-all after:duration-500 after:content-['']" />
        </button>

        <nav
          class="hidden md:block"
          aria-label="main">
          <div class="md:flex">
            <UIMenu>
              <UIMenuButton class="px-3 py-1 mx-1 hover:bg-sky-600 rounded-md">
                <Icon
                  class="align-middle text-2xl"
                  name="ic:round-app-registration" />
                Registrations
              </UIMenuButton>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-out"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <UIMenuItems
                  class="absolute z-10 mt-[45px] ml-[-75px] w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg shadow-slate-400 ring-1 ring-black ring-opacity-10 focus:outline-hidden">
                  <div class="p-1">
                    <UIMenuItem
                      v-slot="{ active, close }"
                      as="template">
                      <NuxtLink
                        class="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                        :class="[
                          {
                            'bg-sky-600 text-white': active,
                            'bg-white text-black': !active,
                          },
                        ]"
                        to="/Registrations"
                        no-prefetch
                        @click="close">
                        <Icon
                          class="text-2xl w-8 align-middle mr-2"
                          :class="[{ 'bg-white text-sky-600': !active }]"
                          name="ic:round-app-registration" />
                        My Registrations
                      </NuxtLink>
                    </UIMenuItem>
                    <UIMenuItem
                      v-if="privateTeacher"
                      v-slot="{ active }"
                      as="template">
                      <NuxtLink
                        class="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                        :class="[
                          {
                            'bg-sky-600 text-white': active,
                            'bg-white text-black': !active,
                          },
                        ]"
                        to="/Students">
                        <Icon
                          class="text-2xl w-8 align-middle mr-2"
                          :class="[{ 'bg-white text-sky-600': !active }]"
                          name="mdi:account-music" />
                        My Students
                      </NuxtLink>
                    </UIMenuItem>
                  </div>
                </UIMenuItems>
              </transition>
            </UIMenu>
            <UIMenu>
              <UIMenuButton class="px-3 py-1 mx-1 hover:bg-sky-600 rounded-md">
                <Icon
                  class="align-middle text-2xl"
                  name="fluent:inprivate-account-24-filled" />
                Account
              </UIMenuButton>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-out"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <UIMenuItems
                  class="absolute z-10 mt-[45px] ml-[42px] w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg shadow-slate-400 ring-1 ring-black ring-opacity-10 focus:outline-hidden">
                  <div class="p-1">
                    <UIMenuItem
                      v-slot="{ active, close }"
                      as="template">
                      <NuxtLink
                        class="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                        :class="[
                          {
                            'bg-sky-600 text-white': active,
                            'bg-white text-black': !active,
                          },
                        ]"
                        to="/UserInformation"
                        @click="close">
                        <Icon
                          class="text-2xl w-8 align-middle mr-2"
                          :class="[{ 'bg-white text-sky-600': !active }]"
                          name="fluent:inprivate-account-24-filled" />
                        User Account
                      </NuxtLink>
                    </UIMenuItem>
                    <UIMenuItem
                      v-slot="{ active }"
                      as="template">
                      <BaseLogout
                        class="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                        :class="[
                          {
                            'bg-sky-600 text-white': active,
                            'bg-white text-black': !active,
                          },
                        ]">
                        <Icon
                          class="text-2xl w-8 align-middle mr-2"
                          :class="[{ 'bg-white text-sky-600': !active }]"
                          name="heroicons-outline:logout" />
                      </BaseLogout>
                    </UIMenuItem>
                  </div>
                </UIMenuItems>
              </transition>
            </UIMenu>
          </div>
        </nav>
      </div>
    </section>
    <section
      v-if="route.name !== 'Login' && route.name !== 'EmailConfirmation'"
      id="mobile-menu"
      :class="showMenu ? 'flex' : 'hidden'"
      class="absolute top-84 bg-sky-800 z-30 w-full text-2xl flex-col justify-content-center origin-top animate-open-menu">
      <nav
        class="flex flex-col min-h-screen items-center py-16"
        aria-label="mobile">
        <ul>
          <li
            v-if="route.name !== 'Registrations'"
            class="px-3 py-4 mx-1 hover:bg-sky-500 hover:ring-2 rounded-md text-center">
            <nuxt-link
              to="/Registrations"
              @click="toggleNav">
              <Icon name="ic:round-app-registration" />
              Registration Forms
            </nuxt-link>
          </li>
          <li
            v-if="route.name !== 'Students' && !!privateTeacher"
            class="px-3 py-4 mx-1 hover:bg-sky-500 hover:ring-2 rounded-md text-center">
            <nuxt-link
              to="/Students"
              @click="toggleNav">
              <Icon name="mdi:account-music" />
              My Students
            </nuxt-link>
          </li>
          <li
            v-if="route.name !== 'UserInformation'"
            class="px-3 py-4 mx-1 hover:bg-sky-500 hover:ring-2 rounded-md text-center">
            <nuxt-link
              to="/UserInformation"
              @click="toggleNav">
              <Icon name="fluent:inprivate-account-24-filled" />
              My Account
            </nuxt-link>
          </li>
          <li
            class="px-3 py-4 mx-1 hover:bg-sky-500 hover:ring-2 rounded-md text-center">
            <BaseLogout @click="toggleNav" />
          </li>
        </ul>
      </nav>
    </section>
  </header>
</template>

<style></style>
