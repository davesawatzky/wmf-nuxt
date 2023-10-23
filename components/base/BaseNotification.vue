<script setup lang="ts">
  const props = defineProps<{
    title?: string
    message?: string
    type?: 'info' | 'error' | 'warning'
  }>()

  const messageClass = ref('')
  const iconName = ref('')
  const showToast = ref(false)

  watch(
    () => props.message,
    (newValue) => {
      if (!!newValue) {
        console.log(newValue)
        showToast.value = true
        setTimeout(() => (showToast.value = false), 4000)
      } else {
        showToast.value = false
      }
    }
  )

  onMounted(() => {
    messageType()
  })

  function messageType() {
    switch (props.type) {
      case 'error':
        iconName.value = 'fluent:info-24-filled'
        messageClass.value = 'text-red-200 border-red-200 bg-red-600'
        break
      case 'info':
        iconName.value = 'fluent:info-24-filled'
        messageClass.value = 'text-green-200 border-green-300 bg-green-600'
        break
      case 'warning':
        iconName.value = 'fluent:warning-28-filled'
        messageClass.value = 'text-amber-100 border-amber-100 bg-amber-600'
        break
    }
  }
</script>

<template>
  <Teleport to="#notifications">
    <Transition>
      <div
        v-show="showToast"
        class="flex space-x-2 w-[400px] z-15 fixed mx-auto inset-x-0 bottom-2 p-2 border-2 rounded-lg"
        :class="messageClass">
        <Icon
          class="flex-none self-center justify-center w-[50px] text-6xl"
          :name="iconName" />
        <div class="flex-1 self-center">
          <div class="text-lg font-bold">{{ title }}</div>
          <div>{{ message }}</div>
        </div>
        <Icon
          class="flex-none m-1 text-2xl self-start cursor-pointer"
          name="ic:round-close"
          @click="showToast = false" />
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
  .v-enter-active {
    transition: all 0.6s ease-in-out;
  }
  .v-leave-active {
    transition: all 0.6s ease-in-out;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
    transform: translateY(50px);
  }

  .v-enter-to,
  .v-leave-from {
    opacity: 1;
    transform: translateY(0px);
  }
</style>
