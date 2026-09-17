<script lang="ts" setup>
import type { Community } from '~/graphql/gql/graphql'
import * as yup from 'yup'
import { provinces } from '#imports'
import { useCommunity } from '~/stores/useCommunity'
import 'yup-phone-lite'

const communityStore = useCommunity()
const fieldConfigStore = useFieldConfig()
const { handleError } = useErrorHandler()

const status = reactive<Status>({
  name: communityStore.community.name ? StatusEnum.saved : StatusEnum.null,
  address: communityStore.community.address
    ? StatusEnum.saved
    : StatusEnum.null,
  city: communityStore.community.city ? StatusEnum.saved : StatusEnum.null,
  province: communityStore.community.province
    ? StatusEnum.saved
    : StatusEnum.null,
  postalCode: communityStore.community.postalCode
    ? StatusEnum.saved
    : StatusEnum.null,
  phone: communityStore.community.phone ? StatusEnum.saved : StatusEnum.null,
  email: communityStore.community.email ? StatusEnum.saved : StatusEnum.null,
})

const FIELD_STATUS_MESSAGES: Record<string, { error: string, userMessage: string }> = {
  valid: {
    error: 'Could not update community field',
    userMessage: 'Could not update field.  Please exit and reload Registration',
  },
  invalid: {
    error: 'Could not remove invalid community field',
    userMessage: 'Could not remove invalid field. Please exit and reload Registration',
  },
  removed: {
    error: 'Could not remove community field',
    userMessage: 'Could not remove field.  Please exit and reload Registration',
  },
}

async function fieldStatus(stat: string, fieldName: string) {
  await nextTick()
  const messages = FIELD_STATUS_MESSAGES[stat]
  if (!messages) return

  status[fieldName] = StatusEnum.pending
  const result = await communityStore.updateCommunity(fieldName)
  status[fieldName] = StatusEnum.null

  if (result !== 'complete') {
    handleError(new Error(messages.error), {
      context: {
        fieldName: fieldName,
      },
      operation: 'fieldStatus in CommunityInfo',
      level: 'error',
      toastSeverity: 'error',
      userMessage: messages.userMessage,
    })
    return
  }

  if (stat === 'valid') {
    if (communityStore.community[fieldName as keyof Community] !== null) {
      status[fieldName] = StatusEnum.saved
    }
  }
  else {
    status[fieldName] = StatusEnum.removed
  }
}

const validationSchema = toTypedSchema(
  yup.object({
    communityName: yup.string().trim().required('Required'),
    address: yup.string().trim().required(),
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
    email: yup
      .string()
      .trim()
      .email('Please enter a valid email address')
      .required('Required'),
  }),
)

const { validate } = useForm({
  validationSchema,
  validateOnMount: true,
})
onMounted(() => {
  validate()
})
onActivated(() => {
  validate()
})

const communityKeys = fieldConfigStore.performerTypeFields('Community')
watchEffect(
  () => {
    let count = 0
    for (const key of communityKeys) {
      if (status[key as keyof Community] !== StatusEnum.saved) {
        count++
      }
    }
    communityStore.communityErrors = count
  },
  { flush: 'post' },
)

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
      Community Information
    </h2>
    <div class="grid grid-cols-12 gap-x-3 gap-y-2">
      <div class="col-span-12 md:col-span-6">
        <BaseInput
          v-model="communityStore.community.name"
          :status="status.name"
          name="communityName"
          type="text"
          label="Community Name"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'name')
          "
        />
      </div>
      <div class="col-span-12 sm:col-span-8 md:col-span-6">
        <BaseInput
          v-model.trim="communityStore.community.address"
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
      <div class="col-span-6 sm:col-span-4 md:col-span-5">
        <BaseInput
          v-model.trim="communityStore.community.city"
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
      <div class="col-span-6 sm:col-span-3 md:col-span-3">
        <BaseSelect
          v-model.trim="communityStore.community.province"
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
          v-model.trim="communityStore.community.postalCode"
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
      <div class="col-span-6 sm:col-span-5 md:col-span-6">
        <BaseInput
          v-model.trim="communityStore.community.phone"
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
      <div class="col-span-12 sm:col-span-12 md:col-span-6">
        <BaseInput
          v-model.trim="communityStore.community.email"
          :status="status.email"
          required
          placeholder="example@email.com"
          name="email"
          type="email"
          label="Email Address"
          @change-status="
            async (stat: string) => await fieldStatus(stat, 'email')
          "
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
