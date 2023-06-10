<script lang="ts" setup>
  import { useTeacher } from '@/stores/userTeacher'

  interface Status {
    [key: string]: null | 'saved' | 'saving'
  }
  const teacherStore = useTeacher()
  const status = reactive<Status>({
    prefix: null,
    firstName: null,
    lastName: null,
    apartment: null,
    streetNumber: null,
    streetName: null,
    city: null,
    province: null,
    postalCode: null,
    email: null,
    phone: null,
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
        status.apartment = 'saving'
        await teacherStore.updateTeacher('apartment')
        status.apartment = 'saved'
      }
      if (newCity !== oldCity) {
        status.city = 'saving'
        await teacherStore.updateTeacher('city')
        status.city = 'saved'
      }
      if (newEmail !== oldEmail) {
        status.email = 'saving'
        await teacherStore.updateTeacher('email')
        status.email = 'saved'
      }
      if (newPrefix !== oldPrefix) {
        status.prefix = 'saving'
        await teacherStore.updateTeacher('prefix')
        status.prefix = 'saved'
      }
      if (newFirstName !== oldFirstName) {
        status.firstName = 'saving'
        await teacherStore.updateTeacher('firstName')
        status.firstName = 'saved'
      }
      if (newLastName !== oldLastName) {
        status.lastName = 'saving'
        await teacherStore.updateTeacher('lastName')
        status.lastName = 'saved'
      }
      if (newPhone !== oldPhone) {
        status.phone = 'saving'
        await teacherStore.updateTeacher('phone')
        status.phone = 'saved'
      }
      if (newPostalCode !== oldPostalCode) {
        status.postalCode = 'saving'
        await teacherStore.updateTeacher('postalCode')
        status.postalCode = 'saved'
      }
      if (newProvince !== oldProvince) {
        status.province = 'saving'
        await teacherStore.updateTeacher('province')
        status.province = 'saved'
      }
      if (newStreetName !== oldStreetName) {
        status.streetName = 'saving'
        await teacherStore.updateTeacher('streetName')
        status.streetName = 'saved'
      }
      if (newStreetNumber !== oldStreetNumber) {
        status.streetNumber = 'saving'
        await teacherStore.updateTeacher('streetNumber')
        status.streetNumber = 'saved'
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
