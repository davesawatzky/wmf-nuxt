<script setup lang="ts">
  import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
  import type { RegisteredClass } from '~/graphql/gql/graphql'

  definePageMeta({
    layout: 'admin',
    middleware: 'admin',
  })

  const selectedClass = ref()
  const expandedRows = ref({})
  const expandedRowSelections = ref({})
  const pagination = ref({
    currentPage: 1,
    rowsPerPage: 20,
  })

  const variables = computed(() => {
    return {
      offset: (pagination.value.currentPage - 1) * pagination.value.rowsPerPage,
      limit: pagination.value.rowsPerPage,
    }
  })

  onBeforeMount(() => {
    initFilters()
  })

  const { result, loading, refetch } = useQuery(
    gql`
      query AdminRegisteredClasses {
        registeredClasses {
          classNumber
          discipline
          subdiscipline
          category
          level
          performers {
            id
            pronouns
            firstName
            lastName
            age
            instrument
            level
            email
            phone
            # selections {
            #   id
            #   title
            #   composer
            #   movement
            #   largerWork
            #   duration
            # }
          }
        }
      }
    `,
    () => variables.value
  )
  // onResult(() => {
  //   console.log('Registered Classes', result.value)
  // })

  function clearFilter() {
    initFilters()
  }

  const filters = ref()
  function initFilters() {
    filters.value = {
      global: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      // performerType: {
      //   operator: FilterOperator.AND,
      //   constraints: [
      //     {
      //       value: null,
      //       matchMode: FilterMatchMode.STARTS_WITH,
      //     },
      //   ],
      // },
      classNumber: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
          },
        ],
      },
      discipline: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      subdiscipline: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      category: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      level: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
    }
  }

  // Process data for date filtering
  // Changes date and time formats in submittedAt
  // from string to timestamp for proper filtering
  // const processedRegistrations = computed(() => {
  //   if (!result.value?.registrations) return []
  //   const registrations = result.value.registrations.filter(
  //     (registration: Registration) => {
  //       return registration.confirmation !== null
  //     }
  //   )
  //   console.log('Registrations: ', registrations)
  //   const newData = extractNestedValues(registrations, 'registeredClasses')
  //   console.log(Array.from(newData))
  //   return Array.from(newData)
  // })
</script>

<template>
  <div>
    <PVCard>
      <template #title>
        <h3>All Registered Classes</h3>
      </template>
      <template #content>
        <div v-if="loading">Loading...</div>
        <div v-else>
          <PVDataTable
            v-model:expanded-rows="expandedRows"
            v-model:filters="filters"
            v-model:selection="selectedClass"
            data-key="classNumber"
            :value="result.registeredClasses"
            :pt="{
              pcpaginator: {
                root: {
                  style: 'border-radius: 0px',
                },
              },
            }"
            filter-display="menu"
            selection-mode="single"
            resizable-columns
            reorderable-columns
            scroll-height="flex"
            sortable
            sort-mode="multiple"
            removable-sort
            show-gridlines
            scrollable
            striped-rows
            size="small"
            column-resize-mode="fit"
            :meta-key-selection="false"
            :rows="pagination.rowsPerPage"
            :total-records="result.registeredClasses.length"
            paginator
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown CurrentPageReport"
            current-page-report-template="Showing {first} to {last} of {totalRecords} results.  {totalPages} total pages."
            :rows-per-page-options="[10, 20, 30, 40, 50]"
            datatable-style="min-width: 50rem;"
            :global-filter-fields="[
              'classNumber',
              'discipline',
              'subdiscipline',
              'level',
              'category',
            ]">
            <template #header>
              <div class="flex justify-between">
                <PVButton
                  type="button"
                  label="Clear All"
                  outlined
                  @click="clearFilter()">
                  <template #icon>
                    <Icon
                      name="mdi:filter-remove"
                      size="1.25rem" />
                  </template>
                </PVButton>
                <PVIconField>
                  <PVInputIcon>
                    <Icon
                      name="fluent:search-20-filled"
                      size="1.25rem" />
                  </PVInputIcon>
                  <PVInputText
                    v-model="filters['global'].value"
                    placeholder="Keyword Search" />
                </PVIconField>
              </div>
            </template>
            <template #empty> No items found. </template>
            <PVColumn
              expander
              style="width: 5rem" />
            <PVColumn header="Edit">
              <template #body="slotProps">
                <PVButton
                  icon="material-symbols:edit"
                  class="px-2 py-1 w-20"
                  @click="() => (selectedClass = slotProps.data)">
                  Edit</PVButton
                >
              </template>
            </PVColumn>
            <PVColumn
              field="classNumber"
              header="Class Number"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Class Number"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="discipline"
              header="Discipline"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Discipline"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="subdiscipline"
              header="Subdiscipline"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Subdiscipline"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="level"
              header="Level"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Level"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="category"
              header="Category"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Category"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <template #expansion="slotProps: { data: RegisteredClass }">
              <h5>
                Performers for Class {{ slotProps.data.classNumber }},
                {{ slotProps.data.subdiscipline }}, {{ slotProps.data.level }},
                {{ slotProps.data.category }}
              </h5>
              <PVDataTable
                v-model:expanded-rows="expandedRowSelections"
                :value="slotProps.data.performers"
                data-key="id"
                :meta-key-selection="false"
                scrollable
                striped-rows
                removable-sort
                size="small"
                column-resize-mode="fit"
                :rows-per-page-options="[10, 20, 30, 40, 50]"
                datatable-style="min-width: 50rem;">
                <!-- <PVColumn
                  expander
                  style="width: 5rem" /> -->
                <PVColumn
                  field="id"
                  header="ID"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="firstName"
                  header="First Name"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="lastName"
                  header="Last Name"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="age"
                  header="Age"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="instrument"
                  header="Instrument"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="level"
                  header="Level"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="email"
                  header="Email"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="phone"
                  header="Phone"
                  data-type="text"
                  sortable />
                <!-- <template #expansion="slotProps: { data: Performer }">
                  <h5>
                    Selections for {{ slotProps.data.firstName }}
                    {{ slotProps.data.lastName }}
                  </h5>
                  <PVDataTable
                    :value="slotProps.data.selections"
                    data-key="id"
                    scrollable
                    striped-rows
                    removable-sort
                    size="small"
                    column-resize-mode="fit"
                    :rows-per-page-options="[10, 20, 30, 40, 50]"
                    datatable-style="min-width: 50rem;">
                    <PVColumn
                      field="id"
                      header="ID"
                      data-type="text"
                      sortable />
                    <PVColumn
                      field="title"
                      header="Title"
                      data-type="text"
                      sortable />
                    <PVColumn
                      field="composer"
                      header="Composer"
                      data-type="text"
                      sortable />
                    <PVColumn
                      field="movement"
                      header="Movement"
                      data-type="text"
                      sortable />
                    <PVColumn
                      field="largerWork"
                      header="Larger Work"
                      data-type="text"
                      sortable />
                    <PVColumn
                      field="duration"
                      header="Duration (minutes)"
                      data-type="text"
                      sortable />
                  </PVDataTable>
                </template> -->
              </PVDataTable>
            </template>
          </PVDataTable>
        </div>
      </template>
    </PVCard>
  </div>
</template>

<style lang="css" scoped></style>
