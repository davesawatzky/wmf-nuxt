<script lang="ts" setup>
import type { School } from '~/graphql/gql/graphql'
import * as yup from 'yup'
import { provinces, StatusEnum } from '#imports'
import { useSchool } from '~/stores/useSchool'
import 'yup-phone-lite'

const schoolStore = useSchool()
const fieldConfigStore = useFieldConfig()
const { handleError } = useErrorHandler()

const status = reactive<Status>({
  name: schoolStore.school.name ? StatusEnum.saved : StatusEnum.null,
  division: schoolStore.school.division ? StatusEnum.saved : StatusEnum.null,
  address: schoolStore.school.address ? StatusEnum.saved : StatusEnum.null,
  city: schoolStore.school.city ? StatusEnum.saved : StatusEnum.null,
  province: schoolStore.school.province ? StatusEnum.saved : StatusEnum.null,
  postalCode: schoolStore.school.postalCode
    ? StatusEnum.saved
    : StatusEnum.null,
  phone: schoolStore.school.phone ? StatusEnum.saved : StatusEnum.null,
})

const validationSchema = toTypedSchema(
  yup.object({
    schoolName: yup.string().trim().required('Required'),
    schoolDivision: yup.string().trim().required('Required'),
    address: yup.string().trim().required('Required'),
    city: yup
      .string()
      .trim()
      .max(20, 'Too many characters')
      .required('Required'),
    province: yup.string().max(3).required(),
    postalCode: yup
      .string()
      .trim()
      .matches(
        /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
        'Enter a valid postal code',
      )
      .required('Required'),
    phone: yup
      .string()
      .trim()
      .phone('CA', 'Please enter a valid phone number')
      .required('Required'),
  }),
)

const FIELD_STATUS_MESSAGES: Record<string, { error: string, userMessage: string }> = {
  valid: {
    error: 'Could not update school field',
    userMessage: 'Could not update field.  Please exit and reload Registration',
  },
  invalid: {
    error: 'Could not remove invalid school field',
    userMessage: 'Could not remove invalid field. Please exit and reload Registration',
  },
  removed: {
    error: 'Could not remove school field',
    userMessage: 'Could not remove field.  Please exit and reload Registration',
  },
}

async function fieldStatus(stat: string, fieldName: string) {
  await nextTick()
  const messages = FIELD_STATUS_MESSAGES[stat]
  if (!messages) return

  status[fieldName] = StatusEnum.pending
  const result = await schoolStore.updateSchool(fieldName)
  status[fieldName] = StatusEnum.null

  if (result !== 'complete') {
    handleError(new Error(messages.error), {
      context: {
        fieldName: fieldName,
      },
      operation: 'fieldStatus in SchoolInfo',
      level: 'error',
      toastSeverity: 'error',
      userMessage: messages.userMessage,
    })
    return
  }

  if (stat === 'valid') {
    if (schoolStore.school[fieldName as keyof School] !== null) {
      status[fieldName] = StatusEnum.saved
    }
  }
  else {
    status[fieldName] = StatusEnum.removed
  }
}

const { validate } = useForm({
  validationSchema,
  validateOnMount: true,
})

const schoolKeys = fieldConfigStore.performerTypeFields('School')
watchEffect(() => {
  let count = 0
  for (const key of schoolKeys) {
    if (status[key as keyof School] !== StatusEnum.saved) {
      count++
    }
  }
  schoolStore.schoolErrors = count
})

onActivated(async () => {
  await validate()
})

const maskaUcaseOption = {
  preProcess: (val: string) => val.toUpperCase(),
}
defineExpose({ maskaUcaseOption })
</script>

<template>
  <div
    v-auto-animate
    class="pt-8"
  >
    <h2 class="pb-4">
      School Information
    </h2>
    <div class="grid grid-cols-12 gap-x-3 gap-y-2">
      <div class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model="schoolStore.school.name"
          :status="status.name"
          name="schoolName"
          type="text"
          label="School Name"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'name')
          "
        />
      </div>
      <div class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model="schoolStore.school.division"
          :status="status.division"
          name="schoolDivision"
          label="School Division"
          type="text"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'division')
          "
        />
      </div>
      <div class="col-span-12 sm:col-span-8">
        <BaseInput
          v-model.trim="schoolStore.school.address"
          :status="status.address"
          required
          name="address"
          type="text"
          label="Mailing Address"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'address')
          "
        />
      </div>
      <div class="col-span-8 sm:col-span-4">
        <BaseInput
          v-model.trim="schoolStore.school.city"
          :status="status.city"
          required
          name="city"
          type="text"
          label="City/Town"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'city')
          "
        />
      </div>
      <div class="col-span-4 sm:col-span-3">
        <BaseSelect
          v-model.trim="schoolStore.school.province"
          :status="status.province"
          required
          name="province"
          label="Province"
          :options="provinces"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'province')
          "
        />
      </div>
      <div class="col-span-6 sm:col-span-4">
        <BaseInput
          v-model.trim="schoolStore.school.postalCode"
          v-maska:maskaUcaseOption
          :status="status.postalCode"
          required
          placeholder="A0A 0A0"
          data-maska="A#A #A#"
          data-maska-tokens="A:[A-Z]"
          data-maska-eager
          name="postalCode"
          type="text"
          label="Postal Code"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'postalCode')
          "
        />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model.trim="schoolStore.school.phone"
          v-maska
          :status="status.phone"
          required
          placeholder="(___) ___-____"
          data-maska="(###) ###-####"
          data-maska-eager
          name="phone"
          type="text"
          label="Phone Number"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'phone')
          "
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
