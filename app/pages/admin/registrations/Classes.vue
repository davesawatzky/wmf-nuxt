<script setup lang="ts">
  import type {
    DataTableSortEvent,
    DataTablePageEvent,
    DataTableFilterEvent,
  } from 'primevue/datatable'
  // import { RegistrationsDocument } from '~/graphql/gql/graphql'

  definePageMeta({
    layout: 'admin',
  })

  const selectedClass = ref()
  const expandedRows = ref({})
  const pagination = ref({
    currentPage: 1,
    rowsPerPage: 20,
  })
  const sortField = ref()
  const sortOrder = ref('')
  const searchFilters = ref()
  const variables = computed(() => {
    return {
      page: pagination.value.currentPage,
      limit: pagination.value.rowsPerPage,
      sortField: sortField.value,
      sortOrder: sortOrder.value,
      searchFilters: searchFilters.value,
    }
  })
  // const searchTerm = ref('')

  onMounted(() => {
    initFilters()
  })

  const { result, loading, onResult, fetchMore, refetch } = useQuery(
    gql`
      query AdminRegistrations(
        $performerType: PerformerType
        $page: Int
        $limit: Int
        $sortField: String
        $sortOrder: String
        $searchFilters: RegistrationSearchFilters
      ) {
        registrations(
          performerType: $performerType
          page: $page
          limit: $limit
          sortField: $sortField
          sortOrder: $sortOrder
          searchFilters: $searchFilters
        ) {
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
          createdAt
          updatedAt
        }
      }
    `,
    () => variables.value
  )
  onResult(() => {
    console.log('registrations', result.value)
  })

  async function loadMore() {
    await fetchMore({ variables: variables.value })
  }

  async function onSort(event: DataTableSortEvent) {
    sortField.value = event.sortField ?? ''
    // Convert the numeric sort order to string format for your API
    if (event.sortOrder === 1) {
      sortOrder.value = 'asc'
    } else if (event.sortOrder === -1) {
      sortOrder.value = 'desc'
    } else {
      sortOrder.value = ''
      sortField.value = '' // Reset field when unsorted
    }
    pagination.value.currentPage = 1
    console.log(event.sortOrder)
    console.log('Variables:', variables.value)
    await refetch(variables.value)
  }
  async function onPage(event: DataTablePageEvent) {
    pagination.value.currentPage = event.page + 1
    pagination.value.rowsPerPage = event.rows
    await loadMore()
  }
  function onFilter(event: DataTableFilterEvent) {
    debouncedFilter(event)
  }
  const debouncedFilter = useDebounceFn(async (event) => {
    searchFilters.value = event.filters
    console.log('Event Filters:', event.filters)
    // searchTerm.value = event.filters.global.value
    pagination.value.currentPage = 1
    console.log('Search Filter:', searchFilters.value)
    await refetch(variables.value)
  }, 600)

  const filters = ref()
  function initFilters() {
    filters.value = {
      // global: {
      //   operator: 'and',
      //   constraints: [
      //     {
      //       value: '',
      //       matchMode: 'contains',
      //     },
      //   ],
      // },
      id: {
        operator: 'and',
        constraints: [
          {
            value: '',
            matchMode: 'equals',
          },
        ],
      },
      confirmation: {
        operator: 'and',
        constraints: [
          {
            value: '',
            matchMode: 'contains',
          },
        ],
      },
    }
    searchFilters.value = filters.value
  }
</script>

<template>
  <div>
    <PVCard>
      <template #title>
        <h3>Registered Classes</h3>
      </template>
      <template #content>
        <div v-if="loading">Loading...</div>
        <div v-else>
          <PVDataTable
            v-model:expanded-rows="expandedRows"
            v-model:filters="filters"
            v-model:selection="selectedClass"
            selection-mode="single"
            filter-display="menu"
            :value="result?.registrations"
            :resizable-columns="false"
            :pt="{
              pcpaginator: {
                root: {
                  style: 'border-radius: 0px',
                },
              },
            }"
            data-key="id"
            scroll-height="flex"
            sortable
            scrollable
            removable-sort
            size="small"
            column-resize-mode="fit"
            :lazy="true"
            :sort-field="sortField"
            :sort-order="
              sortOrder === 'asc' ? 1 : sortOrder === 'desc' ? -1 : 0
            "
            :meta-key-selection="false"
            :rows="pagination.rowsPerPage"
            paginator
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown CurrentPageReport"
            current-page-report-template="Showing {first} to {last} of {totalRecords} results"
            :rows-per-page-options="[10, 20, 50]"
            datatable-style="min-width: 50rem;"
            @sort="onSort"
            @page="onPage"
            @filter="onFilter">
            <PVColumn
              key="id"
              field="id"
              header="ID"
              sort-field="id"
              filter-field="id"
              data-type="numeric"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputNumber
                  v-model="filterModel.value"
                  type="number"
                  :placeholder="'Search by ID'"
                  @change="filterCallback()"
                  @clear="filterCallback()">
                </PVInputNumber>
              </template>
            </PVColumn>
            <PVColumn
              field="confirmation"
              header="Confirmation"
              sort-field="confirmation"
              data-type="text"
              filter-field="confirmation"
              show-clear-button
              sortable>
              <template #filter="{ filterModel, filterCallback }">
                <PVInputText
                  v-model="filterModel.value"
                  :placeholder="'Search by Confirmation'"
                  @input="filterCallback()">
                </PVInputText>
              </template>
            </PVColumn>
          </PVDataTable>
        </div>
      </template>
    </PVCard>
  </div>
</template>

<style lang="css" scoped></style>
