<script lang="ts" setup>
  import * as yup from 'yup'
  import 'yup-phone-lite'
  import { useSchool } from '@/stores/userSchool'
  import type { Status } from '@/composables/types'

  const schoolStore = useSchool()

  const status = reactive<Status>({
    name: StatusEnum.null,
    division: StatusEnum.null,
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
      schoolStore.school.name,
      schoolStore.school.division,
      schoolStore.school.city,
      schoolStore.school.phone,
      schoolStore.school.postalCode,
      schoolStore.school.province,
      schoolStore.school.streetName,
      schoolStore.school.streetNumber,
    ],
    async (
      [
        newName,
        newDivision,
        newCity,
        newPhone,
        newPostalCode,
        newProvince,
        newStreetName,
        newStreetNumber,
      ],
      [
        oldName,
        oldDivision,
        oldCity,
        oldPhone,
        oldPostalCode,
        oldProvince,
        oldStreetName,
        oldStreetNumber,
      ]
    ) => {
      if (newName !== oldName) {
        status.name = StatusEnum.saving
        await schoolStore.updateSchool('name')
        status.name = StatusEnum.saved
      }
      if (newDivision !== oldDivision) {
        status.division = StatusEnum.saving
        await schoolStore.updateSchool('division')
        status.division = StatusEnum.saved
      }
      if (newCity !== oldCity) {
        status.city = StatusEnum.saving
        await schoolStore.updateSchool('city')
        status.city = StatusEnum.saved
      }
      if (newPhone !== oldPhone) {
        status.phone = StatusEnum.saving
        await schoolStore.updateSchool('phone')
        status.phone = StatusEnum.saved
      }
      if (newPostalCode !== oldPostalCode) {
        status.postalCode = StatusEnum.saving
        await schoolStore.updateSchool('postalCode')
        status.postalCode = StatusEnum.saved
      }
      if (newProvince !== oldProvince) {
        status.province = StatusEnum.saving
        await schoolStore.updateSchool('province')
        status.province = StatusEnum.saved
      }
      if (newStreetName !== oldStreetName) {
        status.streetName = StatusEnum.saving
        await schoolStore.updateSchool('streetName')
        status.streetName = StatusEnum.saved
      }
      if (newStreetNumber !== oldStreetNumber) {
        status.streetNumber = StatusEnum.saving
        await schoolStore.updateSchool('streetNumber')
        status.streetNumber = StatusEnum.saved
      }
    }
  )

  const validationSchema = yup.object({
    schoolName: yup
      .string()
      .trim()
      .nullable()
      .required('Enter the name of the school'),
    schoolDivision: yup
      .string()
      .trim()
      .nullable()
      .required('Enter the name of the school divison'),
  })

  useForm({ validationSchema })
</script>

<template>
  <form>
    <div
      v-auto-animate
      class="pt-8">
      <h2 class="pb-4">School Information</h2>
      <div class="grid grid-cols-12 gap-x-3 gap-y-2">
        <div class="col-span-12 sm:col-span-6">
          <BaseInput
            v-model="schoolStore.school.name"
            :status="status.name"
            name="schoolName"
            type="text"
            label="School Name" />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <BaseInput
            v-model="schoolStore.school.division"
            :status="status.division"
            name="schoolDivision"
            label="School Division"
            type="text" />
        </div>
      </div>
      <div class="col-span-12 sm:col-span-4 mt-6 sm:mt-0">
        <BaseInput
          v-model.trim="schoolStore.school.streetNumber"
          :status="status.streetNumber"
          required
          name="streetNumber"
          type="text"
          label="Street #" />
      </div>
      <div class="col-span-12 sm:col-span-8">
        <BaseInput
          v-model.trim="schoolStore.school.streetName"
          :status="status.streetName"
          requried
          name="streetName"
          type="text"
          label="Street Name" />
      </div>
      <div class="col-span-8 sm:col-span-7">
        <BaseInput
          v-model.trim="schoolStore.school.city"
          :status="status.city"
          required
          name="city"
          type="text"
          label="City/Town" />
      </div>
      <div class="col-span-4 sm:col-span-2 self-start">
        <BaseSelect
          v-model.trim="schoolStore.school.province"
          :status="status.province"
          required
          name="province"
          label="Province"
          :options="provinces" />
      </div>
      <div class="col-span-12 sm:col-span-3">
        <BaseInput
          v-model.trim="schoolStore.school.postalCode"
          :status="status.postalCode"
          required
          name="postalCode"
          type="text"
          label="Postal Code" />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model.trim="schoolStore.school.phone"
          :status="status.phone"
          required
          name="phone"
          type="tel"
          label="Phone Number" />
      </div>
    </div>
  </form>
</template>

<style scoped></style>
