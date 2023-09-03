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
    teacherId: number
  }>()

  const emits = defineEmits<{
    'update:modelValue': [value: ContactInfo]
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
    prefix: props.modelValue.prefix ? StatusEnum.saved : StatusEnum.null,
    firstName: props.modelValue.firstName ? StatusEnum.saved : StatusEnum.null,
    lastName: props.modelValue.lastName ? StatusEnum.saved : StatusEnum.null,
    apartment: props.modelValue.apartment ? StatusEnum.saved : StatusEnum.null,
    streetNumber: props.modelValue.streetNumber
      ? StatusEnum.saved
      : StatusEnum.null,
    streetName: props.modelValue.streetName
      ? StatusEnum.saved
      : StatusEnum.null,
    city: props.modelValue.city ? StatusEnum.saved : StatusEnum.null,
    province: props.modelValue.province ? StatusEnum.saved : StatusEnum.null,
    postalCode: props.modelValue.postalCode
      ? StatusEnum.saved
      : StatusEnum.null,
    email: props.modelValue.email ? StatusEnum.saved : StatusEnum.null,
    phone: props.modelValue.phone ? StatusEnum.saved : StatusEnum.null,
  })

  const teacherSchema = toTypedSchema(
    yup.object({
      firstName: yup.string().trim().required('First name is required'),
      lastName: yup.string().trim().required('Last name is required'),
      apartment: yup
        .string()
        .notRequired()
        .trim()
        .nullable()
        .max(10, '10 characters maximum'),
      streetNumber: yup
        .string()
        .trim()
        .max(5, '5 characters maximum')
        .required('Enter a valid street number'),
      streetName: yup.string().trim().required('Enter a valid street name'),
      city: yup
        .string()
        .trim()
        .max(20, 'Too many characters')
        .required('Enter a city name'),
      province: yup.string().max(3).required(),
      postalCode: yup
        .string()
        .trim()
        .matches(
          /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
          'Enter a valid postal code'
        )
        .required('Enter a valid postal code'),
      phone: yup
        .string()
        .trim()
        .phone('CA', 'Please enter a valid phone number')
        .required('A phone number is required'),
      email: yup
        .string()
        .trim()
        .email('Must be a valid email address')
        .required('Email address is required'),
    })
  )

  const schoolTeacherSchema = toTypedSchema(
    yup.object({
      firstName: yup.string().trim().required('First name is required'),
      lastName: yup.string().trim().required('Last name is required'),
      phone: yup
        .string()
        .phone('CA', 'Please enter a valid phone number')
        .required('A phone number is required'),
      email: yup
        .string()
        .email('Must be a valid email address')
        .required('Email address is required'),
    })
  )

  let validationSchema
  if (props.schoolteacher) {
    validationSchema = schoolTeacherSchema
  } else {
    validationSchema = teacherSchema
  }

  const currentYear = new Date().getFullYear()

  async function fieldStatus(stat: string, fieldName: string) {
    await nextTick()
    status[fieldName] = StatusEnum.pending
    await teacherStore.updateTeacher(fieldName)
    if (stat === 'saved') {
      status[fieldName] = StatusEnum.saved
    } else if (stat === 'remove') {
      status[fieldName] = StatusEnum.removed
    } else {
      status[fieldName] = StatusEnum.null
    }
  }

  const maskaUcaseOption = {
    preProcess: (val: string) => val.toUpperCase(),
  }

  const { errors, validate } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  onActivated(() => {
    validate()
  })
</script>

<template>
  <div class="grid grid-cols-12 gap-x-3 gap-y-1 items-end">
    <div class="col-span-3 sm:col-span-2 self-start">
      <BaseSelect
        v-model.trim="contact.prefix"
        :status="status.prefix"
        name="prefix"
        label="Title"
        :options="prefixes"
        @change-status="(stat: string) => fieldStatus(stat, 'prefix')" />
    </div>
    <div class="col-span-9 sm:col-span-5">
      <BaseInput
        v-model.trim="contact.firstName"
        :status="status.firstName"
        name="firstName"
        type="text"
        label="First Name"
        @change-status="(stat: string) => fieldStatus(stat, 'firstName')" />
    </div>
    <div class="col-span-12 sm:col-span-5">
      <BaseInput
        v-model.trim="contact.lastName"
        :status="status.lastName"
        name="lastName"
        type="text"
        label="Last Name"
        @change-status="(stat: string) => fieldStatus(stat, 'lastName')" />
    </div>
    <div
      v-if="!schoolteacher"
      class="col-span-6 sm:col-span-3">
      <BaseInput
        v-model.trim="contact.apartment"
        :status="status.apartment"
        name="apartment"
        type="text"
        label="Apt."
        @change-status="(stat: string) => fieldStatus(stat, 'apartment')" />
    </div>
    <div
      v-if="!schoolteacher"
      class="col-span-6 sm:col-span-3">
      <BaseInput
        v-model.trim="contact.streetNumber"
        :status="status.streetNumber"
        name="streetNumber"
        type="text"
        label="Street #"
        @change-status="(stat: string) => fieldStatus(stat, 'streetNumber')" />
    </div>
    <div
      v-if="!schoolteacher"
      class="col-span-12 sm:col-span-6">
      <BaseInput
        v-model.trim="contact.streetName"
        :status="status.streetName"
        name="streetName"
        type="text"
        label="Street Name"
        @change-status="(stat: string) => fieldStatus(stat, 'streetName')" />
    </div>
    <div
      v-if="!schoolteacher"
      class="col-span-8 sm:col-span-7">
      <BaseInput
        v-model.trim="contact.city"
        :status="status.city"
        name="city"
        type="text"
        label="City/Town"
        @change-status="(stat: string) => fieldStatus(stat, 'city')" />
    </div>
    <div
      v-if="!schoolteacher"
      class="col-span-4 sm:col-span-2 self-start">
      <BaseSelect
        v-model.trim="contact.province"
        :status="status.province"
        name="province"
        label="Province"
        :options="provinces"
        @change-status="(stat: string) => fieldStatus(stat, 'province')" />
    </div>
    <div
      v-if="!schoolteacher"
      class="col-span-6 sm:col-span-3">
      <BaseInput
        v-model.trim="contact.postalCode"
        v-maska:[maskaUcaseOption]
        :status="status.postalCode"
        placeholder="A0A 0A0"
        data-maska="A#A #A#"
        data-maska-tokens="A:[A-Z]"
        data-maska-eager
        name="postalCode"
        type="text"
        label="Postal Code"
        @change-status="(stat: string) => fieldStatus(stat, 'postalCode')" />
    </div>
    <div class="col-span-6 sm:col-span-5">
      <BaseInput
        v-model.trim="contact.phone"
        v-maska
        :status="status.phone"
        placeholder="(___) ___-____"
        data-maska="(###) ###-####"
        data-maska-eager
        name="phone"
        type="tel"
        label="Phone Number"
        @change-status="(stat: string) => fieldStatus(stat, 'phone')" />
    </div>
    <div class="col-span-12 sm:col-span-7">
      <BaseInput
        v-model.trim="contact.email"
        :status="status.email"
        placeholder="example@email.com"
        name="email"
        type="email"
        label="Email"
        @change-status="(stat: string) => fieldStatus(stat, 'email')" />
    </div>
  </div>
</template>

<style scoped></style>
