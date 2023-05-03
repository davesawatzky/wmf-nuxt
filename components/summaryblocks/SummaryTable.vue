<script setup lang="ts">
  import { useClasses } from '@/stores/userClasses'
  import { useRegistration } from '@/stores/userRegistration'

  const classesStore = useClasses()
  const registrationStore = useRegistration()

  const total = computed(() => {
    let cost = 0
    for (const registeredClass of classesStore.registeredClasses) cost += registeredClass.price

    return +cost
  })
  registrationStore.registrations[0].totalAmt = total.value ?? 0.0
</script>

<template>
  <div
    v-auto-animate
    class="w-full mb-4">
    <table
      class="table-auto border-b border-sky-500 divide-y divide-sky-600 w-full border-collapse text-xs sm:text-base">
      <thead class="">
        <tr class="bg-sky-500 text-white print:text-xs">
          <th
            class="rounded-tl-lg text-left"
            scope="col">
            Class Number
          </th>
          <th
            class="text-left"
            scope="col">
            Class Name
          </th>
          <th
            class="text-left"
            scope="col">
            Level
          </th>
          <th
            class="text-left"
            scope="col">
            Category
          </th>
          <th
            class="rounded-tr-lg text-left"
            scope="col">
            Price
          </th>
        </tr>
      </thead>
      <tbody
        v-auto-animate
        class="bg-white divide-y divide-sky-600 border-b border-sky-500 rounded-bl-lg rounded-br-lg">
        <tr
          v-for="registeredClass in classesStore.registeredClasses"
          :key="registeredClass.classNumber"
          class="border-b border-r border-l border-sky-500 print:text-xs">
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
      </tbody>
    </table>
    <div class="container p-2 font-bold flex justify-end">
      <p class="">Total: ${{ total }}.00</p>
    </div>
  </div>
</template>

<style scoped>
  th,
  td {
    padding: 0.25rem;
  }
</style>
