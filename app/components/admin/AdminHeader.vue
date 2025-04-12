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
  <PrimeMenubar class="h-[65px] rounded-none justify-end" :model="items" :pt="{ end: 'self-center' }">
    <template #start />
    <template #item="{ item, props, hasSubmenu, root }">
      <a v-ripple class="flex items-center" v-bind="props.action">
        <span><Icon :name="item.icon!" /></span>
        <span class="ml-2">{{ item.label }}</span>
        <PrimeBadge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
        <span v-if="item.shortcut" class="ml-auto border border-surface-200 dark:border-surface-500 rounded-md bg-surface-100 dark:bg-surface-800 text-xs p-1">{{ item.shortcut }}</span>
        <i v-if="hasSubmenu" class="pi pi-angle-down text-primary-500 dark:text-primary-400-500 dark:text-primary-400" :class="[{ 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]" />
      </a>
    </template>
    <template #end>
      <div class="flex items-center gap-2">
        <PrimeAvatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
      </div>
    </template>
  </PrimeMenubar>
</template>

<style lang="css" scoped>

</style>
