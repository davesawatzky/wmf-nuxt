<script setup lang="ts">
  defineProps({
    tabs: {
      type: Array,
      required: true,
    },
  })
  const emit = defineEmits(['newComponent'])
  const activeTab = ref(0)
  function newTab(index: number) {
    activeTab.value = index
    emit('newComponent', index)
  }
</script>

<template>
  <div>
    <ul>
      <li
        v-for="(tab, index) in tabs"
        :key="index"
        @click="newTab(index + 1)">
        {{ tab }} - {{ index + 1 }}
      </li>
    </ul>
    {{ activeTab }}
  </div>
</template>

<style scoped>
  ul {
    display: flex;
  }

  li {
    min-width: 100px;
    border: 1px solid #c1c1c1;
    padding: 4px 10px;
    box-sizing: border-box;
    background-color: aqua;
  }
</style>
