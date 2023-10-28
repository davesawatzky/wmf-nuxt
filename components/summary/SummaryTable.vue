<script setup lang="ts">
  import { useClasses } from '@/stores/userClasses'
  import { useRegistration } from '@/stores/userRegistration'

  const classesStore = useClasses()
  const registrationStore = useRegistration()

  const totalClassAmt = computed(() => {
    let cost = 0.0
    for (let regClass of classesStore.registeredClasses) {
      cost += Number(regClass.price)
    }
    registrationStore.registration.value.totalAmt = cost
    return cost
  })

  watch(totalClassAmt, async (newAmount) => {
    if (newAmount) {
      await registrationStore.updateRegistration('totalAmt')
    }
  })
</script>

<template>
  <div
    v-auto-animate
    class="w-full mb-4">
    <table
      class="table-auto w-full text-xs sm:text-base border-separate border-spacing-0">
      <thead class="">
        <tr class="text-white print:text-xs">
          <th
            class="text-left bg-sky-700 rounded-tl-lg"
            scope="col">
            Class Number
          </th>
          <th
            class="text-left bg-sky-700"
            scope="col">
            Class Name
          </th>
          <th
            class="text-left bg-sky-700"
            scope="col">
            Level
          </th>
          <th
            class="text-left bg-sky-700"
            scope="col">
            Category
          </th>
          <th
            class="text-left bg-sky-700 rounded-tr-lg"
            scope="col">
            Price
          </th>
        </tr>
      </thead>
      <tbody class="">
        <tr
          v-for="(registeredClass, index) in classesStore.registeredClasses"
          :key="registeredClass.id"
          class="print:text-xs">
          <td
            class="p-8 border-l border-sky-700 bg-white"
            :class="
              index === classesStore.registeredClasses.length - 1
                ? 'border-b rounded-bl-lg'
                : ''
            ">
            {{ registeredClass.classNumber }}
          </td>
          <td
            class="p-8 bg-white"
            :class="
              index === classesStore.registeredClasses.length - 1
                ? 'border-b border-sky-700'
                : ''
            ">
            {{ registeredClass.subdiscipline }}
          </td>
          <td
            class="p-8 bg-white"
            :class="
              index === classesStore.registeredClasses.length - 1
                ? 'border-b border-sky-700'
                : ''
            ">
            {{ registeredClass.level }}
          </td>
          <td
            class="p-8 bg-white"
            :class="
              index === classesStore.registeredClasses.length - 1
                ? 'border-b border-sky-700'
                : ''
            ">
            {{ registeredClass.category }}
          </td>
          <td
            class="p-8 border-r border-sky-700 bg-white"
            :class="
              index === classesStore.registeredClasses.length - 1
                ? 'border-b rounded-br-lg'
                : ''
            ">
            ${{ Number(registeredClass.price).toFixed(2) }}
          </td>
        </tr>
        <tr class="font-bold">
          <td></td>
          <td></td>
          <td></td>
          <td class="text-right">Total:</td>
          <td>
            ${{ Number(registrationStore.registration.totalAmt).toFixed(2) }}
          </td>
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
