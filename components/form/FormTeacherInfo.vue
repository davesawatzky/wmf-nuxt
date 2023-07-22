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

  const validationSchema = yup.object({
    firstName: yup.string().trim().required('First name is required'),
    lastName: yup.string().trim().required('Last name is required'),
    age: yup.number().positive().integer().max(100).required('Indicate age'),
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

  async function fieldStatus(fieldName: string) {
    status[fieldName] = StatusEnum.saving
    await teacherStore.updateTeacher(fieldName)
    status[fieldName] = StatusEnum.saved
  }

  const maskaUcaseOption = {
    preProcess: (val) => val.toUpperCase(),
  }
</script>

<template>
  <div class="grid grid-cols-12 gap-x-3 gap-y-1 items-end">
    <div class="col-span-12 sm:col-span-2 self-start">
      <BaseSelect
        v-model.trim="contact.prefix"
        :status="status.prefix"
        required
        name="prefix"
        label="Title"
        :options="prefixes"
        @change="fieldStatus('prefix')" />
    </div>
    <div class="col-span-12 sm:col-span-5">
      <BaseInput
        v-model.trim="contact.firstName"
        :status="status.firstName"
        required
        name="firstName"
        type="text"
        label="First Name"
        @change="fieldStatus('firstName')" />
    </div>
    <div class="col-span-12 sm:col-span-5">
      <BaseInput
        v-model.trim="contact.lastName"
        :status="status.lastName"
        required
        name="lastName"
        type="text"
        label="Last Name"
        @change="fieldStatus('lastName')" />
    </div>

    <!-- <div v-else class="col-span-12 sm:col-span-3"></div> -->

    <div
      v-if="!schoolteacher"
      class="col-span-6 sm:col-span-3">
      <BaseInput
        v-model.trim="contact.apartment"
        :status="status.apartment"
        name="apartment"
        type="text"
        label="Apt."
        @change="fieldStatus('apartment')" />
    </div>
    <div
      v-if="!schoolteacher"
      class="col-span-6 sm:col-span-3">
      <BaseInput
        v-model.trim="contact.streetNumber"
        :status="status.streetNumber"
        required
        name="streetNumber"
        type="text"
        label="Street #"
        @change="fieldStatus('streetNumber')" />
    </div>
    <div
      v-if="!schoolteacher"
      class="col-span-12 sm:col-span-6">
      <BaseInput
        v-model.trim="contact.streetName"
        :status="status.streetName"
        required
        name="streetName"
        type="text"
        label="Street Name"
        @change="fieldStatus('streetName')" />
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
        label="City/Town"
        @change="fieldStatus('city')" />
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
        :options="provinces"
        @change="fieldStatus('province')" />
    </div>
    <div
      v-if="!schoolteacher"
      class="col-span-12 sm:col-span-3">
      <BaseInput
        v-model.trim="contact.postalCode"
        :status="status.postalCode"
        required
        v-maska:[maskaUcaseOption]
        data-maska="A#A #A#"
        data-maska-token="A:[A-Z]"
        name="postalCode"
        type="text"
        label="Postal Code"
        @change="fieldStatus('postalCode')" />
    </div>
    <div class="col-span-12 sm:col-span-5">
      <BaseInput
        v-model.trim="contact.phone"
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
    <div class="col-span-12 sm:col-span-7">
      <BaseInput
        v-model.trim="contact.email"
        :status="status.email"
        placeholder="example@email.com"
        required
        name="email"
        type="email"
        label="Email"
        @change="fieldStatus('email')" />
    </div>
  </div>
</template>

<style scoped></style>
