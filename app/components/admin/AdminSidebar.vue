<script setup lang="ts">
  const items = ref([
    {
      label: '',
      items: [
        {
          label: 'Dashboard',
          icon: 'ic:round-dashboard',
        },
      ],
    },
    {
      label: 'Class Definitions',
      items: [
        {
          label: 'Performer Type',
          icon: 'emojione-monotone:performing-arts',
        },
        {
          label: 'Disciplines',
          icon: 'emojione-monotone:saxophone',
        },
        {
          label: 'Categories',
          icon: 'ic:outline-category',
        },
        {
          label: 'Levels',
          icon: 'carbon:skill-level-intermediate',
        },
        {
          label: 'Awards',
          icon: 'carbon:trophy-filled',
        },
      ],
    },
    {
      label: 'Registrations',
      items: [
        {
          label: 'Classes',
          icon: 'ic:round-class',
        },
        {
          label: 'Participants',
          icon: 'material-symbols:artist-outline-rounded',
        },
        {
          label: 'Teachers',
          icon: 'ph:chalkboard-teacher',
        },
      ],
    },
    {
      label: 'Program',
      items: [
        {
          label: 'Venues',
          icon: 'ri:building-2-fill',
        },
        {
          label: 'Schedule',
          icon: 'uil:schedule',
        },
      ],
    },
    {
      label: 'Reports',
      items: [
        {
          label: 'Schedule',
          icon: 'mdi:file-report',
        },
        {
          label: 'Participant',
          icon: 'mdi:file-report',
        },
        {
          label: 'Teacher',
          icon: 'mdi:file-report',
        },
        {
          label: 'Repertoire',
          icon: 'mdi:file-report',
        },
      ],
    },

    {
      label: 'Admin',
      items: [
        {
          label: 'User Admin',
          icon: 'mdi:user',
        },
      ],
    },
  ])
</script>

<template>
  <PVMenu
    :model="items"
    class="w-[250px] h-full rounded-none overflow-auto">
    <template #submenuheader="{ item }">
      <span
        class="my-0 text-primary-500 dark:text-primary-400 font-bold leading-none"
        >{{ item.label }}</span
      >
    </template>
    <template #item="{ item, props }">
      <a
        v-ripple
        class="flex items-center"
        v-bind="props.action">
        <span><Icon :name="item.icon!" /></span>
        <span class="ml-2">{{ item.label }}</span>
        <PVBadge
          v-if="item.badge"
          class="ml-auto"
          :value="item.badge" />
        <span
          v-if="item.shortcut"
          class="ml-auto border border-surface-200 dark:border-surface-700 rounded-md bg-surface-100 dark:bg-surface-700 text-xs p-1"
          >{{ item.shortcut }}</span
        >
      </a>
    </template>
    <template #end>
      <button
        v-ripple
        class="relative overflow-hidden w-full p-link flex items-center p-2 pl-3 text-surface-700 dark:text-surface-0/80 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-none">
        <PVAvatar
          image="https://PVfaces.org/cdn/primevue/images/avatar/amyelsner.png"
          class="mr-2"
          shape="circle" />
        <span class="inline-flex flex-col justify-start">
          <span class="font-bold">David Sawatzky</span>
          <span class="text-sm">Admin</span>
        </span>
      </button>
    </template>
  </PVMenu>
</template>

<style lang="css" scoped></style>
