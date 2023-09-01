<script setup lang="ts">
  import type { ContactInfo } from '~/composables/types'

  defineProps<{
    contact: ContactInfo
    fullName: string
  }>()
</script>

<template>
  <BaseSummaryCard>
    <template #heading1>
      <h4>{{ fullName }}</h4>
    </template>
    <template #heading2>
      <div>Phone: {{ contact.phone }}</div>
      <div>Email: {{ contact.email }}</div>
    </template>
    <template #details>
      <div class="flex">
        <table>
          <tbody>
            <tr
              v-if="contact.age"
              class="border-sky-400">
              <td>Age:</td>
              <td>{{ contact.age }}</td>
              <td v-if="contact.instrument">Instrument:</td>
              <td v-if="contact.instrument">{{ contact?.instrument }}</td>
            </tr>
            <tr class="border-sky-400">
              <td>Address:</td>
              <td v-if="contact.apartment">
                {{ contact.apartment }} - {{ contact?.streetNumber }}
                {{ contact.streetName }}
              </td>
              <td v-else>
                {{ contact.streetNumber }} {{ contact.streetName }}
              </td>
              <td v-if="contact.level">Grade Level:</td>
              <td v-if="contact.level">{{ contact.level }}</td>
            </tr>
            <tr class="border-sky-400">
              <td></td>
              <td>
                {{ contact.city }},
                {{ contact.province }}
              </td>
              <td v-if="contact.otherClasses">
                Participating in other classes:
              </td>
              <td v-if="contact.otherClasses">{{ contact.otherClasses }}</td>
            </tr>
            <tr class="border-sky-400">
              <td></td>
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

  tr {
    border-bottom-width: 1px;
  }

  td {
    padding: 4px 8px;
  }
</style>
