<script setup lang="ts">
  const items = ref([
    {
      label: 'Notifications',
      icon: 'iconamoon:notification',
      badge: 3,
    },
    {
      label: 'Settings',
      icon: 'ic:round-settings',
    },
  ])
  const menuRightSide = ref({
    menu: 'sm:flex items-center flex-wrap flex-col sm:flex-row justify-end',
  })
</script>

<template>
  <PVMenubar
    class="h-[65px] rounded-none justify-end"
    :model="items"
    :pt="{ end: 'self-center' }">
    <template #start />
  </PVMenubar>
</template>

<style lang="css" scoped></style>
