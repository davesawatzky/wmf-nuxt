<template>
  <div class="min-h-screen bg-surface-ground">
    <nav class="bg-surface-card border-b border-surface-border md:px-12 px-6">
      <div class="h-16 flex items-center justify-between">
        <h1 class="text-xl font-bold text-black">docgen</h1>
        <div class="flex items-center gap-4">
          <button
            variant="secondary"
            :icon="isDark ? 'sun' : 'moon'"
            @click="toggleTheme"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'" />
        </div>
      </div>
    </nav>
    <main class="py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
  }

  // Initialize theme based on system preference
  onMounted(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark.value = true
      document.documentElement.dataset.theme = 'dark'
    }
  })
</script>

<style></style>
