<script lang="ts" setup>
  const performerStore = usePerformers()
  const classesStore = useClasses()
  const registrationStore = useRegistration()
  const isOpen = ref(false)
  const previousInstrument = ref('')
  const cancelInstChange = ref(false)

  watch(
    () => performerStore.performers[0]?.instrument,
    (newInstrument, oldInstrument) => {
      if (
        !!oldInstrument &&
        cancelInstChange.value === false &&
        !!classesStore.registeredClasses[0]?.discipline
      ) {
        previousInstrument.value = oldInstrument
        setIsOpen(true)
      } else if (cancelInstChange.value === true) {
        cancelInstChange.value = false
        setIsOpen(false)
      }
    },
    {
      flush: 'post',
    }
  )

  async function resetClasses() {
    try {
      setIsOpen(false)
      const regClassIdNumbers = []
      if (classesStore.registeredClasses.length > 0) {
        for (let i = 0; i < classesStore.registeredClasses.length; i++) {
          regClassIdNumbers.push(classesStore.registeredClasses[i]!.id)
        }
        for (let i = 0; i < regClassIdNumbers.length; i++) {
          await classesStore.deleteClass(regClassIdNumbers[i]!)
        }
      }
      await classesStore.createClass(registrationStore.registrationId)
    } catch (err) {
      console.log(err)
    }
  }

  function cancelInstrumentChange() {
    cancelInstChange.value = true
    performerStore.performers[0]!.instrument = previousInstrument.value
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

    <PVDialog
      v-model:visible="isOpen"
      class="p-4 w-full max-w-sm rounded-lg bg-white shadow-lg"
      modal
      :closable="false"
      @hide="cancelInstrumentChange()">
      <template #header>
        <h2 class="text-center text-xl font-bold">Change Instrument</h2>
      </template>
      <div class="text-center">
        Are you sure? This will remove any classes already selected for this
        registration form.
      </div>
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
    </PVDialog>
  </div>
</template>

<style lang="scss" scoped></style>
