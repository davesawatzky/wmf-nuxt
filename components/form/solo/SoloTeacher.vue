<script lang="ts" setup>
  import { useTeacher } from '@/stores/userTeacher'
  import { StatusEnum } from '@/composables/types'
  import type { Status } from '@/composables/types'

  const teacherStore = useTeacher()

  const status = reactive<Status>({
    prefix: StatusEnum.null,
    firstName: StatusEnum.null,
    lastName: StatusEnum.null,
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
      teacherStore.teacher.apartment,
      teacherStore.teacher.city,
      teacherStore.teacher.email,
      teacherStore.teacher.prefix,
      teacherStore.teacher.firstName,
      teacherStore.teacher.lastName,
      teacherStore.teacher.phone,
      teacherStore.teacher.postalCode,
      teacherStore.teacher.province,
      teacherStore.teacher.streetName,
      teacherStore.teacher.streetNumber,
    ],
    async (
      [
        newApartment,
        newCity,
        newEmail,
        newPrefix,
        newFirstName,
        newLastName,
        newPhone,
        newPostalCode,
        newProvince,
        newStreetName,
        newStreetNumber,
      ],
      [
        oldApartment,
        oldCity,
        oldEmail,
        oldPrefix,
        oldFirstName,
        oldLastName,
        oldPhone,
        oldPostalCode,
        oldProvince,
        oldStreetName,
        oldStreetNumber,
      ]
    ) => {
      if (newApartment !== oldApartment) {
        status.apartment = StatusEnum.saving
        await teacherStore.updateTeacher('apartment')
        status.apartment = StatusEnum.saved
      }
      if (newCity !== oldCity) {
        status.city = StatusEnum.saving
        await teacherStore.updateTeacher('city')
        status.city = StatusEnum.saved
      }
      if (newEmail !== oldEmail) {
        status.email = StatusEnum.saving
        await teacherStore.updateTeacher('email')
        status.email = StatusEnum.saved
      }
      if (newPrefix !== oldPrefix) {
        status.prefix = StatusEnum.saving
        await teacherStore.updateTeacher('prefix')
        status.prefix = StatusEnum.saved
      }
      if (newFirstName !== oldFirstName) {
        status.firstName = StatusEnum.saving
        await teacherStore.updateTeacher('firstName')
        status.firstName = StatusEnum.saved
      }
      if (newLastName !== oldLastName) {
        status.lastName = StatusEnum.saving
        await teacherStore.updateTeacher('lastName')
        status.lastName = StatusEnum.saved
      }
      if (newPhone !== oldPhone) {
        status.phone = StatusEnum.saving
        await teacherStore.updateTeacher('phone')
        status.phone = StatusEnum.saved
      }
      if (newPostalCode !== oldPostalCode) {
        status.postalCode = StatusEnum.saving
        await teacherStore.updateTeacher('postalCode')
        status.postalCode = StatusEnum.saved
      }
      if (newProvince !== oldProvince) {
        status.province = StatusEnum.saving
        await teacherStore.updateTeacher('province')
        status.province = StatusEnum.saved
      }
      if (newStreetName !== oldStreetName) {
        status.streetName = StatusEnum.saving
        await teacherStore.updateTeacher('streetName')
        status.streetName = StatusEnum.saved
      }
      if (newStreetNumber !== oldStreetNumber) {
        status.streetNumber = StatusEnum.saving
        await teacherStore.updateTeacher('streetNumber')
        status.streetNumber = StatusEnum.saved
      }
    }
  )
</script>

<template>
  <form>
    <div class="pt-8">
      <h2 class="pb-4">Teacher Information</h2>
      <div>
        <FormContactInfo
          v-model="teacherStore.teacher"
          teacher
          :status="status" />
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
