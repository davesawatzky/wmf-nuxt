<script lang="ts" setup>
  import { usePerformers } from '@/stores/userPerformer'

  interface Status {
    [key: string]: null | 'saved' | 'saving'
  }

  const performerStore = usePerformers()
  const performerId = ref(performerStore.performers[0].id)
  const status = reactive<Status>({
    firstName: null,
    lastName: null,
    age: null,
    level: null,
    instrument: null,
    otherClasses: null,
    apartment: null,
    streetNumber: null,
    streetName: null,
    city: null,
    province: null,
    postalCode: null,
    email: null,
    phone: null,
  })

  // performerStore.$subscribe((mutation, state) => {
  //   console.log('Mutation-----: ', mutation)
  //   console.log('State-----: ', state.performers[0])
  // })

  watch(
    () => [
      performerStore.performers[0].age,
      performerStore.performers[0].apartment,
      performerStore.performers[0].city,
      performerStore.performers[0].email,
      performerStore.performers[0].firstName,
      performerStore.performers[0].lastName,
      performerStore.performers[0].instrument,
      performerStore.performers[0].level,
      performerStore.performers[0].otherClasses,
      performerStore.performers[0].phone,
      performerStore.performers[0].postalCode,
      performerStore.performers[0].province,
      performerStore.performers[0].streetName,
      performerStore.performers[0].streetNumber,
    ],
    async (
      [
        newAge,
        newApartment,
        newCity,
        newEmail,
        newFirstName,
        newLastName,
        newInstrument,
        newLevel,
        newOtherClasses,
        newPhone,
        newPostalCode,
        newProvince,
        newStreetName,
        newStreetNumber,
      ],
      [
        oldAge,
        oldApartment,
        oldCity,
        oldEmail,
        oldFirstName,
        oldLastName,
        oldInstrument,
        oldLevel,
        oldOtherClasses,
        oldPhone,
        oldPostalCode,
        oldProvince,
        oldStreetName,
        oldStreetNumber,
      ]
    ) => {
      if (newAge !== oldAge) {
        status.age = 'saving'
        await performerStore.updatePerformer(performerId.value, 'age')
        status.age = 'saved'
      }
      if (newApartment !== oldApartment) {
        status.apartment = 'saving'
        await performerStore.updatePerformer(performerId.value, 'apartment')
        status.apartment = 'saved'
      }
      if (newCity !== oldCity) {
        status.city = 'saving'
        await performerStore.updatePerformer(performerId.value, 'city')
        status.city = 'saved'
      }
      if (newEmail !== oldEmail) {
        status.email = 'saving'
        await performerStore.updatePerformer(performerId.value, 'email')
        status.email = 'saved'
      }
      if (newFirstName !== oldFirstName) {
        status.firstName = 'saving'
        await performerStore.updatePerformer(performerId.value, 'firstName')
        status.firstName = 'saved'
      }
      if (newLastName !== oldLastName) {
        status.lastName = 'saving'
        await performerStore.updatePerformer(performerId.value, 'lastName')
        status.lastName = 'saved'
      }
      if (newInstrument !== oldInstrument) {
        status.instrument = 'saving'
        await performerStore.updatePerformer(performerId.value, 'instrument')
        status.instrument = 'saved'
      }
      if (newLevel !== oldLevel) {
        status.level = 'saving'
        await performerStore.updatePerformer(performerId.value, 'level')
        status.level = 'saved'
      }
      if (newOtherClasses !== oldOtherClasses) {
        status.otherClasses = 'saving'
        await performerStore.updatePerformer(performerId.value, 'otherClasses')
        status.otherClasses = 'saved'
      }
      if (newPhone !== oldPhone) {
        status.phone = 'saving'
        await performerStore.updatePerformer(performerId.value, 'phone')
        status.phone = 'saved'
      }
      if (newPostalCode !== oldPostalCode) {
        status.postalCode = 'saving'
        await performerStore.updatePerformer(performerId.value, 'postalCode')
        status.postalCode = 'saved'
      }
      if (newProvince !== oldProvince) {
        status.province = 'saving'
        await performerStore.updatePerformer(performerId.value, 'province')
        status.province = 'saved'
      }
      if (newStreetName !== oldStreetName) {
        status.streetName = 'saving'
        await performerStore.updatePerformer(performerId.value, 'streetName')
        status.streetName = 'saved'
      }
      if (newStreetNumber !== oldStreetNumber) {
        status.streetNumber = 'saving'
        await performerStore.updatePerformer(performerId.value, 'streetNumber')
        status.streetNumber = 'saved'
      }
    }
  )
</script>

<template>
  <form>
    <div class="pt-8">
      <h2 class="pb-4">Performer Information</h2>
      <div v-if="performerStore.performers[0]">
        <FormContactInfo
          v-model="performerStore.performers[0]"
          :status="status" />
      </div>
      <div class="pt-4">
        <BaseTextarea :label="textAreaLabel" />
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
