<script lang="ts" setup>
import * as yup from 'yup'
import 'yup-phone-lite'
import { usePerformers } from '@/stores/userPerformer'
import {InstrumentsDocument} from '~/graphql/gql/graphql'
import {provinces} from '#imports'

const props = defineProps<{
  modelValue: ContactInfo
  teacher?: boolean
  schoolteacher?: boolean
  school?: boolean
  groupperformer?: boolean
  performerIndex: number
  performerId: number
}>()

const emits = defineEmits<{
  'update:modelValue': [value: ContactInfo]
}>()

const performerStore = usePerformers()
const appStore = useAppStore()

const contact = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})

const { result: instrumentQuery, onError: instrumentsError }
    = useQuery(InstrumentsDocument)
const instruments = computed(() => instrumentQuery.value?.instruments ?? [])
instrumentsError((error) => {
  console.log(error)
})

const status = reactive<Status>({
  firstName: props.modelValue.firstName ? StatusEnum.saved : StatusEnum.null,
  lastName: props.modelValue.lastName ? StatusEnum.saved : StatusEnum.null,
  age: props.modelValue.age ? StatusEnum.saved : StatusEnum.null,
  level: props.modelValue.level ? StatusEnum.saved : StatusEnum.null,
  instrument: props.modelValue.instrument
    ? StatusEnum.saved
    : StatusEnum.null,
  otherClasses: props.modelValue.otherClasses
    ? StatusEnum.saved
    : StatusEnum.null,
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

async function fieldStatus(stat: string, fieldName: string) {
  await nextTick()
  status[fieldName] = StatusEnum.pending
  await performerStore.updatePerformer(props.performerId, fieldName)
  if (stat === 'saved')
    status[fieldName] = StatusEnum.saved
  else if (stat === 'remove')
    status[fieldName] = StatusEnum.removed
  else
    status[fieldName] = StatusEnum.null
}

const validationSchema = toTypedSchema(
  yup.object({
    firstName: yup.string().trim().required('First name is required'),
    lastName: yup.string().trim().required('Last name is required'),
    age: yup
      .number()
      .positive('Enter age')
      .integer('Enter age')
      .min(1)
      .max(100, 'Enter age')
      .required('Enter age'),
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
        'Enter a valid postal code',
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
    instrument: yup.string().trim().required('Please indicate an instrument'),
    level: yup.string().trim().required('Please indicate grade or level'),
    otherClasses: yup.string().trim(),
  }),
)

const { errors, validate } = useForm({
  validationSchema,
  validateOnMount: true,
})

onActivated(async () => {
  await validate()
})

const maskaUcaseOption = {
  preProcess: (val: string) => val.toUpperCase(),
}

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="grid grid-cols-12 gap-x-3 gap-y-1 items-end">
    <div class="col-span-12 sm:col-span-5">
      <BaseInput
        v-model.trim="contact.firstName"
        :status="status.firstName"
        name="firstName"
        type="text"
        label="First Name"
        @change-status="(stat: string) => fieldStatus(stat, 'firstName')"
      />
    </div>
    <div class="col-span-12 sm:col-span-5">
      <BaseInput
        v-model.trim="contact.lastName"
        :status="status.lastName"
        name="lastName"
        type="text"
        label="Last Name"
        @change-status="(stat: string) => fieldStatus(stat, 'lastName')"
      />
    </div>
    <div class="col-span-3 sm:col-span-2">
      <BaseInput
        v-model.number="contact.age"
        :status="status.age"
        min="1"
        max="100"
        step="1"
        name="age"
        type="number"
        label="Age"
        :help-message="`Age as of December 31, ${currentYear}`"
        @change-status="(stat: string) => fieldStatus(stat, 'age')"
      />
    </div>
    <div class="col-span-4 sm:col-span-3">
      <BaseInput
        v-model.trim="contact.apartment"
        :status="status.apartment"
        name="apartment"
        type="text"
        label="Apt."
        @change-status="(stat: string) => fieldStatus(stat, 'apartment')"
      />
    </div>
    <div class="col-span-5 sm:col-span-3">
      <BaseInput
        v-model.trim="contact.streetNumber"
        :status="status.streetNumber"
        name="streetNumber"
        type="text"
        label="Street #"
        @change-status="(stat: string) => fieldStatus(stat, 'streetNumber')"
      />
    </div>
    <div class="col-span-12 sm:col-span-6">
      <BaseInput
        v-model.trim="contact.streetName"
        :status="status.streetName"
        name="streetName"
        type="text"
        label="Street Name"
        @change-status="(stat: string) => fieldStatus(stat, 'streetName')"
      />
    </div>
    <div class="col-span-8 sm:col-span-7">
      <BaseInput
        v-model.trim="contact.city"
        :status="status.city"
        name="city"
        type="text"
        label="City/Town"
        @change-status="(stat: string) => fieldStatus(stat, 'city')"
      />
    </div>
    <div class="col-span-4 sm:col-span-2 self-start">
      <BaseSelect
        v-model.trim="contact.province"
        :status="status.province"
        name="province"
        label="Province"
        :options="provinces"
        @change-status="(stat: string) => fieldStatus(stat, 'province')"
      />
    </div>
    <div class="col-span-6 sm:col-span-3">
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
        @change-status="(stat: string) => fieldStatus(stat, 'postalCode')"
      />
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
        @change-status="(stat: string) => fieldStatus(stat, 'phone')"
      />
    </div>
    <div class="col-span-12 sm:col-span-7">
      <BaseInput
        v-model.trim="contact.email"
        :status="status.email"
        placeholder="example@email.com"
        name="email"
        type="email"
        label="Email"
        @change-status="(stat: string) => fieldStatus(stat, 'email')"
      />
    </div>
    <div class="col-span-6 sm:col-span-6">
      <BaseSelect
        id="instrument"
        v-model="contact.instrument"
        :status="status.instrument"
        name="instrument"
        :options="instruments"
        label="Instrument"
        @change-status="(stat: string) => fieldStatus(stat, 'instrument')"
      />
    </div>
    <div
      v-if="groupperformer"
      class="col-span-6 sm:col-span-6"
    >
      <BaseInput
        v-model.trim="contact.level"
        :status="status.level"
        name="level"
        type="text"
        label="Level"
        @change-status="(stat: string) => fieldStatus(stat, 'level')"
      />
    </div>
    <div
      v-if="groupperformer"
      class="col-span-12"
    >
      <p>
        To avoid scheduling conflicts, please list all other festival classes
        entered but not included on this form. Use only class numbers separated
        by commas.
      </p>
      <BaseTextarea
        v-model.trim="contact.otherClasses"
        :status="status.otherClasses"
        name="otherClasses"
        label="Other festival classes entered"
        @change-status="(stat: string) => fieldStatus(stat, 'otherClasses')"
      />
    </div>
  </div>
</template>

<style scoped></style>
