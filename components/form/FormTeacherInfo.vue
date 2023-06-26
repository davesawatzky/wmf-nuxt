<script lang="ts" setup>
  import * as yup from 'yup'
  import 'yup-phone-lite'
  import { useTeacher } from '@/stores/userTeacher'
  import type { ContactInfo, Status } from '@/composables/types'

  const props = defineProps<{
    modelValue: ContactInfo
    teacher?: boolean
    schoolteacher?: boolean
    school?: boolean
    groupperformer?: boolean
  }>()

  const emits = defineEmits<{
    'update:modelValue': [ContactInfo]
  }>()

  /**
   * Sets the model value from all the props.
   * Allows the 'BaseInput' components to set
   * the model value in props.
   */
  const contact = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

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

  const validationSchema = yup.object({
    firstName: yup.string().trim().required('First name is required'),
    lastName: yup.string().trim().required('Last name is required'),
    age: yup
      .number()
      .positive()
      .integer()
      .max(100)
      .nullable()
      .required('Indicate age'),
    apartment: yup
      .string()
      .notRequired()
      .trim()
      .nullable()
      .max(5, '5 characters maximum'),
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
    province: yup.string().length(2),
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
    email: yup
      .string()
      .email('Must be a valid email address')
      .required('Email address is required'),
  })

  useForm({
    validationSchema,
  })

  const currentYear = new Date().getFullYear()
</script>

<template>
  <form>
    <div class="grid grid-cols-12 gap-x-3 gap-y-1 items-end">
      <div
        v-if="teacher"
        class="col-span-12 sm:col-span-2 self-start">
        <BaseSelect
          v-model.trim="contact.prefix"
          :status="status.prefix"
          required
          name="prefix"
          label="Title"
          :options="prefixes" />
      </div>
      <div
        v-if="!school"
        class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model.trim="contact.firstName"
          :status="status.firstName"
          required
          name="firstName"
          type="text"
          label="First Name" />
      </div>
      <div
        v-if="!school && !schoolteacher && !teacher"
        class="col-span-12 sm:col-span-4">
        <BaseInput
          v-model.trim="contact.lastName"
          :status="status.lastName"
          required
          name="lastName"
          type="text"
          label="Last Name" />
      </div>
      <div
        v-else-if="!school"
        class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model.trim="contact.lastName"
          :status="status.lastName"
          required
          name="lastName"
          type="text"
          label="Last Name" />
      </div>
      <div
        v-if="!teacher && !school && !schoolteacher"
        class="col-span-12 sm:col-span-3">
        <BaseInput
          v-model.number="contact.age"
          :status="status.age"
          required
          name="age"
          type="number"
          label="Age"
          :help-message="`Age as of December 31, ${currentYear}`" />
      </div>
      <!-- <div v-else class="col-span-12 sm:col-span-3"></div> -->

      <div
        v-if="!schoolteacher && !school"
        class="col-span-6 sm:col-span-3">
        <BaseInput
          v-model.trim="contact.apartment"
          :status="status.apartment"
          name="apartment"
          type="text"
          label="Apt." />
      </div>
      <div
        v-else-if="school && !schoolteacher"
        class="col-span-12 sm:col-span-4 mt-6 sm:mt-0">
        <BaseInput
          v-model.trim="contact.streetNumber"
          :status="status.streetNumber"
          required
          name="streetNumber"
          type="text"
          label="Street #" />
      </div>
      <div
        v-if="!schoolteacher && !school"
        class="col-span-6 sm:col-span-3">
        <BaseInput
          v-model.trim="contact.streetNumber"
          :status="status.streetNumber"
          required
          name="streetNumber"
          type="text"
          label="Street #" />
      </div>

      <div
        v-if="school && !schoolteacher"
        class="col-span-12 sm:col-span-8">
        <BaseInput
          v-model.trim="contact.streetName"
          :status="status.streetName"
          requried
          name="streetName"
          type="text"
          label="Street Name" />
      </div>
      <div
        v-if="!school && !schoolteacher"
        class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model.trim="contact.streetName"
          :status="status.streetName"
          required
          name="streetName"
          type="text"
          label="Street Name" />
      </div>
      <div
        v-if="!schoolteacher"
        class="col-span-8 sm:col-span-7">
        <BaseInput
          v-model.trim="contact.city"
          :status="status.city"
          required
          name="city"
          type="text"
          label="City/Town" />
      </div>
      <div
        v-if="!schoolteacher"
        class="col-span-4 sm:col-span-2 self-start">
        <BaseSelect
          v-model.trim="contact.province"
          :status="status.province"
          required
          name="province"
          label="Province"
          :options="provinces" />
      </div>
      <div
        v-if="!schoolteacher"
        class="col-span-12 sm:col-span-3">
        <BaseInput
          v-model.trim="contact.postalCode"
          :status="status.postalCode"
          required
          name="postalCode"
          type="text"
          label="Postal Code" />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model.trim="contact.phone"
          :status="status.phone"
          required
          name="phone"
          type="tel"
          label="Phone Number" />
      </div>
      <div
        v-if="!school"
        class="col-span-12 sm:col-span-7">
        <BaseInput
          v-model.trim="contact.email"
          :status="status.email"
          required
          name="email"
          type="email"
          label="Email" />
      </div>
      <div
        v-if="groupperformer"
        class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model.trim="contact.instrument"
          :status="status.instrument"
          required
          name="instrument"
          type="text"
          label="Instrument" />
      </div>
      <div
        v-if="groupperformer"
        class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model.trim="contact.level"
          :status="status.level"
          required
          name="level"
          type="text"
          label="Level" />
      </div>
      <div
        v-if="groupperformer"
        class="col-span-12">
        <BaseTextarea
          v-model.trim="contact.otherClasses"
          :status="status.otherClasses"
          required
          name="otherClasses"
          :label="textAreaLabel" />
      </div>
    </div>
  </form>
</template>

<style scoped></style>
