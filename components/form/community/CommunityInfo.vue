<script lang="ts" setup>
  import * as yup from 'yup'
  import 'yup-phone-lite'
  import { useCommunity } from '@/stores/userCommunity'
  import { provinces } from '#imports'

  const communityStore = useCommunity()

  const status = reactive<Status>({
    name: communityStore.community.name ? StatusEnum.saved : StatusEnum.null,
    streetNumber: communityStore.community.streetNumber
      ? StatusEnum.saved
      : StatusEnum.null,
    streetName: communityStore.community.streetName
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

  async function fieldStatus(stat: string, fieldName: string) {
    await nextTick()
    status[fieldName] = StatusEnum.pending
    await communityStore.updateCommunity(fieldName)
    if (stat === 'saved') status[fieldName] = StatusEnum.saved
    else if (stat === 'remove') status[fieldName] = StatusEnum.removed
    else status[fieldName] = StatusEnum.null
  }

  const validationSchema = toTypedSchema(
    yup.object({
      communityName: yup
        .string()
        .trim()
        .required('Enter the name of the community organization'),
      streetNumber: yup
        .string()
        .trim()
        .max(7, '7 characters maximum')
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
        .email('Please enter a valid email address')
        .required('An email address is required'),
    })
  )

  const { errors, validate } = useForm({
    validationSchema,
    validateOnMount: true,
  })
  onActivated(() => {
    validate()
  })

  const maskaUcaseOption = {
    preProcess: (val: string) => val.toUpperCase(),
  }
</script>

<template>
  <div
    v-auto-animate
    class="pt-8">
    <h2 class="pb-4">Community Information</h2>
    <div class="grid grid-cols-12 gap-x-3 gap-y-2">
      <div class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model="communityStore.community.name"
          :status="status.name"
          name="communityName"
          type="text"
          label="Community Name"
          @change-status="(stat: string) => fieldStatus(stat, 'name')" />
      </div>
      <div class="col-span-4 sm:col-span-3">
        <BaseInput
          v-model.trim="communityStore.community.streetNumber"
          :status="status.streetNumber"
          required
          name="streetNumber"
          type="text"
          label="Street #"
          @change-status="
            (stat: string) => fieldStatus(stat, 'streetNumber')
          " />
      </div>
      <div class="col-span-8 sm:col-span-5">
        <BaseInput
          v-model.trim="communityStore.community.streetName"
          :status="status.streetName"
          requried
          name="streetName"
          type="text"
          label="Street Name"
          @change-status="(stat: string) => fieldStatus(stat, 'streetName')" />
      </div>
      <div class="col-span-12 sm:col-span-4">
        <BaseInput
          v-model.trim="communityStore.community.city"
          :status="status.city"
          required
          name="city"
          type="text"
          label="City/Town"
          @change-status="(stat: string) => fieldStatus(stat, 'city')" />
      </div>
      <div class="col-span-6 sm:col-span-3">
        <BaseSelect
          v-model.trim="communityStore.community.province"
          :status="status.province"
          required
          name="province"
          label="Province"
          :options="provinces"
          @change-status="(stat: string) => fieldStatus(stat, 'province')" />
      </div>
      <div class="col-span-6 sm:col-span-4">
        <BaseInput
          v-model.trim="communityStore.community.postalCode"
          v-maska:[maskaUcaseOption]
          :status="status.postalCode"
          required
          placeholder="A0A 0A0"
          data-maska="A#A #A#"
          data-maska-tokens="A:[A-Z]"
          data-maska-eager
          name="postalCode"
          type="text"
          label="Postal Code"
          @change-status="(stat: string) => fieldStatus(stat, 'postalCode')" />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model.trim="communityStore.community.phone"
          v-maska
          :status="status.phone"
          required
          placeholder="(___) ___-____"
          data-maska="(###) ###-####"
          data-maska-eager
          name="phone"
          type="tel"
          label="Phone Number"
          @change-status="(stat: string) => fieldStatus(stat, 'phone')" />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model.trim="communityStore.community.email"
          v-maska
          :status="status.email"
          required
          placeholder="example@email.com"
          data-maska="a*@a*.a*"
          data-maska-tokens="a:[a-zA-Z0-9]|*:[a-zA-Z0-9._%+-]"
          data-maska-eager
          name="email"
          type="email"
          label="Email Address"
          @change-status="(stat: string) => fieldStatus(stat, 'email')" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
