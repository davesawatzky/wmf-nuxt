<script setup lang="ts">
  import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
  import type { Performer, RegisteredClass } from '~/graphql/gql/graphql'

  definePageMeta({
    layout: 'admin',
    middleware: 'admin',
  })

  const selectedPerformer = ref()
  const expandedRows = ref({})
  const expandedRowsSelections = ref({})
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
      query AdminPerformers {
        performers {
          id
          pronouns
          firstName
          lastName
          age
          address
          city
          province
          postalCode
          email
          phone
          instrument
          level
          photoPermission
          otherClasses
          unavailable
          registration {
            id
            confirmation
            photoPermission
            registeredClasses {
              id
              classNumber
              discipline
              subdiscipline
              level
              category
              selections {
                id
                title
                composer
                largerWork
                movement
                duration
              }
            }
          }
        }
      }
    `,
    () => variables.value,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    }
  )

  function clearFilter() {
    initFilters()
  }

  const performers = computed(() => {
    return result.value?.performers || []
  })

  const filters = ref()
  function initFilters() {
    filters.value = {
      global: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      id: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.EQUALS,
          },
        ],
      },
      'registration.confirmation': {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      pronouns: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
          },
        ],
      },
      firstName: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      lastName: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      age: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      address: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      city: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      province: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      postalCode: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
          },
        ],
      },
      email: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      phone: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      instrument: {
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
      photoPermission: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.EQUALS,
          },
        ],
      },
      otherClasses: {
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
        <h3>All Registered Participants</h3>
      </template>
      <template #content>
        <div v-if="loading">Loading...</div>
        <div v-else>
          <PVDataTable
            v-model:expanded-rows="expandedRows"
            v-model:filters="filters"
            v-model:selection="selectedPerformer"
            data-key="id"
            :value="performers"
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
            :total-records="result.performers.length"
            paginator
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown CurrentPageReport"
            current-page-report-template="Showing {first} to {last} of {totalRecords} results.  {totalPages} total pages."
            :rows-per-page-options="[10, 20, 30, 40, 50]"
            :global-filter-fields="[
              'classNumber',
              'discipline',
              'subdiscipline',
              'level',
              'category',
              'id',
              'registration.confirmation',
              'pronouns',
              'firstName',
              'lastName',
              'age',
              'address',
              'city',
              'province',
              'postalCode',
              'email',
              'phone',
              'instrument',
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
            <PVColumn
              field="id"
              header="ID"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by First Name"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn header="Edit">
              <template #body="slotProps">
                <PVButton
                  icon="material-symbols:edit"
                  class="px-2 py-1 w-20"
                  @click="() => (selectedPerformer = slotProps.data)">
                  Edit</PVButton
                >
              </template>
            </PVColumn>
            <PVColumn
              field="firstName"
              header="First Name"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by First Name"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="lastName"
              header="Last Name"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Last Name"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="age"
              header="Age"
              data-type="numeric"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputNumber
                  v-model="filterModel.value"
                  placeholder="Search by Age"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="address"
              header="Address"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Address"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="city"
              header="City"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by City"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="province"
              header="Province"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Province"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="postalCode"
              header="Postal Code"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Postal Code"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="email"
              header="Email"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Email"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="phone"
              header="Phone"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Phone"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="instrument"
              header="Instrument"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Instrument"
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
              field="photoPermission"
              header="Photo Permission"
              data-type="boolean"
              show-clear-button
              sortable />
            <template #expansion="slotProps: { data: Performer }">
              <h5>
                Registered Classes for {{ slotProps.data.firstName }}
                {{ slotProps.data.lastName }},
                {{ slotProps.data.registration?.confirmation }}
              </h5>
              <PVDataTable
                v-model:expanded-rows="expandedRowsSelections"
                :value="slotProps.data.registration?.registeredClasses"
                data-key="id"
                :meta-key-selection="false"
                scrollable
                striped-rows
                removable-sort
                size="small"
                column-resize-mode="fit"
                :rows-per-page-options="[10, 20, 30, 40, 50]"
                datatable-style="min-width: 50rem;">
                <PVColumn
                  expander
                  style="width: 5rem" />
                <PVColumn
                  field="id"
                  header="ID"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="classNumber"
                  header="Class Number"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="discipline"
                  header="Discipline"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="subdiscipline"
                  header="Subdiscipline"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="level"
                  header="Level"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="category"
                  header="Category"
                  data-type="text"
                  sortable />
                <template #expansion="slotProps: { data: RegisteredClass }">
                  <h5>Selections</h5>
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
                      field="largerWork"
                      header="Larger Work"
                      data-type="text"
                      sortable />
                    <PVColumn
                      field="movement"
                      header="Movement"
                      data-type="text"
                      sortable />
                    <PVColumn
                      field="duration"
                      header="Duration (minutes)"
                      data-type="numeric"
                      sortable />
                  </PVDataTable>
                </template>
              </PVDataTable>
            </template>
          </PVDataTable>
        </div>
      </template>
    </PVCard>
  </div>
</template>

<style lang="css" scoped></style>
