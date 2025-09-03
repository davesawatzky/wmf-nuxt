<script setup lang="ts">
  const items = ref([
    {
      label: '',
      items: [
        {
          label: 'Dashboard',
          icon: 'ic:round-dashboard',
          command: () => navigateTo('/admin'),
        },
      ],
    },
    {
      label: 'Registrations',
      items: [
        {
          label: 'Registrations',
          icon: 'ic:round-class',
          command: () => navigateTo('/admin/registrations'),
        },
        {
          label: 'Classes',
          icon: 'emojione-monotone:performing-arts',
          command: () => navigateTo('/admin/registrations/Classes'),
        },
        {
          label: 'Participants',
          icon: 'material-symbols:artist-outline-rounded',
          command: () => navigateTo('/admin/registrations/Participants'),
        },
        {
          label: 'Teachers',
          icon: 'ph:chalkboard-teacher',
          command: () => navigateTo('/admin/registrations/Teachers'),
        },
      ],
    },
    {
      label: 'Program',
      items: [
        {
          label: 'Venues',
          icon: 'ri:building-2-fill',
          command: () => navigateTo('/admin/program/venues'),
        },
        {
          label: 'Schedule',
          icon: 'uil:schedule',
          command: () => navigateTo('/admin/program/schedule'),
        },
      ],
    },
    {
      label: 'Reports',
      items: [
        {
          label: 'Schedule',
          icon: 'mdi:file-report',
          command: () => navigateTo('/admin/reports/schedule'),
        },
        {
          label: 'Participants',
          icon: 'mdi:file-report',
          command: () => navigateTo('/admin/reports/participants'),
        },
        {
          label: 'Teachers',
          icon: 'mdi:file-report',
          command: () => navigateTo('/admin/reports/teachers'),
        },
        {
          label: 'Classes',
          icon: 'mdi:file-report',
          command: () => navigateTo('/admin/reports/classes'),
        },
      ],
    },

    {
      label: 'Administration',
      items: [
        {
          label: 'Classes',
          icon: 'ic:round-class',
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
        {
          label: 'User Admin',
          icon: 'mdi:user',
          command: () => navigateTo('/admin/users'),
        },
      ],
    },
  ])
</script>

<template>
  <div>
    <PVMenu
      :model="items"
      :pt="{
        submenuLabel: 'mt-6 pb-1 text-primary-100',
        itemContent:
          'px-2 bg-primary-900 text-primary-200 hover:bg-primary-700 hover:rounded-md hover:text-primary-100',
      }"
      class="w-[250px] h-full rounded-none border-none bg-transparent">
      <template #submenuheader="{ item }">
        {{ item.label }}
      </template>
      <template #item="{ item, props }">
        <a
          v-ripple
          class="p-0 px-2 pb-1"
          v-bind="props.action">
          <span>
            <Icon
              v-if="item.icon"
              class="align-middle"
              :name="item.icon" />
          </span>
          <span class="ml-2">{{ item.label }}</span>
          <PVBadge
            v-if="item.badge"
            class="ml-auto"
            :value="item.badge" />
          <span
            v-if="item.shortcut"
            class="text-xs"
            >{{ item.shortcut }}</span
          >
        </a>
      </template>
      <template #end>
        <div class="ml-6 mt-10 text-primary-200">
          <div class="font-bold">David Sawatzky</div>
          <div class="text-sm">Admin</div>
        </div>
      </template>
    </PVMenu>
  </div>
</template>

<style lang="css" scoped></style>
