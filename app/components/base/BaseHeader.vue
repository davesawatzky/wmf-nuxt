<script lang="ts" setup>
  const appStore = useAppStore()
  const registratinStore = useRegistration()
  const performerStore = usePerformers()
  const teacherStore = useTeacher()
  const classStore = useClasses()
  const groupStore = useGroup()
  const schoolStore = useSchool()
  const userStore = useUser()
  const fieldConfig = useFieldConfig()

  const props = defineProps<{
    privateTeacher?: boolean
    schoolTeacher?: boolean
  }>()

  const route = useRoute()

  const items = ref([
    {
      label: 'Registrations',
      items: [
        {
          label: 'My Registrations',
          icon: 'ic:round-app-registration',
          command: () => navigateTo('/Registrations'),
        },
        {
          label: 'My Students',
          icon: 'mdi:account-music',
          visible: () => props.privateTeacher,
          command: () => navigateTo('/Students'),
        },
      ],
    },
    {
      label: 'Account',
      items: [
        {
          label: 'User Account',
          icon: 'fluent:inprivate-account-24-filled',
          command: () => navigateTo('/UserInformation'),
        },
        {
          label: 'Sign Out',
          icon: 'heroicons-outline:logout',
          command: () => signout(),
        },
      ],
    },
  ])

  const {
    load: loadLogout,
    onResult,
    onError,
  } = useLazyQuery(gql`
    query Logout {
      logout
    }
  `)
  onResult(async () => {
    await navigateTo('/login')
  })
  onError(async (error) => {
    console.log(error)
    await navigateTo('/login')
  })

  async function signout() {
    appStore.$reset()
    registratinStore.$reset()
    performerStore.$reset()
    teacherStore.$resetTeacher()
    teacherStore.$resetAllTeachers()
    classStore.$reset()
    groupStore.$reset()
    schoolStore.$reset()
    userStore.$reset()
    fieldConfig.$reset()
    await loadLogout()
    await navigateTo('/login')
  }

  const visible = ref(false)

  function toggleMobileMenu() {
    visible.value = !visible.value
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
    <div v-if="route.name !== 'Login' && route.name !== 'EmailConfirmation'">
      <PVMenubar
        :model="items"
        class="hidden md:flex bg-sky-800 text-white lg:max-w-5xl mx-auto justify-between">
        <template #start>
          <NuxtPicture
            :img-attrs="{ class: 'inline h-16' }"
            src="/images/wmf-logo-banner.jpg"
            alt="Winnipeg Music Festival Logo" />
          <div class="ml-4 font-semibold">
            Winnipeg<br />Music<br />Festival
          </div>
        </template>
        <template #item="{ item, props, root }">
          <!-- <div v-if="!privateTeacher"> -->
          <button
            v-ripple
            class="w-full px-4 py-2 text-black bg-sky-800 hover:bg-sky-600 focus:outline-0 rounded-md ring-0"
            :class="{
              'text-white': root,
              'border-2': !root,
              'border-white': !root,
              'hover:text-white': !root,
              'bg-white': !root,
              'hover:bg-sky-600': !root,
            }"
            v-bind="props.action">
            <span>{{ item.label }}</span>
          </button>
          <!-- </div> -->
        </template>
      </PVMenubar>
    </div>

    <div
      class="md:hidden flex items-center justify-between px-4 py-2 lg:max-w-5xl mx-auto">
      <div class="flex items-center">
        <NuxtPicture
          :img-attrs="{ class: 'inline h-12' }"
          src="/images/wmf-logo-banner.jpg"
          alt="Winnipeg Music Festival Logo" />
        <div class="ml-2 font-semibold text-sm">
          Winnipeg<br />Music<br />Festival
        </div>
      </div>

      <!-- Hamburger button for mobile -->
      <button
        id="hamburger-button"
        type="button"
        class="relative w-8 h-8 text-3xl"
        @click="toggleMobileMenu">
        <div
          class="absolute top-4 -mt-0.5 h-1 w-8 rounded-sm bg-white transition-all duration-500 before:absolute before:h-1 before:w-8 before:-translate-x-4 before:-translate-y-3 before:rounded-sm before:bg-white before:transition-all before:duration-500 before:content-[''] after:absolute after:h-1 after:w-8 after:-translate-x-4 after:translate-y-3 after:rounded-sm after:bg-white after:transition-all after:duration-500 after:content-['']" />
      </button>
    </div>

    <!-- PrimeVue Drawer for mobile menu -->
    <PVDrawer
      v-model:visible="visible"
      position="right"
      :modal="true"
      :close-on-escape="true"
      class="p-4 bg-sky-700 text-white w-4/5">
      <div class="flex flex-col space-y-4">
        <h2 class="text-xl font-bold mb-4 border-b pb-2">Menu</h2>

        <!-- Main items -->
        <div
          v-for="(item, i) in items"
          :key="i"
          class="mb-4">
          <h3 class="text-lg font-semibold mb-2">{{ item.label }}</h3>

          <!-- Sub items -->
          <div
            v-for="(subItem, j) in item.items"
            :key="j"
            class="pl-4 py-2">
            <button
              class="flex items-center w-full active:bg-sky-600 rounded-md px-3 py-2"
              @click="(subItem.command(), (visible = false))">
              <Icon
                v-if="subItem.icon"
                :name="subItem.icon"
                class="mr-2 text-lg" />
              {{ subItem.label }}
            </button>
          </div>
        </div>
      </div>
    </PVDrawer>
  </header>
</template>

<style></style>
