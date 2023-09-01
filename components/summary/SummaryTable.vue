<script setup lang="ts">
  import { useClasses } from '@/stores/userClasses'
  import { useRegistration } from '@/stores/userRegistration'

  const classesStore = useClasses()
  const registrationStore = useRegistration()

  const total = computed(() => {
    let cost = 0
    for (const registeredClass of classesStore.registeredClasses) {
      cost += registeredClass.price
    }
    return +cost
  })
  registrationStore.registration.totalAmt = total.value ?? 0.0
</script>

<template>
  <div
    v-auto-animate
    class="w-full mb-4">
    <table
      class="table-auto border-separate border-spacing-0 w-full text-xs sm:text-base">
      <thead class="">
        <tr class="text-white print:text-xs">
          <th
            class="text-left border border-sky-700 bg-sky-700 rounded-tl-lg"
            scope="col">
            Class Number
          </th>
          <th
            class="text-left border border-sky-700 bg-sky-700"
            scope="col">
            Class Name
          </th>
          <th
            class="text-left border border-sky-700 bg-sky-700"
            scope="col">
            Level
          </th>
          <th
            class="text-left border border-sky-700 bg-sky-700"
            scope="col">
            Category
          </th>
          <th
            class="text-left border border-sky-700 bg-sky-700 rounded-tr-lg"
            scope="col">
            Price
          </th>
        </tr>
      </thead>
      <tbody v-auto-animate>
        <tr
          v-for="registeredClass in classesStore.registeredClasses"
          :key="registeredClass.id"
          class="print:text-xs bg-white">
          <td class="p-8">
            {{ registeredClass.classNumber }}
          </td>
          <td class="p-8">
            {{ registeredClass.subdiscipline }}
          </td>
          <td class="p-8">
            {{ registeredClass.level }}
          </td>
          <td class="p-8">
            {{ registeredClass.category }}
          </td>
          <td class="p-8">${{ registeredClass.price }}.00</td>
        </tr>
        <tr class="font-bold">
          <td></td>
          <td></td>
          <td></td>
          <td class="text-right">Total:</td>
          <td>${{ total }}.00</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
  th {
    padding: 8px 6px;
  }
  td {
    padding: 8px 6px;
  }
</style>
