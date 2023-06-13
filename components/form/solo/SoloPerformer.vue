<script lang="ts" setup>
  import { usePerformers } from '@/stores/userPerformer'
  import type { Status } from '@/composables/types'

  const performerStore = usePerformers()
  const performerId = ref(performerStore.performers[0].id)
  const status = reactive<Status>({
    firstName: StatusEnum.null,
    lastName: StatusEnum.null,
    age: StatusEnum.null,
    level: StatusEnum.null,
    instrument: StatusEnum.null,
    otherClasses: StatusEnum.null,
    apartment: StatusEnum.null,
    streetNumber: StatusEnum.null,
    streetName: StatusEnum.null,
    city: StatusEnum.null,
    province: StatusEnum.null,
    postalCode: StatusEnum.null,
    email: StatusEnum.null,
    phone: StatusEnum.null,
  })

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
        status.age = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'age')
        status.age = StatusEnum.saved
      }
      if (newApartment !== oldApartment) {
        status.apartment = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'apartment')
        status.apartment = StatusEnum.saved
      }
      if (newCity !== oldCity) {
        status.city = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'city')
        status.city = StatusEnum.saved
      }
      if (newEmail !== oldEmail) {
        status.email = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'email')
        status.email = StatusEnum.saved
      }
      if (newFirstName !== oldFirstName) {
        status.firstName = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'firstName')
        status.firstName = StatusEnum.saved
      }
      if (newLastName !== oldLastName) {
        status.lastName = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'lastName')
        status.lastName = StatusEnum.saved
      }
      if (newInstrument !== oldInstrument) {
        status.instrument = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'instrument')
        status.instrument = StatusEnum.saved
      }
      if (newLevel !== oldLevel) {
        status.level = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'level')
        status.level = StatusEnum.saved
      }
      if (newOtherClasses !== oldOtherClasses) {
        status.otherClasses = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'otherClasses')
        status.otherClasses = StatusEnum.saved
      }
      if (newPhone !== oldPhone) {
        status.phone = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'phone')
        status.phone = StatusEnum.saved
      }
      if (newPostalCode !== oldPostalCode) {
        status.postalCode = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'postalCode')
        status.postalCode = StatusEnum.saved
      }
      if (newProvince !== oldProvince) {
        status.province = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'province')
        status.province = StatusEnum.saved
      }
      if (newStreetName !== oldStreetName) {
        status.streetName = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'streetName')
        status.streetName = StatusEnum.saved
      }
      if (newStreetNumber !== oldStreetNumber) {
        status.streetNumber = StatusEnum.saving
        await performerStore.updatePerformer(performerId.value, 'streetNumber')
        status.streetNumber = StatusEnum.saved
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
