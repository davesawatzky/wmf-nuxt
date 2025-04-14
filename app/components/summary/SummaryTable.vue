<script setup lang="ts">
  import { useClasses } from '~/stores/useClasses'
  import { useRegistration } from '~/stores/useRegistration'
  import { now } from 'lodash'

  const classesStore = useClasses()
  const registrationStore = useRegistration()
  const communityGroupStore = useCommunityGroup()
  const schoolGroupStore = useSchoolGroup()
  const appStore = useAppStore()
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
            v-if="
              appStore.performerType === 'SCHOOL' ||
              appStore.performerType === 'COMMUNITY'
            "
            class="text-left bg-sky-700"
            scope="col">
            Group
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
            class="p-2 border-l border-b border-sky-700 bg-white"
            :class="
              index === classesStore.registeredClasses.length - 1
                ? 'border-b rounded-bl-lg'
                : ''
            ">
            {{ registeredClass.classNumber }}
          </td>
          <td
            class="p-2 border-b border-sky-700 bg-white"
            :class="
              index === classesStore.registeredClasses.length - 1
                ? 'border-b border-sky-700'
                : ''
            ">
            {{ registeredClass.subdiscipline }}
          </td>
          <td
            class="p-2 border-b border-sky-700 bg-white"
            :class="
              index === classesStore.registeredClasses.length - 1
                ? 'border-b border-sky-700'
                : ''
            ">
            {{ registeredClass.level }}
          </td>
          <td
            v-if="appStore.performerType === 'SCHOOL'"
            class="p-2 border-b border-sky-700 bg-white"
            :class="
              index === classesStore.registeredClasses.length - 1
                ? 'border-b border-sky-700'
                : ''
            ">
            {{
              schoolGroupStore.schoolGroup.find(
                (item) => item.id === registeredClass.schoolGroupID
              )?.name
            }}
          </td>
          <td
            v-if="appStore.performerType === 'COMMUNITY'"
            class="p-2 border-b border-sky-700 bg-white"
            :class="
              index === classesStore.registeredClasses.length - 1
                ? 'border-b border-sky-700'
                : ''
            ">
            {{
              communityGroupStore.communityGroup.find(
                (item) => item.id === registeredClass.communityGroupID
              )?.name
            }}
          </td>
          <td
            class="p-2 border-b border-sky-700 bg-white"
            :class="
              index === classesStore.registeredClasses.length - 1
                ? 'border-b border-sky-700'
                : ''
            ">
            {{ registeredClass.category }}
          </td>
          <td
            class="p-2 border-b border-r border-sky-700 bg-white"
            :class="
              index === classesStore.registeredClasses.length - 1
                ? 'border-b rounded-br-lg'
                : ''
            ">
            ${{ Number(registeredClass.price).toFixed(2) }}
          </td>
        </tr>
        <tr
          v-if="Number(registrationStore.lateRegistrationFee()) > 0"
          class="">
          <td />
          <td
            v-if="
              appStore.performerType === 'SCHOOL' ||
              appStore.performerType === 'COMMUNITY'
            " />
          <td />
          <td />
          <td class="text-right">Late Fee:</td>
          <td class="pl-2">${{ registrationStore.lateRegistrationFee() }}</td>
        </tr>
        <tr class="font-bold">
          <td />
          <td
            v-if="
              appStore.performerType === 'SCHOOL' ||
              appStore.performerType === 'COMMUNITY'
            " />
          <td />
          <td />
          <td class="text-right">Total:</td>
          <td class="pl-2">${{ registrationStore.totalClassAmt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
  th {
    padding: 8px 6px;
  }
</style>
