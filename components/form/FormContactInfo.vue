<script lang="ts" setup>
  import * as yup from 'yup'
  import 'yup-phone-lite'

  interface Status {
    [key: string]: null | 'saved' | 'saving'
  }

  const props = defineProps<{
    modelValue: object
    teacher?: boolean
    schoolteacher?: boolean
    school?: boolean
    groupperformer?: boolean
    status?: Status
  }>()

  const emits = defineEmits(['update:modelValue'])

  /**
   * Sets the model value from all the props.
   * Allows the 'BaseInput' components to set
   * the model value in props.
   */
  const contact = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

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
          :status="props.status?.prefix"
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
          :status="props.status?.firstName"
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
          :status="props.status?.lastName"
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
          :status="props.status?.lastName"
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
          :status="props.status?.age"
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
          :status="props.status?.apartment"
          name="apartment"
          type="text"
          label="Apt." />
      </div>
      <div
        v-else-if="school && !schoolteacher"
        class="col-span-12 sm:col-span-4 mt-6 sm:mt-0">
        <BaseInput
          v-model.trim="contact.streetNumber"
          :status="props.status?.streetNumber"
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
          :status="props.status?.streetNumber"
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
          :status="props.status?.streetName"
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
          :status="props.status?.streetName"
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
          :status="props.status?.city"
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
          :status="props.status?.province"
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
          :status="props.status?.postalCode"
          required
          name="postalCode"
          type="text"
          label="Postal Code" />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model.trim="contact.phone"
          :status="props.status?.phone"
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
          :status="props.status?.email"
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
          :status="props.status?.instrument"
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
          :status="props.status?.level"
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
          :status="props.status?.otherClasses"
          required
          name="otherClasses"
          :label="textAreaLabel" />
      </div>
    </div>
  </form>
</template>

<style scoped></style>
