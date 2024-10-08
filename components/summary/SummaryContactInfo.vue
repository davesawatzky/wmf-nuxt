<script setup lang="ts">
  import { useAppStore } from '~/stores/appStore'

  defineProps<{
    contact: ContactInfo
    fullName: string
  }>()

  const appStore = useAppStore()
</script>

<template>
  <BaseSummaryCard>
    <template #heading1>
      <h4 class="text-lg sm:text-xl">
        {{ fullName }}
      </h4>
    </template>
    <template #heading2>
      <div class="text-sm sm:text-base">Phone: {{ contact.phone }}</div>
      <div class="text-sm sm:text-base">Email: {{ contact.email }}</div>
    </template>
    <template
      v-if="appStore.performerType !== 'SCHOOL'"
      #details>
      <div class="flex">
        <table>
          <tbody class="text-sm sm:text-base">
            <tr
              v-if="contact.age"
              class="">
              <td>Age:</td>
              <td>{{ contact.age }}</td>
              <td v-if="contact.instrument">Instrument:</td>
              <td v-if="contact.instrument">
                {{ contact?.instrument }}
              </td>
            </tr>
            <tr class="">
              <td>Mailing Address:</td>
              <td>
                {{ contact.address }}
              </td>
              <td v-if="contact.level">Grade Level:</td>
              <td v-if="contact.level">
                {{ contact.level }}
              </td>
            </tr>
            <tr class="">
              <td />
              <td>
                {{ contact.city }},
                {{ contact.province }}
              </td>
              <td v-if="contact.otherClasses">Other classes:</td>
              <td v-if="contact.otherClasses">
                {{ contact.otherClasses }}
              </td>
            </tr>
            <tr class="">
              <td />
              <td>{{ contact.postalCode }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </BaseSummaryCard>
</template>

<style scoped>
  table {
    table-layout: auto;
    border-collapse: collapse;
  }

  td {
    padding: 0px 8px;
  }
</style>
