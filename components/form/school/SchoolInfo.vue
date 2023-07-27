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

  const validationSchema = toTypedSchema(
    yup.object({
      schoolInfo: yup.object({
        schoolName: yup
          .string()
          .trim()
          .required('Enter the name of the school'),
        schoolDivision: yup
          .string()
          .trim()
          .required('Enter the name of the school divison'),
        streetNumber: yup
          .string()
          .trim()
          .max(5, '5 characters maximum')
          .required('Enter a valid street number'),
        streetName: yup.string().trim().required('Enter a valid street name'),
        city: yup
          .string()
          .trim()
          .max(15, 'Too many characters')
          .required('Enter a city name'),
        province: yup.string().length(2).required(),
        postalCode: yup
          .string()
          .matches(
            /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
            'Enter a valid postal code'
          )
          .required('Enter a valid postal code'),
        phone: yup
          .string()
          .phone('CA', 'Please enter a valid phone number')
          .required('A phone number is required'),
      }),
    })
  )

  useForm({ validationSchema })

  async function fieldStatus(fieldName: string) {
    status[fieldName] = StatusEnum.saving
    await schoolStore.updateSchool(fieldName)
    status[fieldName] = StatusEnum.saved
  }

  const maskaUcaseOption = {
    preProcess: (val) => val.toUpperCase(),
  }
</script>

<template>
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
          label="School Name"
          @change="fieldStatus('name')" />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model="schoolStore.school.division"
          :status="status.division"
          name="schoolDivision"
          label="School Division"
          type="text"
          @change="fieldStatus('division')" />
      </div>
    </div>
    <div class="col-span-12 sm:col-span-4 mt-6 sm:mt-0">
      <BaseInput
        v-model.trim="schoolStore.school.streetNumber"
        :status="status.streetNumber"
        required
        name="streetNumber"
        type="text"
        label="Street #"
        @change="fieldStatus('streetNumber')" />
    </div>
    <div class="col-span-12 sm:col-span-8">
      <BaseInput
        v-model.trim="schoolStore.school.streetName"
        :status="status.streetName"
        requried
        name="streetName"
        type="text"
        label="Street Name"
        @change="fieldStatus('streetName')" />
    </div>
    <div class="col-span-8 sm:col-span-7">
      <BaseInput
        v-model.trim="schoolStore.school.city"
        :status="status.city"
        required
        name="city"
        type="text"
        label="City/Town"
        @change="fieldStatus('city')" />
    </div>
    <div class="col-span-4 sm:col-span-2 self-start">
      <BaseSelect
        v-model.trim="schoolStore.school.province"
        :status="status.province"
        required
        name="province"
        label="Province"
        :options="provinces"
        @change="fieldStatus('province')" />
    </div>
    <div class="col-span-12 sm:col-span-3">
      <BaseInput
        v-model.trim="schoolStore.school.postalCode"
        :status="status.postalCode"
        required
        placeholder="A0A 0A0"
        v-maska:[maskaUcaseOption]
        data-maska="A#A #A#"
        data-maska-tokens="A:[A-Z]"
        data-maska-eager
        name="postalCode"
        type="text"
        label="Postal Code"
        @change="fieldStatus('postalCode')" />
    </div>
    <div class="col-span-12 sm:col-span-5">
      <BaseInput
        v-model.trim="schoolStore.school.phone"
        :status="status.phone"
        required
        placeholder="(###) ###-####"
        v-maska
        data-maska="(###) ###-####"
        data-maska-eager
        name="phone"
        type="tel"
        label="Phone Number"
        @change="fieldStatus('phone')" />
    </div>
  </div>
</template>

<style scoped></style>
