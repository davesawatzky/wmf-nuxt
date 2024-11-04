<script lang="ts" setup>
  import * as yup from 'yup'
  import 'yup-phone-lite'
  import { usePerformers } from '~/stores/usePerformer'
  import { InstrumentsDocument } from '~/graphql/gql/graphql'
  import { provinces, StatusEnum, type ContactInfo } from '#imports'
  import BaseSelect from '../base/BaseSelect.vue'
  import type { Performer } from '~/graphql/gql/graphql'
  import { useToast } from 'vue-toastification'

  type Pronouns = {}

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

  const fieldConfigStore = useFieldConfig()
  const performerStore = usePerformers()
  const toast = useToast()
  const appStore = useAppStore()

  const contact = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  const { result: instrumentQuery, onError: instrumentsError } =
    useQuery(InstrumentsDocument)
  const instruments = computed(() => instrumentQuery.value?.instruments ?? [])
  instrumentsError((error) => {
    console.log(error)
  })

  const status = reactive<Status>({
    pronouns: props.modelValue.pronouns ? StatusEnum.saved : StatusEnum.null,
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
    unavailable: props.modelValue.unavailable
      ? StatusEnum.saved
      : StatusEnum.null,
    address: props.modelValue.address ? StatusEnum.saved : StatusEnum.null,
    city: props.modelValue.city ? StatusEnum.saved : StatusEnum.null,
    province: props.modelValue.province ? StatusEnum.saved : StatusEnum.null,
    postalCode: props.modelValue.postalCode
      ? StatusEnum.saved
      : StatusEnum.null,
    email: props.modelValue.email ? StatusEnum.saved : StatusEnum.null,
    phone: props.modelValue.phone ? StatusEnum.saved : StatusEnum.null,
    photoPermission: props.modelValue.photoPermission
      ? StatusEnum.saved
      : StatusEnum.null,
  })

  async function fieldStatus(stat: string, fieldName: string) {
    await nextTick()
    if (stat === 'valid') {
      status[fieldName] = StatusEnum.pending
      const result = await performerStore.updatePerformer(
        props.performerId,
        fieldName
      )
      status[fieldName] = StatusEnum.null
      if (result === 'complete') {
        if (contact.value[fieldName as keyof ContactInfo]) {
          status[fieldName] = StatusEnum.saved
        } else {
          toast.error(
            'Could not update field.  Please exit and reload Registration'
          )
        }
      }
    } else if (stat === 'invalid') {
      status[fieldName] = StatusEnum.pending
      const result = await performerStore.updatePerformer(
        props.performerId,
        fieldName
      )
      status[fieldName] = StatusEnum.null
      if (result === 'complete') {
        status[fieldName] = StatusEnum.null
      } else {
        toast.error(
          'Could not remove invalid field.Please exit and reload Registration'
        )
      }
    } else if (stat === 'removed') {
      status[fieldName] = StatusEnum.pending
      const result = await performerStore.updatePerformer(
        props.performerId,
        fieldName
      )
      status[fieldName] = StatusEnum.null
      if (result === 'complete') {
        status[fieldName] = StatusEnum.removed
      } else {
        toast.error(
          'Could not remove field.  Please exit and reload Registration'
        )
      }
    }
  }

  const validationSchema = toTypedSchema(
    yup.object({
      pronouns: yup
        .string()
        .trim()
        .notRequired()
        .oneOf(['', 'She/Her', 'He/Him', 'They/Them']),
      firstName: yup.string().trim().required('Required'),
      lastName: yup.string().trim().required('Required'),
      age: yup
        .number()
        .positive('Enter age')
        .integer('Enter age')
        .min(1)
        .max(100, 'Enter age')
        .required('Required'),
      address: yup.string().trim().required('Required'),
      city: yup.string().trim().required('Required'),
      province: yup.string().max(3).required('Required'),
      postalCode: yup
        .string()
        .trim()
        .matches(
          /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
          'Enter a valid postal code'
        )
        .required('Required'),
      phone: yup
        .string()
        .trim()
        .phone('CA', 'Please enter a valid phone number')
        .required('Required'),
      email: yup
        .string()
        .trim()
        .email('Must be a valid email address')
        .required('Required'),
      instrument: yup.string().trim().required('Required'),
      level: yup.string().trim().required('Enter Grade or Level'),
      otherClasses: yup.string().trim().notRequired().nullable(),
      unavailable: yup.string().trim().notRequired().nullable(),
      photoPermission: yup
        .string()
        .trim()
        .required('Required')
        .oneOf(['Yes', 'No']),
    })
  )

  const { errors, validate } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  onActivated(() => {
    validate()
  })

  const performerKeys = fieldConfigStore.performerTypeFields('Performer')
  watchEffect(() => {
    let count = 0
    for (const key of performerKeys) {
      if (status[key as keyof Performer] !== StatusEnum.saved) {
        count++
      }
    }
    let index = performerStore.performerErrors.findIndex(
      (item) => item.id === props.performerId
    )
    performerStore.performerErrors[index].count = count
  })

  const maskaUcaseOption = {
    preProcess: (val: string) => val.toUpperCase(),
  }

  defineExpose({ maskaUcaseOption })

  const currentYear = new Date().getFullYear()

  const pronounOptions = [
    { id: 'Empty', name: '' },
    { id: 'She/Her', name: 'She/Her' },
    { id: 'He/Him', name: 'He/Him' },
    { id: 'They/Them', name: 'They/Them' },
  ]
