<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
// `to` drives navigation on the nuxt-link; everything else forwards to the button.
const buttonAttrs = computed(() => {
  const { to: _to, ...rest } = attrs
  return rest
})
</script>

<template>
  <nuxt-link
    v-slot="{ navigate }"
    :to="attrs.to as string"
    custom
  >
    <button
      v-bind="buttonAttrs"
      type="button"
      @click="navigate"
    >
      <slot />
    </button>
  </nuxt-link>
</template>

<style scoped></style>
