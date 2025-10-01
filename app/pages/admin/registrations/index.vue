<script setup lang="ts">
  import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
  import type { Registration } from '~/graphql/gql/graphql'

  definePageMeta({
    layout: 'admin',
    middleware: 'admin',
  })

  const selectedRegistration = ref()
  const expandedRows = ref({})
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
      query AdminRegistrations($performerType: PerformerType) {
        registrations(performerType: $performerType) {
          id
          confirmation
          label
          payedAmt
          performerType
          submittedAt
          teacher {
            id
          }
          totalAmt
          transactionInfo
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
              movement
              duration
              largerWork
            }
          }
          user {
            firstName
            lastName
            email
            phone
          }
        }
      }
    `,
    () => variables.value
  )
  // onResult(() => {
  //   console.log('Registrations', result.value)
  // })

  function clearFilter() {
    initFilters()
  }

  const processedRegistrations = computed(() => {
    if (!result.value?.registrations) return []
    return result.value.registrations.map((registration: Registration) => {
      return {
        ...registration,
        submittedAt: registration.submittedAt
          ? new Date(registration.submittedAt)
          : null,
      }
    })
  })

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
      id: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.EQUALS,
          },
        ],
      },
      confirmation: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      performerType: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
          },
        ],
      },
      submittedAt: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.DATE_IS,
          },
        ],
      },
      totalAmt: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.EQUALS,
          },
        ],
      },
      payedAmt: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.EQUALS,
          },
        ],
      },
      transactionInfo: {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      'user.firstName': {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      'user.lastName': {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      'user.email': {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          },
        ],
      },
      'user.phone': {
        operator: FilterOperator.AND,
        constraints: [
          {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
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
        <h3>All Registrations</h3>
      </template>
      <template #content>
        <div v-if="loading">Loading...</div>
        <div v-else>
          <PVDataTable
            v-model:expanded-rows="expandedRows"
            v-model:filters="filters"
            v-model:selection="selectedRegistration"
            data-key="id"
            :value="processedRegistrations"
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
            :total-records="result.registrations.length"
            paginator
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown CurrentPageReport"
            current-page-report-template="Showing {first} to {last} of {totalRecords} results.  {totalPages} total pages."
            :rows-per-page-options="[10, 20, 30, 40, 50]"
            datatable-style="min-width: 50rem;"
            :global-filter-fields="[
              'confirmation',
              'performerType',
              'payedAmt',
              'totalAmt',
              'user.firstName',
              'user.lastName',
              'user.email',
              'user.phone',
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
                  @click="() => (selectedRegistration = slotProps.data)">
                  Edit</PVButton
                >
              </template>
            </PVColumn>
            <PVColumn
              field="id"
              header="ID"
              data-type="numeric"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputNumber
                  v-model="filterModel.value"
                  placeholder="Search by ID"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="confirmation"
              header="Confirm #"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Confirmation #"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="performerType"
              header="Performer Type"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search Type"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="submittedAt"
              header="Submitted"
              data-type="date"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVDatePicker
                  v-model="filterModel.value"
                  placeholder="Search by Submitted Date"
                  @input="filterCallback()" />
              </template>
              <template #body="{ data }">
                <div>
                  {{ formattedDate(data.submittedAt) }}
                </div>
                <div>
                  {{ formattedTime(data.submittedAt) }}
                </div>
              </template>
            </PVColumn>
            <PVColumn
              field="totalAmt"
              header="Total"
              data-type="numeric"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputNumber
                  v-model="filterModel.value"
                  mode="currency"
                  currency="CAD"
                  locale="en-CA"
                  placeholder="Search by Total"
                  @input="filterCallback()" />
              </template>
              <template #body="{ data }">
                <div>
                  {{ formattedCurrency(data.totalAmt) }}
                </div>
              </template>
            </PVColumn>
            <PVColumn
              field="payedAmt"
              header="Paid"
              data-type="numeric"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputNumber
                  v-model="filterModel.value"
                  mode="currency"
                  currency="CAD"
                  locale="en-CA"
                  placeholder="Search by Paid Amount"
                  @input="filterCallback()" />
              </template>
              <template #body="{ data }">
                <div>
                  {{ formattedCurrency(data.payedAmt) }}
                </div>
              </template>
            </PVColumn>
            <PVColumn
              field="transactionInfo"
              header="Transaction Info"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  placeholder="Search by Transaction"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <PVColumn
              field="user.firstName"
              header="User First Name"
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
              field="user.lastName"
              header="User Last Name"
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
              field="user.email"
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
              field="user.phone"
              header="Phone"
              data-type="text"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputMask
                  v-model="filterModel.value"
                  placeholder="(###) ###-####"
                  mask="(999) 999-9999"
                  @input="filterCallback()" />
              </template>
            </PVColumn>
            <template #expansion="slotProps: { data: Registration }">
              <h5>Registered Classes</h5>
              <PVDataTable
                :value="slotProps.data.registeredClasses"
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
              </PVDataTable>
            </template>
          </PVDataTable>
        </div>
      </template>
    </PVCard>
  </div>
</template>

<style lang="css" scoped></style>
