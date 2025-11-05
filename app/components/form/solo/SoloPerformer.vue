<script lang="ts" setup>
  import { useToast } from 'vue-toastification'

  const performerStore = usePerformers()
  const classesStore = useClasses()
  const registrationStore = useRegistration()
  const changeInstrumentIsOpen = ref(false)
  const attentionDialogIsOpen = ref(false)
  const previousInstrument = ref('')
  const cancelInstChange = ref(false)
  const toast = useToast()

  onMounted(() => {
    attentionDialogIsOpen.value = true
  })

  watch(
    () => performerStore.performers[0]?.instrument,
    (newInstrument, oldInstrument) => {
      if (
        !!oldInstrument &&
        cancelInstChange.value === false &&
        !!classesStore.registeredClasses[0]?.discipline
      ) {
        previousInstrument.value = oldInstrument
        setChangeInstrumentIsOpen(true)
      } else if (cancelInstChange.value === true) {
        cancelInstChange.value = false
        setChangeInstrumentIsOpen(false)
      }
    },
    {
      flush: 'post',
    }
  )

  async function resetClasses() {
    try {
      setChangeInstrumentIsOpen(false)
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
    } catch (error) {
      console.error('Error changing instrument and resetting classes:', error)
      toast.error('Could not change instrument. Please try again.')
    }
  }

  function cancelInstrumentChange() {
    cancelInstChange.value = true
    performerStore.performers[0]!.instrument = previousInstrument.value
  }

  function setChangeInstrumentIsOpen(value: boolean) {
    changeInstrumentIsOpen.value = value
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
      v-model:visible="changeInstrumentIsOpen"
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
    <PVDialog
      v-model:visible="attentionDialogIsOpen"
      class="p-4 w-full max-w-sm rounded-lg bg-white shadow-lg"
      :closable="false"
      modal>
      <h2 class="text-center text-xl font-bold">Attention!</h2>
      <p class="text-center">
        Please make sure all entry details are COMPLETE and CORRECT, as forms,
        once submitted, are <strong>final</strong> and
        <strong>cannot be edited.</strong>
      </p>
      <h2 class="text-center text-xl font-bold">Singers!</h2>
      <p class="text-center">
        VOCAL and MUSICAL THEATRE are listed as
        <strong>separate disciplines</strong>. Be sure to select the appropriate
        discipline for your selections in the Performer tab.
      </p>
      <div class="text-center mt-4">
        <BaseButton
          class="btn btn-blue"
          @click="attentionDialogIsOpen = false">
          I Understand
        </BaseButton>
      </div>
    </PVDialog>
  </div>
</template>

<style lang="scss" scoped></style>
