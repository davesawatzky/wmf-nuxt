<script lang="ts" setup>
  import * as yup from 'yup'
  import 'yup-phone-lite'
  import { useTeacher } from '@/stores/userTeacher'
  import { useRegistration } from '~/stores/userRegistration'
  import { useAppStore } from '~/stores/appStore'
  import { useUser } from '~/stores/useUser'
  import type { Teacher } from '~/graphql/gql/graphql'
import {useToast} from 'vue-toastification'
  import { provinces } from '#imports'

  interface FilteredTeacher {
    id: number
    firstName: string
    lastName: string
    instrument: string
  }

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
  const privateTeacher = ref(false)
  const schoolTeacher = ref(false)

  const userStore = useUser()
  const toast = useToast()
  const teacherStore = useTeacher()
  const registrationStore = useRegistration()
  const appStore = useAppStore()
  const emailAlreadyExists = ref(false)

  onMounted(async () => {
    if (appStore.performerType === 'SCHOOL') {
      privateTeacher.value = false
      schoolTeacher.value = true
    } else {
      privateTeacher.value = true
      schoolTeacher.value = false
    }
    if (!!registrationStore.registration.teacherID) {
      checkForPassword(registrationStore.registration.teacherID)
    }
  })

  async function checkForPassword(id: number) {
    appStore.teacherHasPassword = await userStore.hasPassword(id)
  }

  const status = reactive<Status>({
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
    instrument: props.modelValue.instrument
      ? StatusEnum.saved
      : StatusEnum.null,
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
      instrument: yup.string().trim().required('Instrument is required'),
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

  const maskaUcaseOption = {
    preProcess: (val: string) => val.toUpperCase(),
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
      teacherRadio.value = 'existing'
    }
  })

  // Working with the new Teacher ComboBox

  const teacherRadio = ref('existing') // 'existing' or 'new'
  const editingDisabled = ref(true)
  // Checks if a newly created record is actually a duplicate
  // of an existing record.
  const duplicateCheck = ref(<Teacher>{})
  // Flag to show if this teacher was just created and
  // did not exist in the user db before now.
  const teacherCreated = ref(false)

  /**
   * Watching the Teacher page action flow
   *
   * Creates a new teacher account when the radio button is pressed.
   * Empty Record is automatically created in the db
   **/
  watch(teacherRadio, async (newValue, oldValue) => {
    if (newValue === 'new') {
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
      newValue === 'existing' &&
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

  // Watches for a change in the teacher
  watch(
    () => registrationStore.registration.teacherID,
    async (newID, oldID) => {
      if (newID !== oldID && !!newID) {
        if (teacherRadio.value === 'existing') {
          await teacherStore.loadTeacher(newID)
        }
        await checkForPassword(newID)
        await registrationStore.updateRegistration('teacherID')
      }
    }
  )

  async function checkForDuplicate() {
    emailAlreadyExists.value = false
    if (teacherRadio.value === 'new' && teacherStore.teacher.email) {
      duplicateCheck.value = await teacherStore.duplicateTeacherCheck(
        teacherStore.teacher?.email
      )
      if (!!duplicateCheck.value.id) {
        emailAlreadyExists.value = true
        toast.warning(
          'Email already exists. Changing the teacher details to an existing teacher if available'
        )
        // TODO: Accidentally runs the watcher
        teacherRadio.value = 'existing'
        await removeTeacher()
        registrationStore.registration.teacherID = duplicateCheck.value.id
        await teacherStore
          .loadTeacher(duplicateCheck.value.id)
          .catch((error) => {
            console.log('Error loading teacher from duplicate id', error)
          })
        await registrationStore
          .updateRegistration('teacherID')
          .catch((error) => {
            console.log('Error updating registration from teacherID', error)
          })
        emailAlreadyExists.value = false
      }
    }
  }

  const query = ref('')
  const filteredTeachers = computed<FilteredTeacher[]>(() => {
    return query.value === ''
      ? teacherStore.allTeachers
      : teacherStore.allTeachers.filter((teacher) => {
          return `${teacher.firstName} ${teacher.lastName}`
            .toLowerCase()
            .includes(query.value.toLowerCase())
        })
  })
  function displayName(id: number): string {
    const teacher = teacherStore.allTeachers.find((item) => item.id === id)
    if (teacher) {
      if (teacher.instrument) {
        return `${teacher?.firstName} ${teacher?.lastName}, ${teacher?.instrument}`
      } else {
        return `${teacher?.firstName} ${teacher?.lastName}`
      }
    }
    return ''
  }
  const fieldsDisabled = computed(() => {
    return teacherRadio.value === 'existing'
  })
</script>

<template>
  <div>
    <div class="pb-5 grid grid-cols-12 gap-x-3 gap-y-1 items-end">
      <div class="z-10 col-span-12">
        <BaseRadio
          v-if="!schoolteacher"
          v-model="teacherRadio"
          class="pb-3"
          :class="!editingDisabled ? 'off' : ''"
          label="Choose a teacher from the list"
          name="teacherRadio"
          :disabled="!editingDisabled"
          value="existing"></BaseRadio>
        <UICombobox
          v-if="!schoolTeacher"
          v-model="registrationStore.registration.teacherID"
          :disabled="!fieldsDisabled || !editingDisabled"
          by="id">
          <UIComboboxInput
            :class="!fieldsDisabled || !editingDisabled ? 'off' : ''"
            :display-value="(id) => displayName(id as number)"
            @change="query = $event.target.value" />
          <UITransitionRoot
            leave="transition ease-in duration-100"
            leave-from="opacity-100"
            leave-to="opacity-0"
            @after-leave="query = ''">
            <UIComboboxOptions
              class="absolute z-90 w-[600px] overflow-hidden mt-1 max-h-60 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <!-- Use the `active` state to conditionally style the active option. -->
              <!-- Use the `selected` state to conditionally style the selected option. -->
              <div
                v-if="filteredTeachers.length === 0 && query !== ''"
                class="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
              <UIComboboxOption
                v-for="teach in filteredTeachers"
                :key="teach.id"
                v-slot="{ active, selected }"
                as="template"
                :value="teach.id">
                <li
                  class="relative cursor-default select-none py-2 pl-10 pr-4"
                  :class="{
                    'bg-sky-500 text-white': active,
                    'text-gray-900': !active,
                  }">
                  <span
                    class="block truncate"
                    :class="{
                      'font-medium': selected,
                      'font-normal': !selected,
                    }">
                    <!-- <CheckIcon v-show="selected" /> -->
                    {{ teach.firstName }}
                    {{ teach.lastName }}
                    <span v-if="teach.instrument"
                      >, {{ teach.instrument }}</span
                    >
                  </span>
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                    :class="{
                      'text-white': active,
                      'text-sky-600': !active,
                    }"></span>
                </li>
              </UIComboboxOption>
            </UIComboboxOptions>
          </UITransitionRoot>
        </UICombobox>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-x-3 gap-y-1 items-end">
      <div class="grid col-span-12 items-center grid-cols-2">
        <div clas="col-span-1">
          <BaseRadio
            v-if="!schoolTeacher"
            v-model="teacherRadio"
            :class="!editingDisabled ? 'off' : ''"
            label="OR enter a new teacher"
            name="teacherRadio"
            :disabled="!editingDisabled"
            value="new" /><br />
          <p v-if="!schoolTeacher">
            <strong>First Name, Last Name,</strong> and
            <strong>Email</strong> must be initially included in a new record,
            otherwise it will not be saved.
          </p>
        </div>
        <div class="col-span-1">
          <BaseToggleB
            v-if="
              teacherRadio === 'existing' &&
              !!registrationStore.registration.teacherID &&
              appStore.teacherHasPassword === false &&
              appStore.performerType !== 'SCHOOL'
            "
            v-model="editingDisabled"
            label="Edit Information">
          </BaseToggleB>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model.trim="contact.firstName"
          :class="fieldsDisabled ? 'off' : ''"
          :status="status.firstName"
          name="firstName"
          type="text"
          label="First Name"
          :disabled="fieldsDisabled"
          @change-status="(stat: string) => fieldStatus(stat, 'firstName')" />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model.trim="contact.lastName"
          :class="fieldsDisabled ? 'off' : ''"
          :status="status.lastName"
          name="lastName"
          type="text"
          label="Last Name"
          :disabled="fieldsDisabled"
          @change-status="(stat: string) => fieldStatus(stat, 'lastName')" />
      </div>
      <div
        v-if="!schoolteacher"
        class="col-span-6 sm:col-span-3">
        <BaseInput
          v-model.trim="contact.apartment"
          :class="fieldsDisabled && editingDisabled ? 'off' : ''"
          :status="status.apartment"
          name="apartment"
          type="text"
          label="Apt."
          :disabled="fieldsDisabled && editingDisabled"
          @change-status="(stat: string) => fieldStatus(stat, 'apartment')" />
      </div>
      <div
        v-if="!schoolteacher"
        class="col-span-6 sm:col-span-3">
        <BaseInput
          v-model.trim="contact.streetNumber"
          :class="fieldsDisabled && editingDisabled ? 'off' : ''"
          :status="status.streetNumber"
          name="streetNumber"
          type="text"
          label="Street #"
          :disabled="fieldsDisabled && editingDisabled"
          @change-status="
            (stat: string) => fieldStatus(stat, 'streetNumber')
          " />
      </div>
      <div
        v-if="!schoolteacher"
        class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model.trim="contact.streetName"
          :class="fieldsDisabled && editingDisabled ? 'off' : ''"
          :status="status.streetName"
          name="streetName"
          type="text"
          label="Street Name"
          :disabled="fieldsDisabled && editingDisabled"
          @change-status="(stat: string) => fieldStatus(stat, 'streetName')" />
      </div>
      <div
        v-if="!schoolteacher"
        class="col-span-8 sm:col-span-7">
        <BaseInput
          v-model.trim="contact.city"
          :class="fieldsDisabled && editingDisabled ? 'off' : ''"
          :status="status.city"
          name="city"
          type="text"
          label="City/Town"
          :disabled="fieldsDisabled && editingDisabled"
          @change-status="(stat: string) => fieldStatus(stat, 'city')" />
      </div>
      <div
        v-if="!schoolteacher"
        class="col-span-4 sm:col-span-2 self-start">
        <BaseSelect
          v-model.trim="contact.province"
          :class="fieldsDisabled && editingDisabled ? 'off' : ''"
          :status="status.province"
          name="province"
          label="Province"
          :options="provinces"
          :disabled="fieldsDisabled && editingDisabled"
          @change-status="(stat: string) => fieldStatus(stat, 'province')" />
      </div>
      <div
        v-if="!schoolteacher"
        class="col-span-6 sm:col-span-3">
        <BaseInput
          v-model.trim="contact.postalCode"
          v-maska:[maskaUcaseOption]
          :class="fieldsDisabled && editingDisabled ? 'off' : ''"
          :status="status.postalCode"
          placeholder="A0A 0A0"
          data-maska="A#A #A#"
          data-maska-tokens="A:[A-Z]"
          data-maska-eager
          name="postalCode"
          type="text"
          label="Postal Code"
          :disabled="fieldsDisabled && editingDisabled"
          @change-status="(stat: string) => fieldStatus(stat, 'postalCode')" />
      </div>
      <div class="col-span-6 sm:col-span-4">
        <BaseInput
          v-model.trim="contact.phone"
          v-maska
          :class="
            fieldsDisabled && editingDisabled && !schoolTeacher ? 'off' : ''
          "
          :status="status.phone"
          placeholder="(___) ___-____"
          data-maska="(###) ###-####"
          data-maska-eager
          name="phone"
          type="tel"
          label="Phone Number"
          :disabled="fieldsDisabled && editingDisabled && !schoolTeacher"
          @change-status="(stat: string) => fieldStatus(stat, 'phone')" />
      </div>
      <div class="col-span-12 sm:col-span-4">
        <BaseInput
          v-model.trim="contact.email"
          :class="fieldsDisabled ? 'off' : ''"
          :status="status.email"
          placeholder="example@email.com"
          name="email"
          type="email"
          label="Email"
          :disabled="fieldsDisabled"
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
          :class="fieldsDisabled && editingDisabled ? 'off' : ''"
          :status="status.instrument"
          name="instrument"
          type="text"
          label="Instrument"
          :disabled="fieldsDisabled && editingDisabled"
          @change-status="(stat: string) => fieldStatus(stat, 'instrument')" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
