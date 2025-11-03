<script setup lang="ts">
  import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
  import type {
    Performer,
    RegisteredClass,
    Registration,
    Teacher,
  } from '~/graphql/gql/graphql'

  definePageMeta({
    layout: 'admin',
    middleware: 'admin',
  })

  const selectedTeacher = ref()
  const expandedRows = ref({})
  const expandedRowsRegistrations = ref({})
  const pagination = ref({
    currentPage: 1,
    rowsPerPage: 20,
  })

  const variables = computed(() => {
    return {
      offset: (pagination.value.currentPage - 1) * pagination.value.rowsPerPage,
      limit: pagination.value.rowsPerPage,
      teacherType: 'privateTeacher',
    }
  })

  onBeforeMount(() => {
    initFilters()
  })

  const { result, loading, refetch } = useQuery(
    gql`
      query AdminPrivateTeachers($teacherType: String!) {
        teachers(teacherType: $teacherType) {
          id
          firstName
          lastName
          address
          city
          province
          postalCode
          email
          phone
          instrument
          registrations {
            id
            confirmation
            user {
              id
              firstName
              lastName
              email
              phone
            }
            performers {
              id
              firstName
              lastName
              email
              phone
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
            matchMode: FilterMatchMode.EQUALS,
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
            matchMode: FilterMatchMode.STARTS_WITH,
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
        <h3>All Private Teachers</h3>
      </template>
      <template #content>
        <div v-if="loading">Loading...</div>
        <div v-else>
          <PVDataTable
            v-model:expanded-rows="expandedRows"
            v-model:filters="filters"
            v-model:selection="selectedTeacher"
            data-key="id"
            :value="result.teachers"
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
            :total-records="result.teachers.length"
            paginator
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown CurrentPageReport"
            current-page-report-template="Showing {first} to {last} of {totalRecords} results.  {totalPages} total pages."
            :rows-per-page-options="[10, 20, 30, 40, 50]"
            datatable-style="min-width: 50rem;"
            :global-filter-fields="[
              'id',
              'firstName',
              'lastName',
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
                  @click="() => (selectedTeacher = slotProps.data)">
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
              field="address"
              header="Address"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputNumber
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
                  placeholder="Search by Prov"
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
                <PVInputMask
                  v-model="filterModel.value"
                  placeholder="(999) 999-9999"
                  mask="(999) 999-9999"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <template #expansion="slotProps: { data: Teacher }">
              <h5>
                Registrations with students of {{ slotProps.data.firstName }}
                {{ slotProps.data.lastName }}
              </h5>
              <PVDataTable
                v-model:expanded-rows="expandedRowsRegistrations"
                :value="slotProps.data.registrations"
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
                  field="confirmation"
                  header="Confirmation"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="user.firstName"
                  header="User First Name"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="user.lastName"
                  header="User Last Name"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="user.email"
                  header="User Email"
                  data-type="text"
                  sortable />
                <PVColumn
                  field="user.phone"
                  header="User Phone"
                  data-type="text"
                  sortable />
                <template #expansion="slotProps: { data: Registration }">
                  <h5>Student Names</h5>
                  <PVDataTable
                    :value="slotProps.data.performers"
                    data-key="id"
                    scrollable
                    striped-rows
                    removable-sort
                    size="small"
                    column-resize-mode="fit"
                    :rows-per-page-options="[10, 20, 30, 40, 50]"
                    datatable-style="min-width: 50rem;">
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
                      field="email"
                      header="Email"
                      data-type="text"
                      sortable />
                    <PVColumn
                      field="phone"
                      header="Phone"
                      data-type="text"
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
