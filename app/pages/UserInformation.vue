<script lang="ts" setup>
  import * as yup from 'yup'
  import 'yup-phone-lite'
  import { useRegistration } from '~/stores/useRegistration'
  import { useUser } from '~/stores/useUser'
  import { MyUserDocument, type User } from '~/graphql/gql/graphql'
  import { provinces } from '#imports'
  import { useToast } from 'vue-toastification'

  definePageMeta({
    middleware: ['user'], // Apply only to user pages
  })

  const props = defineProps<{}>()

  const emits = defineEmits<{}>()

  // const contact = computed({
  //   get: () => props.modelValue
  //   set: (value) => emits('update:modelValue', value),
  // })

  const registrationStore = useRegistration()
  const userStore = useUser()
  const teacherView = computed(() => userStore.user.privateTeacher)
  const toast = useToast()

  /**
   * Load User details
   */

  const {
    result,
    onResult: onUserResult,
    onError: userError,
  } = useQuery(MyUserDocument, null, () => ({
    fetchPolicy: 'no-cache',
  }))
  onUserResult(async (result) => {
    userStore.addToStore(result.data.myUser)
    if (!userStore.user.isActive) {
      userStore.user.isActive = true
      await userStore.updateUser('isActive')
    }
  })
  userError((error) => console.error(error))

  userStore.user.isActive = true

  const status = reactive<Status>({
    privateTeacher: userStore.user.privateTeacher
      ? StatusEnum.saved
      : StatusEnum.null,
    schoolTeacher: userStore.user.schoolTeacher
      ? StatusEnum.saved
      : StatusEnum.null,
    instrument: userStore.user.instrument ? StatusEnum.saved : StatusEnum.null,
    firstName: userStore.user.firstName ? StatusEnum.saved : StatusEnum.null,
    lastName: userStore.user.lastName ? StatusEnum.saved : StatusEnum.null,
    address: userStore.user.address ? StatusEnum.saved : StatusEnum.null,
    city: userStore.user.city ? StatusEnum.saved : StatusEnum.null,
    province: userStore.user.province ? StatusEnum.saved : StatusEnum.null,
    postalCode: userStore.user.postalCode ? StatusEnum.saved : StatusEnum.null,
    phone: userStore.user.phone ? StatusEnum.saved : StatusEnum.null,
  })

  // async function fieldStatus(stat: string, fieldName: string) {
  //   await nextTick()
  //   status[fieldName] = StatusEnum.pending
  //   await userStore.updateUser(fieldName)
  //   if (stat === 'saved') status[fieldName] = StatusEnum.saved
  //   else if (stat === 'remove') status[fieldName] = StatusEnum.removed
  //   else status[fieldName] = StatusEnum.null
  // }

  async function fieldStatus(stat: string, fieldName: string) {
    await nextTick()
    if (stat === 'valid') {
      status[fieldName] = StatusEnum.pending
      const result = await userStore.updateUser(fieldName)
      status[fieldName] = StatusEnum.null
      if (result === 'complete') {
        if (userStore.user[fieldName as keyof User] !== null) {
          status[fieldName] = StatusEnum.saved
        }
      } else {
        toast.error(
          'Could not update field.  Please exit and reload Registration'
        )
      }
    } else if (stat === 'invalid') {
      status[fieldName] = StatusEnum.pending
      const result = await userStore.updateUser(fieldName)
      status[fieldName] = StatusEnum.null
      if (result === 'complete') {
        status[fieldName] = StatusEnum.removed
      } else {
        toast.error(
          'Could not remove invalid field. Please exit and reload Registration'
        )
      }
    } else if (stat === 'removed') {
      status[fieldName] = StatusEnum.pending
      const result = await userStore.updateUser(fieldName)
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
      privateTeacher: yup.boolean().default(false),
      schoolTeacher: yup.boolean().default(false),
      firstName: yup.string().trim().required('Required'),
      lastName: yup.string().trim().required('Required'),
      address: yup.string().trim().nullable(),
      city: yup.string().trim().max(20, 'Too many characters').nullable(),
      province: yup.string().max(3).nullable(),
      postalCode: yup
        .string()
        .trim()
        .matches(
          /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
          'Enter a valid postal code'
        )
        .nullable(),
      phone: yup
        .string()
        .trim()
        .phone('CA', 'Please enter a valid phone number')
        .nullable(),
      instrument: yup.string().trim().nullable(),
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
  defineExpose({ maskaUcaseOption })

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
        label="Private Teacher"
        class="px-4 inline-block"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'privateTeacher')
        " />
      <BaseCheckbox
        v-model="userStore.user.schoolTeacher"
        :status="status.schoolTeacher"
        name="schoolTeacher"
        label="School Teacher and/or Community Conductor"
        class="px-4 inline-block"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'schoolTeacher')
        " />
    </fieldset>
    <div class="col-span-12 sm:col-span-6">
      <BaseInput
        v-model.trim="userStore.user.firstName"
        :status="status.firstName"
        name="firstName"
        type="text"
        label="First Name"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'firstName')
        " />
    </div>
    <div class="col-span-12 sm:col-span-6">
      <BaseInput
        v-model.trim="userStore.user.lastName"
        :status="status.lastName"
        name="lastName"
        type="text"
        label="Last Name"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'lastName')
        " />
    </div>
    <div class="col-span-12 sm:col-span-8">
      <BaseInput
        v-model.trim="userStore.user.address"
        :status="status.address"
        name="address"
        type="text"
        label="Mailing Address"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'address')
        " />
    </div>
    <div class="col-span-12 sm:col-span-4">
      <BaseInput
        v-model.trim="userStore.user.city"
        :status="status.city"
        name="city"
        type="text"
        label="City/Town"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'city')
        " />
    </div>
    <div class="col-span-6 sm:col-span-2 self-start">
      <BaseSelect
        v-model.trim="userStore.user.province"
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
        v-model.trim="userStore.user.postalCode"
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
    <div class="col-span-6 sm:col-span-6">
      <BaseInput
        v-model.trim="userStore.user.phone"
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
    <div
      v-if="teacherView"
      class="col-span-12 sm:col-span-6">
      <BaseInput
        v-model.trim="userStore.user.instrument"
        :status="status.instrument"
        name="instrument"
        type="text"
        label="Instrument(s)"
        @change-status="
          async (stat: string) => await fieldStatus(stat, 'instrument')
        " />
    </div>
  </div>
</template>

<style scoped></style>
