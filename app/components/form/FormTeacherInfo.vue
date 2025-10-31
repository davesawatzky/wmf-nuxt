<script lang="ts" setup>
  import * as yup from 'yup'
  import 'yup-phone-lite'
  import { useTeacher } from '~/stores/useTeacher'
  import { useRegistration } from '~/stores/useRegistration'
  import { useAppStore } from '~/stores/appStore'
  import { useUser } from '~/stores/useUser'
  import type { Teacher } from '~/graphql/gql/graphql'
  import { useToast } from 'vue-toastification'
  import { StatusEnum } from '#imports'
  import type { AllTeachers, FilteredTeacher } from '~/stores/useTeacher'

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
  const schoolTeach = ref(false)

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
      schoolTeach.value = true
    } else {
      privateTeacher.value = true
      schoolTeach.value = false
    }
    if (registrationStore.registration.teacherID) {
      const { id, firstName, lastName } = teacherStore.teacher
      // Only set chosenTeacher if all required fields are present
      if (id && firstName && lastName) {
        teacherStore.chosenTeacher = {
          id,
          firstName,
          lastName,
        }
      }
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

  // Does not run when simply changing a teacher from the dropdown
  // only when changing fields in the unlisted teacher form
  async function fieldStatus(stat: string, fieldName: string) {
    if (!teacherStore.emailAlreadyExists) {
      if (!!props.teacherId && fieldName !== 'id') {
        await nextTick()
        if (stat === 'valid') {
          status[fieldName] = StatusEnum.pending
          const result = await teacherStore
            .updateTeacher(fieldName)
            .catch((error) => {
              console.error('Trying to remove non-existant teacher', error)
              stat = ''
            })
          if (result === 'complete') {
            if (contact.value[fieldName as keyof ContactInfo] !== null) {
              status[fieldName] = StatusEnum.saved
            } else {
              toast.error(
                'Could not update field. Please exit and reload Registration'
              )
            }
          }
        } else if (stat === 'invalid') {
          status[fieldName] = StatusEnum.pending
          const result = await teacherStore
            .updateTeacher(fieldName)
            .catch((error) => {
              console.error('Trying to remove non-existant teacher', error)
              stat = ''
            })
          status[fieldName] = StatusEnum.null
          if (result === 'complete') {
            status[fieldName] = StatusEnum.removed
          } else {
            toast.error(
              'Something went wrong. Please exit and reload Registration'
            )
          }
        } else if (stat === 'removed') {
          status[fieldName] = StatusEnum.pending
          const result = await teacherStore
            .updateTeacher(fieldName)
            .catch((error) => {
              console.error('Trying to remove non-existant teacher', error)
              stat = ''
            })
          if (result === 'complete') {
            status[fieldName] = StatusEnum.removed
          } else {
            toast.error(
              'Could not remove field. Plase exit and reload Registrastion'
            )
          }
        }
      }
    }
  }

  const { validate } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  const { handleChange } = useField(() => 'id', undefined)
  async function newStatus(event: Event, fieldName: string) {
    handleChange(event, true)
    await fieldStatus('valid', fieldName)
  }

  onActivated(async () => {
    const teacherType =
      props.schoolTeacher || props.communityConductor
        ? 'schoolTeacher'
        : 'privateTeacher'
    teacherStore.loadAllTeachers(teacherType)
    teacherStore.runRemovalHook = true
    validate()
  })

  onDeactivated(async () => {
    await teacherStore.removeUnlistedTeacherOnDeactivate()
  })

  onBeforeUnmount(async () => {
    await teacherStore.removeUnlistedTeacherBeforeUnmount()
  })

  const teacherKeys = fieldConfigStore.performerTypeFields('Teacher')

  // teacherErrors is now computed in the store - no manual updates needed!
  // The store automatically recalculates based on teacher.value changes

  watch(
    () => teacherStore.fieldStatusRef,
    async (newStatus) => {
      if (newStatus?.stat === 'removed' && newStatus?.field === 'id') {
        await fieldStatus(newStatus.stat, newStatus?.field)
      }
    }
  )

  // Adds teacher id to registration store
  // unless it's an unlisted teacher
  // if unlisted then the unlisted teacher watcher will run
  async function changeChosenTeacher(newTeacher: AllTeachers) {
    if (newTeacher?.lastName === 'Unlisted') {
      // turns everything null or default to
      // give a clean slate for a new teacher
      teacherStore.unlistedTeacher = true
      teacherStore.$resetTeacher()
      for (const key of teacherKeys) {
        if (status[key as keyof Teacher] !== StatusEnum.null) {
          status[key as keyof Teacher] = StatusEnum.null
        }
      }
      registrationStore.registration.teacherID = null

      // new blank teacher record is created
      await teacherStore.createTeacher(privateTeacher.value, schoolTeach.value)
      registrationStore.registration.teacherID = props.teacherId
      validate()
      await registrationStore.updateRegistration('teacherID')
      teacherStore.teacherCreated = true
      // new teacher creation is complete
      // teacherErrors automatically computed from new teacher state
    } else {
      // Otherwise
      if (
        // if we're coming from a dirty unlisted teacher
        // remove the unlisted teacher from the database
        teacherStore.unlistedTeacher &&
        teacherStore.teacherCreated &&
        !teacherStore.emailAlreadyExists
      ) {
        if (props.teacherId) {
          await teacherStore.removeTeacherFromDatabaseAndRegistration()
        }
        // Cancels signs of new teacher creation
        teacherStore.unlistedTeacher = false
        teacherStore.teacherCreated = false
      }

      // Now we load the existing teacher record from the db.
      // and update the registration
      //TODO: Props.teacherId can be undefined here?
      registrationStore.registration.teacherID = newTeacher?.id
      await teacherStore.loadTeacher(newTeacher?.id, undefined)
      await registrationStore.updateRegistration('teacherID')
      teacherStore.emailAlreadyExists = false

      // Update statuses for pre-defined teacher
      // This ensures teacherErrors is reset to 0
      await nextTick()
      status.id = StatusEnum.saved
      status.firstName = teacherStore.teacher.firstName
        ? StatusEnum.saved
        : StatusEnum.null
      status.lastName = teacherStore.teacher.lastName
        ? StatusEnum.saved
        : StatusEnum.null
      status.email = teacherStore.teacher.email
        ? StatusEnum.saved
        : StatusEnum.null
      status.phone = teacherStore.teacher.phone
        ? StatusEnum.saved
        : StatusEnum.null
      if (teacherStore.teacher.instrument) {
        status.instrument = StatusEnum.saved
      }

      // Trigger validation to ensure form state is updated
      validate()
    }
  }

  watch(
    () => teacherStore.teacher.id,
    (newTeacherId, oldTeacherId) => {
      if (newTeacherId !== oldTeacherId && newTeacherId !== props.teacherId) {
        // Update status to reflect the new teacher
        if (newTeacherId) {
          status.id = StatusEnum.saved
        } else {
          status.id = StatusEnum.null
        }
      }
    },
    { immediate: true }
  )

  async function checkForDuplicate() {
    teacherStore.emailAlreadyExists = false
    if (teacherStore.unlistedTeacher === true && teacherStore.teacher.email) {
      teacherStore.duplicateCheck = await teacherStore.duplicateTeacherCheck(
        teacherStore.teacher?.email
      )
      if (
        teacherStore.duplicateCheck?.id &&
        teacherStore.duplicateCheck?.id !== props.teacherId
      ) {
        teacherStore.emailAlreadyExists = true
        toast.warning(
          'Email already exists. Changing the teacher details to an existing teacher if available'
        )
        teacherStore.unlistedTeacher = false
        if (props.teacherId) {
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
              console.error(error)
            })
          teacherStore.chosenTeacher = teacherStore.allTeachers.find(
            (teacher) => teacher.id === teacherStore.duplicateCheck?.id
          ) as FilteredTeacher
        } else {
          toast.error('Teacher must be listed as a private or school teacher.')
          teacherStore.$resetTeacher()
          teacherStore.chosenTeacher = teacherStore.allTeachers.find(
            (teacher) => teacher.id === 2
          ) as FilteredTeacher
        }
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
  function search(event: { query: string }) {
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

      <PVAutoComplete
        v-model="teacherStore.chosenTeacher"
        class="w-full"
        dropdown
        force-selection
        name="id"
        :option-label="
          (filteredTeacher: FilteredTeacher) => displayName(filteredTeacher)
        "
        :suggestions="filteredTeachers"
        @complete="search"
        @option-select="
          async (event: any) => {
            await changeChosenTeacher(event.value)
            await newStatus(event.value, 'id')
          }
        ">
        <template #option="slotProps">
          <div>
            {{ slotProps.option.lastName }}, {{ slotProps.option.firstName }}
          </div>
        </template>
      </PVAutoComplete>
    </div>
    <div
      v-if="teacherStore.unlistedTeacher"
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
            @change-status="
              async (stat: string) => await fieldStatus(stat, 'firstName')
            " />
        </div>
        <div class="col-span-12 sm:col-span-6">
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
            @change-status="
              async (stat: string) => await fieldStatus(stat, 'phone')
            " />
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
              async (stat: string) => {
                await checkForDuplicate()
                await fieldStatus(stat, 'email')
              }
            " />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
