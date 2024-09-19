<script lang="ts" setup>
  import * as yup from 'yup'
  import 'yup-phone-lite'
  import { useTeacher } from '@/stores/userTeacher'
  import { useRegistration } from '~/stores/userRegistration'
  import { useAppStore } from '~/stores/appStore'
  import { useUser } from '~/stores/useUser'
  import type { Teacher } from '~/graphql/gql/graphql'
  import { useToast } from 'vue-toastification'
  import { provinces, StatusEnum } from '#imports'

  interface FilteredTeacher {
    id: number
    firstName: string
    lastName: string
    instrument?: string
  }

  const props = defineProps<{
    modelValue: ContactInfo
    teacher?: boolean
    teacherId?: number
    schoolteacher?: boolean
    school?: boolean
    groupperformer?: boolean
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
  const privateTeacher = ref(false)
  const schoolTeacher = ref(false)
  const unlistedTeacher = ref(false)

  const userStore = useUser()
  const toast = useToast()
  const teacherStore = useTeacher()
  const registrationStore = useRegistration()
  const appStore = useAppStore()
  const emailAlreadyExists = ref(false)
  const chosenTeacher = ref({} as FilteredTeacher)

  onMounted(async () => {
    if (appStore.performerType === 'SCHOOL') {
      privateTeacher.value = false
      schoolTeacher.value = true
    } else {
      privateTeacher.value = true
      schoolTeacher.value = false
    }
    if (!!registrationStore.registration.teacherID) {
      let { id, firstName, lastName, instrument } = teacherStore.teacher
      firstName = firstName ?? ''
      lastName = lastName ?? ''
      instrument = instrument ?? undefined
      chosenTeacher.value = { id, firstName, lastName, instrument }
      checkForPassword(registrationStore.registration.teacherID)
    }
  })

  async function checkForPassword(id: number) {
    await userStore.loadHasPassword(id)
    appStore.teacherHasPassword = userStore.checkPassword
  }

  const status = reactive<Status>({
    id: props.teacherId ? StatusEnum.saved : StatusEnum.null,
    firstName: props.modelValue.firstName ? StatusEnum.saved : StatusEnum.null,
    lastName: props.modelValue.lastName ? StatusEnum.saved : StatusEnum.null,
    // apartment: props.modelValue.apartment ? StatusEnum.saved : StatusEnum.null,
    // streetNumber: props.modelValue.streetNumber
    //   ? StatusEnum.saved
    //   : StatusEnum.null,
    // streetName: props.modelValue.streetName
    //   ? StatusEnum.saved
    //   : StatusEnum.null,
    // city: props.modelValue.city ? StatusEnum.saved : StatusEnum.null,
    // province: props.modelValue.province ? StatusEnum.saved : StatusEnum.null,
    // postalCode: props.modelValue.postalCode
    //   ? StatusEnum.saved
    //   : StatusEnum.null,
    email: props.modelValue.email ? StatusEnum.saved : StatusEnum.null,
    phone: props.modelValue.phone ? StatusEnum.saved : StatusEnum.null,
    instrument: props.modelValue.instrument
      ? StatusEnum.saved
      : StatusEnum.null,
  })

  const teacherSchema = toTypedSchema(
    yup.object({
      id: yup.number(),
      firstName: yup.string().trim().required('First name is required'),
      lastName: yup.string().trim().required('Last name is required'),
      // apartment: yup
      //   .string()
      //   .notRequired()
      //   .trim()
      //   .nullable()
      //   .max(10, '10 characters maximum'),
      // streetNumber: yup
      //   .string()
      //   .trim()
      //   .max(5, '5 characters maximum')
      //   .required('Enter a valid street number'),
      // streetName: yup.string().trim().required('Enter a valid street name'),
      // city: yup
      //   .string()
      //   .trim()
      //   .max(20, 'Too many characters')
      //   .required('Enter a city name'),
      // province: yup.string().max(3).required(),
      // postalCode: yup
      //   .string()
      //   .trim()
      //   .matches(
      //     /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
      //     'Enter a valid postal code'
      //   )
      //   .required('Enter a valid postal code'),
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
      instrument: yup.string().trim().required('Instrument is required'),
    })
  )

  const schoolTeacherSchema = toTypedSchema(
    yup.object({
      id: yup.number(),
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
    if (!emailAlreadyExists.value) {
      await nextTick()
      status[fieldName] = StatusEnum.pending
      await teacherStore.updateTeacher(fieldName).catch((err) => {
        console.log('Trying to remove non-existant teacher', err)
        stat = ''
      })
      if (stat === 'saved') {
        status[fieldName] = StatusEnum.saved
      } else if (stat === 'remove') {
        status[fieldName] = StatusEnum.removed
      } else {
        status[fieldName] = StatusEnum.null
      }
    }
    emailAlreadyExists.value = false
  }

  const { errors, validate, values } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  onActivated(() => {
    validate()
  })
  onDeactivated(async () => {
    if (
      (!values.email || !values.firstName || !values.lastName) &&
      !!teacherCreated.value
    ) {
      await removeTeacher()
      emailAlreadyExists.value = false
      // teacherRadio.value = 'existing'
    }
  })

  // Working with the new Teacher ComboBox

  // const editingDisabled = ref(true)
  // Checks if a newly created record is actually a duplicate
  // of an existing record.
  const duplicateCheck = ref(<Teacher>{})
  // Flag to show if this teacher was just created and
  // did not exist in the user db before now.
  const teacherCreated = ref(false)

  /**
   * Watching the Teacher page action flow
   *
   * Creates a new teacher account when Unlisted Teacher is selected.
   * Empty Teacher Record is automatically created in the db
   **/
  watch(unlistedTeacher, async (newValue, oldValue) => {
    if (newValue === true) {
      teacherStore.$resetTeacher()
      registrationStore.registration.teacherID = null

      privateTeacher.value = appStore.performerType !== 'SCHOOL' ? true : false
      schoolTeacher.value = appStore.performerType === 'SCHOOL' ? true : false

      await teacherStore.createTeacher(
        privateTeacher.value,
        schoolTeacher.value
      )
      registrationStore.registration.teacherID = teacherStore.teacher.id
      teacherCreated.value = true
    } else if (
      newValue === false &&
      teacherCreated.value === true &&
      !emailAlreadyExists.value
    ) {
      await removeTeacher()
    }
  })

  async function removeTeacher() {
    if (registrationStore.registration.teacherID) {
      await teacherStore.deleteTeacher(registrationStore.registration.teacherID)
    }
    registrationStore.registration.teacherID = null
    await registrationStore.updateRegistration('teacherID')
    teacherCreated.value = false
  }

  watch(
    chosenTeacher,
    async (newTeacher) => {
      if (newTeacher.firstName === 'Unlisted') {
        unlistedTeacher.value = true
        return
      } else {
        unlistedTeacher.value = false
        registrationStore.registration.teacherID = newTeacher.id
        await teacherStore.loadTeacher(newTeacher.id, undefined)
        await registrationStore.updateRegistration('teacherID')
        registrationStore.registration.teacherID = newTeacher.id
      }
    }
    // { flush: 'post' }
  )

  async function checkForDuplicate() {
    emailAlreadyExists.value = false
    if (unlistedTeacher.value === true && teacherStore.teacher.email) {
      duplicateCheck.value = await teacherStore.duplicateTeacherCheck(
        teacherStore.teacher?.email
      )
      if (!!duplicateCheck.value.id) {
        emailAlreadyExists.value = true
        toast.warning(
          'Email already exists. Changing the teacher details to an existing teacher if available'
        )
        unlistedTeacher.value = false
        await removeTeacher()
        registrationStore.registration.teacherID = duplicateCheck.value.id
        await teacherStore.loadTeacher(duplicateCheck.value.id, undefined)
        await registrationStore
          .updateRegistration('teacherID')
          .catch((error) => {
            console.log('Error updating registration from teacherID', error)
          })
        emailAlreadyExists.value = false
      }
    }
  }

  const filteredTeachers = ref([] as FilteredTeacher[])
  function search(event: any) {
    filteredTeachers.value = teacherStore.allTeachers.filter((teacher) => {
      return `${teacher.firstName} ${teacher.lastName}`
        .toLowerCase()
        .includes(event.query.toLowerCase())
    })
  }

  function displayName(teacher: FilteredTeacher) {
    if (teacher.instrument) {
      return `${teacher.firstName} ${teacher.lastName}, ${teacher.instrument}`
    } else {
      return `${teacher.firstName} ${teacher.lastName}`
    }
  }
</script>

<template>
  <div>
    <div class="pb-5 z-10 text-center">
      <div class="flex items-center ml-2">
        <div class="flex-none">
          <label class="baseLabel"> Select a Teacher from the list </label>
        </div>
        <div class="grow" />
        <BaseSaved
          class="flex-none mr-2"
          :status="status.id" />
      </div>
      <PrimeAutoComplete
        class="w-full lg:w-1/2 md:w-3/4"
        v-model="chosenTeacher"
        dropdown
        forceSelection
        :optionLabel="
          (chosenTeacher: FilteredTeacher) => displayName(chosenTeacher)
        "
        :suggestions="filteredTeachers"
        @complete="search">
        <template #option="slotProps">
          <div v-if="slotProps.option.instrument">
            {{ slotProps.option.firstName }} {{ slotProps.option.lastName }},
            {{ slotProps.option.instrument }}
          </div>
          <div v-else>
            {{ slotProps.option.firstName }} {{ slotProps.option.lastName }}
          </div>
        </template>
      </PrimeAutoComplete>
    </div>
    <div v-if="unlistedTeacher === true">
      <p>
        Please enter the contact information for your teacher so that we may
        contact them regarding your entry and include them in our database.
      </p>
      <div class="grid grid-cols-12 gap-x-3 gap-y-1 items-end">
        <div class="col-span-12 sm:col-span-6">
          <BaseInput
            v-model.trim="contact.firstName"
            :status="status.firstName"
            name="firstName"
            type="text"
            label="First Name"
            @change-status="(stat: string) => fieldStatus(stat, 'firstName')" />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <BaseInput
            v-model.trim="contact.lastName"
            :status="status.lastName"
            name="lastName"
            type="text"
            label="Last Name"
            @change-status="(stat: string) => fieldStatus(stat, 'lastName')" />
        </div>

        <div class="col-span-6 sm:col-span-4">
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
        <div class="col-span-12 sm:col-span-4">
          <BaseInput
            v-model.trim="contact.email"
            :status="status.email"
            placeholder="example@email.com"
            name="email"
            type="email"
            label="Email"
            @change-status="
              (stat: string) => {
                checkForDuplicate()
                fieldStatus(stat, 'email')
              }
            " />
        </div>
        <div
          v-if="!schoolteacher && teacher"
          class="col-span-12 sm:col-span-4">
          <BaseInput
            v-model.trim="contact.instrument"
            :status="status.instrument"
            name="instrument"
            type="text"
            label="Instrument"
            @change-status="
              (stat: string) => fieldStatus(stat, 'instrument')
            " />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
