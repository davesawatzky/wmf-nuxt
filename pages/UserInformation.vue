<script lang="ts" setup>
  import * as yup from 'yup'
  import 'yup-phone-lite'
  import type { ContactInfo, Status } from '@/composables/types'
  import { useRegistration } from '~/stores/userRegistration'
  import { useUser } from '~/stores/useUser'
  import { MyUserDocument } from '~/graphql/gql/graphql'

  const props = defineProps<{}>()

  const emits = defineEmits<{}>()

  // const contact = computed({
  //   get: () => props.modelValue
  //   set: (value) => emits('update:modelValue', value),
  // })

  const registrationStore = useRegistration()
  const userStore = useUser()
  const teacherView = computed(() => userStore.user.privateTeacher)

  definePageMeta({
    middleware: ['auth'],
  })

  /**
   * Load User details
   */
  onMounted(async () => {
    if (!userStore.user.email) {
      const {
        result,
        onResult: onUserResult,
        onError: userError,
      } = useQuery(MyUserDocument, null, () => ({
        fetchPolicy: 'no-cache',
      }))
      onUserResult(async (result) => {
        userStore.addToStore(result.data.myUser)
        if (!userStore.user.hasSignedIn) {
          userStore.user.hasSignedIn = true
          await userStore.updateUser('hasSignedIn')
        }
      })
      userError((error) => console.log(error))
    }
    userStore.user.hasSignedIn = true
  })

  const status = reactive<Status>({
    privateTeacher: userStore.user.privateTeacher
      ? StatusEnum.saved
      : StatusEnum.null,
    schoolTeacher: userStore.user.schoolTeacher
      ? StatusEnum.saved
      : StatusEnum.null,
    instrument: userStore.user.instrument ? StatusEnum.saved : StatusEnum.null,
    apartment: userStore.user.apartment ? StatusEnum.saved : StatusEnum.null,
    streetNumber: userStore.user.streetNumber
      ? StatusEnum.saved
      : StatusEnum.null,
    streetName: userStore.user.streetName ? StatusEnum.saved : StatusEnum.null,
    city: userStore.user.city ? StatusEnum.saved : StatusEnum.null,
    province: userStore.user.province ? StatusEnum.saved : StatusEnum.null,
    postalCode: userStore.user.postalCode ? StatusEnum.saved : StatusEnum.null,
    phone: userStore.user.phone ? StatusEnum.saved : StatusEnum.null,
  })

  async function fieldStatus(stat: string, fieldName: string) {
    await nextTick()
    status[fieldName] = StatusEnum.pending
    await userStore.updateUser(fieldName)
    if (stat === 'saved') {
      status[fieldName] = StatusEnum.saved
    } else if (stat === 'remove') {
      status[fieldName] = StatusEnum.removed
    } else {
      status[fieldName] = StatusEnum.null
    }
  }

  const validationSchema = toTypedSchema(
    yup.object({
      privateTeacher: yup.boolean().default(false),
      schoolTeacher: yup.boolean().default(false),
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
      instrument: yup.string().trim().required('Please indicate an instrument'),
    })
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
    <div class="col-span-12 pt-8">
      <h2 class="pb-2">User Account Information</h2>
      <h3>
        {{ userStore.user.firstName }}
        {{ userStore.user.lastName }}
      </h3>
      <div>{{ userStore.user.email }}</div>
    </div>
    <fieldset class="col-span-12 my-4 p-1 border-sky-500 border rounded-lg">
      <legend class="ml-2">
        <label>Select teacher type if applicable</label>
      </legend>
      <div class="text-sm">
        This will include your name in the searchable list of teachers.
      </div>
      <BaseCheckbox
        v-model="userStore.user.privateTeacher"
        :status="status.privateTeacher"
        name="privateTeacher"
        label="Private Teacher or Community Ensemble Leader"
        class="px-4 inline-block"
        @change-status="
          (stat: string) => fieldStatus(stat, 'privateTeacher')
        "></BaseCheckbox>
      <BaseCheckbox
        v-model="userStore.user.schoolTeacher"
        :status="status.schoolTeacher"
        name="schoolTeacher"
        label="Grade School Teacher"
        class="px-4 inline-block"
        @change-status="
          (stat: string) => fieldStatus(stat, 'schoolTeacher')
        "></BaseCheckbox>
    </fieldset>
    <div class="col-span-4 sm:col-span-3">
      <BaseInput
        v-model.trim="userStore.user.apartment"
        :status="status.apartment"
        name="apartment"
        type="text"
        label="Apt."
        @change-status="(stat: string) => fieldStatus(stat, 'apartment')" />
    </div>
    <div class="col-span-5 sm:col-span-3">
      <BaseInput
        v-model.trim="userStore.user.streetNumber"
        :status="status.streetNumber"
        name="streetNumber"
        type="text"
        label="Street #"
        @change-status="(stat: string) => fieldStatus(stat, 'streetNumber')" />
    </div>
    <div class="col-span-12 sm:col-span-6">
      <BaseInput
        v-model.trim="userStore.user.streetName"
        :status="status.streetName"
        name="streetName"
        type="text"
        label="Street Name"
        @change-status="(stat: string) => fieldStatus(stat, 'streetName')" />
    </div>
    <div class="col-span-8 sm:col-span-7">
      <BaseInput
        v-model.trim="userStore.user.city"
        :status="status.city"
        name="city"
        type="text"
        label="City/Town"
        @change-status="(stat: string) => fieldStatus(stat, 'city')" />
    </div>
    <div class="col-span-4 sm:col-span-2 self-start">
      <BaseSelect
        v-model.trim="userStore.user.province"
        :status="status.province"
        name="province"
        label="Province"
        :options="provinces"
        @change-status="(stat: string) => fieldStatus(stat, 'province')" />
    </div>
    <div class="col-span-6 sm:col-span-3">
      <BaseInput
        v-model.trim="userStore.user.postalCode"
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
        v-model.trim="userStore.user.phone"
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
    <div
      v-if="teacherView"
      class="col-span-12 sm:col-span-7">
      <BaseInput
        v-model.trim="userStore.user.instrument"
        :status="status.instrument"
        name="instrument"
        type="text"
        label="Instrument(s)"
        @change-status="(stat: string) => fieldStatus(stat, 'instrument')" />
    </div>
  </div>
</template>

<style scoped></style>
