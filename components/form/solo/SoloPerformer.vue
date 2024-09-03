<script lang="ts" setup>
  const performerStore = usePerformers()
  const classesStore = useClasses()
  const registrationStore = useRegistration()
  const isOpen = ref(false)
  const previousInstrument = ref('')
  const cancelInstChange = ref(false)
  const changeInstrument = ref(false)

  watch(
    () => performerStore.performers[0].instrument,
    (newInstrument, oldInstrument) => {
      if (
        !!oldInstrument &&
        cancelInstChange.value === false &&
        !!classesStore.registeredClasses[0].discipline
      ) {
        previousInstrument.value = oldInstrument
        setIsOpen(true)
      } else if (cancelInstChange.value === true) {
        cancelInstChange.value = false
        setIsOpen(false)
      }
    },
    { flush: 'post' }
  )

  async function resetClasses() {
    try {
      setIsOpen(false)
      const regClassIdNumbers = <number[]>[]
      for (let i = 0; i < classesStore.registeredClasses.length; i++) {
        regClassIdNumbers.push(classesStore.registeredClasses[i].id)
      }
      for (let i = 0; i < regClassIdNumbers.length; i++) {
        await classesStore.deleteClass(regClassIdNumbers[i])
      }
      await classesStore.createClass(registrationStore.registrationId)
    } catch (err) {
      console.log(err)
    }
  }

  function cancelInstrumentChange() {
    cancelInstChange.value = true
    performerStore.performers[0].instrument = previousInstrument.value
  }

  function setIsOpen(value: boolean) {
    isOpen.value = value
  }
</script>

<template>
  <div>
    <div
      v-auto-animate
      class="pt-8">
      <h2 class="pb-4">Performer Information</h2>
      <div v-if="performerStore.performers[0]">
        <FormPerformerInfo
          v-model="performerStore.performers[0]"
          :performer-index="0"
          :performer-id="performerStore.performers[0].id" />
      </div>
    </div>
    <UITransitionRoot
      :show="isOpen"
      enter="duration-1000 ease-out"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="duration-1000 ease-in"
      leave-from="opacity-100"
      leave-to="opacity-0">
      <UIDialog
        @close="cancelInstrumentChange()"
        class="relative z-50">
        <UITransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div
            class="fixed inset-0 bg-black/30"
            aria-hidden="true"></div>
        </UITransitionChild>
        <div
          class="fixed inset-0 flex w-screen items-center justify-center p-4">
          <UITransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <UIDialogPanel
              class="p-4 w-full max-w-sm rounded-lg bg-white shadow-lg">
              <UIDialogTitle class="text-center text-xl font-bold"
                >Change Instrument</UIDialogTitle
              >
              <UIDialogDescription class="text-center">
                Are you sure? This will remove any classes already selected for
                this registration form.
              </UIDialogDescription>
              <div>
                <BaseButton
                  class="btn btn-blue"
                  @click="resetClasses()">
                  Change Instrument
                </BaseButton>
                <BaseButton
                  class="btn btn-blue"
                  @click="cancelInstrumentChange()">
                  Cancel
                </BaseButton>
              </div>
            </UIDialogPanel>
          </UITransitionChild>
        </div>
      </UIDialog>
    </UITransitionRoot>
  </div>
</template>

<style lang="scss" scoped></style>