</script>

<template>
  <div class="grid grid-cols-12 gap-x-3 gap-y-1 items-center">
    <div class="col-span-4 sm:col-span-3">
      <BaseSelect
        v-model.trim="contact.pronouns"
        :status="status.pronouns"
        name="pronouns"
        label="Pronouns"
        :options="pronounOptions"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'pronouns')
        " />
    </div>
    <div class="col-span-8 sm:col-span-4">
      <BaseInput
        v-model.trim="contact.firstName"
        :status="status.firstName"
        name="firstName"
        type="text"
        label="First Name"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'firstName')
        " />
    </div>
    <div class="col-span-12 sm:col-span-5">
      <BaseInput
        v-model.trim="contact.lastName"
        :status="status.lastName"
        name="lastName"
        type="text"
        label="Last Name"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'lastName')
        " />
    </div>
    <div class="col-span-3 sm:col-span-3">
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
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'age')
        " />
    </div>
    <div class="col-span-9 sm:col-span-9">
      <BaseInput
        v-model.trim="contact.address"
        :status="status.address"
        name="address"
        type="text"
        label="Mailing Address"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'address')
        " />
    </div>
    <div class="col-span-8 sm:col-span-5">
      <BaseInput
        v-model.trim="contact.city"
        :status="status.city"
        name="city"
        type="text"
        label="City/Town"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'city')
        " />
    </div>
    <div class="col-span-4 sm:col-span-3 self-start">
      <BaseSelect
        v-model.trim="contact.province"
        :status="status.province"
        name="province"
        label="Province"
        :options="provinces"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'province')
        " />
    </div>
    <div class="col-span-6 sm:col-span-4">
      <BaseInput
        v-model.trim="contact.postalCode"
        v-maska:maskaUcaseOption
        :status="status.postalCode"
        placeholder="A0A 0A0"
        data-maska="A#A #A#"
        data-maska-tokens="A:[A-Z]"
        data-maska-eager
        name="postalCode"
        type="text"
        label="Postal Code"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'postalCode')
        " />
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
        type="text"
        label="Phone Number"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'phone')
        " />
    </div>
    <div class="col-span-12 sm:col-span-7">
      <BaseInput
        v-model.trim="contact.email"
        :status="status.email"
        placeholder="example@email.com"
        name="email"
        type="email"
        label="Email"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'email')
        " />
    </div>
    <div class="col-span-12 sm:col-span-4">
      <BaseSelect
        id="instrument"
        v-model="contact.instrument"
        :status="status.instrument"
        name="instrument"
        :options="instruments"
        label="Instrument/Discipline"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'instrument')
        " />
    </div>
    <div class="self-end col-span-3 sm:col-span-2 lg:col-start-6">
      <BaseSelect
        id="photo-permission"
        v-model="contact.photoPermission"
        :status="status.photoPermission"
        :options="[
          { id: 'Yes', name: 'Yes' },
          { id: 'No', name: 'No' },
        ]"
        name="photoPermission"
        label=""
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'photoPermission')
        " />
    </div>
    <p class="col-span-9 sm:col-span-6 lg:col-span-5 text-sm">
      I give permission to use photographs of this participant in Winnipeg Music
      Festival newsletters, funding requests, archival purposes, marketing and
      social media.
    </p>
    <div
      v-if="groupperformer"
      class="col-span-6 sm:col-span-6">
      <BaseInput
        v-model.trim="contact.level"
        :status="status.level"
        name="level"
        type="text"
        label="Level"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'level')
        " />
    </div>
    <div
      v-if="groupperformer"
      class="col-span-12">
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
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'otherClasses')
        " />
    </div>
    <div
      v-else
      class="col-span-12">
      <p>
        List any scheduling requests. The Festival cannot guarantee that
        submitted requests can be accommodated. Entry fees are non-refundable.
      </p>
      <BaseTextarea
        v-model.trim="contact.unavailable"
        :status="status.unavailable"
        name="unavailable"
        label="Scheduling Requests"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'unavailable')
        " />
    </div>
  </div>
</template>

<style scoped></style>
