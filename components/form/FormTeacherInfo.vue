<script lang="ts" setup>
  import * as yup from 'yup'
  import 'yup-phone-lite'
  import { useTeacher } from '@/stores/useTeacher'
  import { useRegistration } from '~/stores/useRegistration'
  import { useAppStore } from '~/stores/appStore'
  import { useUser } from '~/stores/useUser'
  import type { Teacher } from '~/graphql/gql/graphql'
  import { useToast } from 'vue-toastification'
  import { StatusEnum } from '#imports'
  import type { FilteredTeacher } from '@/stores/useTeacher'

  const props = defineProps<{
    modelValue: ContactInfo
    teacher?: boolean
    teacherId?: number
    schoolTeacher?: boolean
    communityConductor?: boolean
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

  const fieldConfigStore = useFieldConfig()
  const userStore = useUser()
  const toast = useToast()
  const teacherStore = useTeacher()
  const registrationStore = useRegistration()
  const appStore = useAppStore()

  onMounted(async () => {
    if (
      appStore.performerType === 'SCHOOL' ||
      appStore.performerType === 'COMMUNITY'
    ) {
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
      teacherStore.chosenTeacher = { id, firstName, lastName, instrument }
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
    email: props.modelValue.email ? StatusEnum.saved : StatusEnum.null,
    phone: props.modelValue.phone ? StatusEnum.saved : StatusEnum.null,
    instrument: props.modelValue.instrument
      ? StatusEnum.saved
      : StatusEnum.null,
  })

  const teacherSchema = toTypedSchema(
    yup.object({
      id: yup.number(),
      firstName: yup.string().trim().required('Required'),
      lastName: yup.string().trim().required('Required'),
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
    })
  )

  const schoolTeacherSchema = toTypedSchema(
    yup.object({
      id: yup.number(),
      firstName: yup.string().trim().required('Required'),
      lastName: yup.string().trim().required('Required'),
      phone: yup
        .string()
        .phone('CA', 'Please enter a valid phone number')
        .required('Required'),
      email: yup
        .string()
        .email('Must be a valid email address')
        .required('Required'),
    })
  )

  let validationSchema
  if (props.schoolTeacher || props.communityConductor) {
    validationSchema = schoolTeacherSchema
  } else {
    validationSchema = teacherSchema
  }

  const currentYear = new Date().getFullYear()

  async function fieldStatus(stat: string, fieldName: string) {
    if (!teacherStore.emailAlreadyExists) {
      await nextTick()
      status[fieldName] = StatusEnum.pending
      if (!!teacherStore.teacher.id && fieldName !== 'id') {
        await teacherStore.updateTeacher(fieldName).catch((err) => {
          console.log('Trying to remove non-existant teacher', err)
          stat = ''
        })
      }
      if (stat === 'saved') {
        status[fieldName] = StatusEnum.saved
      } else if (stat === 'remove') {
        status[fieldName] = StatusEnum.removed
      } else {
        status[fieldName] = StatusEnum.null
      }
    }
    teacherStore.emailAlreadyExists = false
  }

  const { errors, validate, values } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  const { handleChange } = useField(() => 'id', undefined)

  function newStatus(event: any, fieldName: string) {
    handleChange(event, true)
    fieldStatus('saved', fieldName)
  }

  const teacherKeys = fieldConfigStore.performerTypeFields('Teacher')

  watchEffect(
    () => {
      let count = 0
      if (teacherStore.unlistedTeacher) {
        for (const key of teacherKeys) {
          if (status[key as keyof Teacher] !== StatusEnum.saved) {
            count++
          }
        }
      } else if (status.id !== StatusEnum.saved) {
        count++
      }
      teacherStore.teacherErrors = count
    }
    // { flush: 'post' }
  )

  onActivated(() => {
    validate()
  })

  onBeforeUnmount(() => {})

  watch(
    () => teacherStore.fieldStatusRef,
    (newStatus, oldStatus) => {
      if (newStatus?.stat === 'remove' && newStatus?.field === 'id') {
        fieldStatus(newStatus.stat, newStatus?.field)
      }
    }
  )

  onDeactivated(async () => {
    console.log('Teacher Deactivated')
    await teacherStore.removeUnlistedTeacher()
  })

  // Adds teacher id to registration store
  // unless it's an unlisted teacher
  // if unlisted then the unlisted teacher watcher will run
  watch(
    () => teacherStore.chosenTeacher,
    async (newTeacher, oldTeacher) => {
      if (newTeacher?.lastName === 'Unlisted') {
        teacherStore.unlistedTeacher = true
        teacherStore.$resetTeacher()
        for (const key of teacherKeys) {
          if (status[key as keyof Teacher] !== StatusEnum.null) {
            status[key as keyof Teacher] = StatusEnum.null
          }
        }
        registrationStore.registration.teacherID = null
        privateTeacher.value =
          appStore.performerType !== 'SCHOOL' ? true : false
        schoolTeacher.value = appStore.performerType === 'SCHOOL' ? true : false
        await teacherStore.createTeacher(
          privateTeacher.value,
          schoolTeacher.value
        )
        registrationStore.registration.teacherID = teacherStore.teacher.id
        teacherStore.findInitialTeacherErrors()
        validate()
        await registrationStore.updateRegistration('teacherID')
        teacherStore.teacherCreated = true
      } else {
        if (
          oldTeacher?.lastName === 'Unlisted' &&
          teacherStore.teacherCreated === true &&
          !teacherStore.emailAlreadyExists
        ) {
          if (teacherStore.teacher.id) {
            await teacherStore.removeTeacherFromDatabaseAndRegistration()
          }
          teacherStore.unlistedTeacher = false
          teacherStore.teacherCreated = false
        }
        registrationStore.registration.teacherID = newTeacher?.id
        await teacherStore.loadTeacher(newTeacher?.id, undefined)
        await registrationStore.updateRegistration('teacherID')
      }
    }
    // { flush: 'post' }
  )

  async function checkForDuplicate() {
    teacherStore.emailAlreadyExists = false
    if (teacherStore.unlistedTeacher === true && teacherStore.teacher.email) {
      teacherStore.duplicateCheck = await teacherStore.duplicateTeacherCheck(
        teacherStore.teacher?.email
      )
      if (teacherStore.duplicateCheck?.id) {
        teacherStore.emailAlreadyExists = true
        toast.warning(
          'Email already exists. Changing the teacher details to an existing teacher if available'
        )
        teacherStore.unlistedTeacher = false
        if (teacherStore.teacher.id) {
          await teacherStore.removeTeacherFromDatabaseAndRegistration()
        }
        registrationStore.registration.teacherID =
          teacherStore.duplicateCheck.id
        await teacherStore.loadTeacher(
          teacherStore.duplicateCheck.id,
          undefined
        )
        if (
          !!teacherStore.teacher.privateTeacher ||
          !!teacherStore.teacher.schoolTeacher
        ) {
          await registrationStore
            .updateRegistration('teacherID')
            .catch((error) => {
              console.log('Error updating registration from teacherID', error)
            })
          teacherStore.chosenTeacher = <FilteredTeacher>(
            teacherStore.allTeachers.find(
              (teacher) => teacher.id === teacherStore.duplicateCheck?.id
            )
          )
        } else {
          toast.error('Teacher must be listed as a private or school teacher.')
          teacherStore.$resetTeacher()
          teacherStore.chosenTeacher = <FilteredTeacher>(
            teacherStore.allTeachers.find((teacher) => teacher.id === 2)
          )
        }
        teacherStore.emailAlreadyExists = false
      }
    }
  }

  const teacherType = computed(() => {
    if (appStore.performerType === 'COMMUNITY') {
      return 'conductor'
    } else {
      return 'teacher'
    }
  })

  const filteredTeachers = ref([] as FilteredTeacher[])
  function search(event: any) {
    filteredTeachers.value = teacherStore.allTeachers.filter((teacher) => {
      return `${teacher.lastName}, ${teacher.firstName}`
        .toLowerCase()
        .includes(event.query.toLowerCase())
    })
  }

  function displayName(teacher: FilteredTeacher) {
    if (teacher?.lastName === 'Unlisted' || teacher?.id === 2) {
      return `${teacher.lastName} ${teacher.firstName}`
    } else {
      return `${teacher?.lastName}, ${teacher?.firstName}`
    }
  }
</script>

<template>
  <div>
    <div class="w-full lg:w-1/2 md:w-3/4 pb-5 z-10 mx-auto">
      <div class="flex justify-between ml-2">
        <div>
          <label class="baseLabel">
            Select a {{ teacherType }} from the list
          </label>
        </div>
        <BaseSaved
          class="mr-2"
          :status="status.id" />
      </div>

      <PrimeAutoComplete
        class="w-full"
        v-model="teacherStore.chosenTeacher"
        dropdown
        forceSelection
        name="id"
        :optionLabel="
          (chosenTeacher: FilteredTeacher) => displayName(chosenTeacher)
        "
        :suggestions="filteredTeachers"
        @complete="search"
        @change="(event: any) => newStatus(event, 'id')">
        <template #option="slotProps">
          <div>
            {{ slotProps.option.lastName }}, {{ slotProps.option.firstName }}
          </div>
        </template>
      </PrimeAutoComplete>
    </div>
    <div
      v-if="teacherStore.unlistedTeacher === true"
      v-auto-animate>
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
          v-if="!schoolTeacher && !communityConductor && teacher"
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
