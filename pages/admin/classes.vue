<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const registrations = ref()
  const expandedRows = ref()
  const {
    mutate: loadRegistrations,
    onError: loadRegistrationsError,
    onDone: loadRegistrationsDone,
    loading: registrationsLoading,
  } = useMutation(gql`
    query Registrations {
      registrations {
        id
        label
        performerType
        confirmation
        submittedAt
        totalAmt
        payedAmt
        user {
          firstName
          lastName
          email
        }
        performers {
          id
          firstName
          lastName
          age
          instrument
          city
          phone
          email
        }
        registeredClasses {
          id
          classNumber
          subdiscipline
          category
          level
          selections {
            composer
            title
            largerWork
            movement
            composer
            duration
          }
        }
      }
    }
  `)

  loadRegistrationsDone((result) => {
    registrations.value = result.data.registrations
  })

  onMounted(() => {
    loadRegistrations()
  })
</script>

<template>
  <div class="m-4 text-sm border rounded-xl">
    <PrimeDataTable
      v-model:expandedRows="expandedRows"
      dataKey="id"
      :value="registrations"
      scrollable
      scroll-height="600px"
      paginator
      :rows="20"
      :rowsPerPageOptions="[10, 20, 30, 50]"
      resizable-columns
      showGridlines>
      <PrimeColumn
        expander
        class="w-3" />
      <PrimeColumn
        field="id"
        header="ID"
        sortable />
      <PrimeColumn
        field="label"
        header="Label"
        sortable />
      <PrimeColumn
        field="performerType"
        header="Performer Type"
        sortable />
      <PrimeColumn
        field="confirmation"
        header="Confirmation"
        sortable />
      <PrimeColumn
        field="submittedAt"
        header="Submitted At"
        sortable />
      <PrimeColumn
        field="totalAmt"
        header="Total Amount"
        sortable />
      <PrimeColumn
        field="payedAmt"
        header="Payed Amount"
        sortable />
      <PrimeColumn
        field="user.firstName"
        header="User First Name"
        sortable />
      <PrimeColumn
        field="user.lastName"
        header="User Last Name"
        sortable />
      <PrimeColumn
        field="user.email"
        header="Email"
        sortable />
      <template #expansion="slotProps">
        <div class="pl-10">
          <div class="text-lg">Performer(s)</div>
          <PrimeDataTable :value="slotProps.data.performers">
            <PrimeColumn
              field="id"
              header="ID"
              sortable />
            <PrimeColumn
              field="firstName"
              header="First Name"
              sortable />
            <PrimeColumn
              field="lastName"
              header="Last Name"
              sortable />
            <PrimeColumn
              field="age"
              header="Age"
              sortable />
            <PrimeColumn
              field="instrument"
              header="Instrument"
              sortable />
            <PrimeColumn
              field="city"
              header="City"
              sortable />
            <PrimeColumn
              field="phone"
              header="Phone"
              sortable />
            <PrimeColumn
              field="email"
              header="Email"
              sortable />
          </PrimeDataTable>
          <div class="text-lg mt-4">Registered Classes</div>
          <PrimeDataTable :value="slotProps.data.registeredClasses">
            <PrimeColumn
              field="id"
              header="ID"
              sortable />
            <PrimeColumn
              field="classNumber"
              header="Class Number"
              sortable />
            <PrimeColumn
              field="subdiscipline"
              header="Subdiscipline"
              sortable />
            <PrimeColumn
              field="category"
              header="Category"
              sortable />
            <PrimeColumn
              field="level"
              header="Level"
              sortable />
            <PrimeColumn
              field="selections"
              header="Selections">
              <template #body="slotProps">
                <div>
                  <div v-for="selection in slotProps.data.selections">
                    <div v-if="selection.movement && selection.largerWork">
                      {{ selection.title }}, from {{ selection.largerWork }},
                      {{ selection.movement }}, by {{ selection.composer }}.
                      {{ selection.duration }}
                    </div>
                    <div
                      v-else-if="!selection.largerWork && selection.movement">
                      {{ selection.title }}, {{ selection.movement }}, by
                      {{ selection.composer }}. {{ selection.duration }}
                    </div>
                    <div
                      v-else-if="selection.largerWork && !selection.movement">
                      {{ selection.title }}, from {{ selection.largerWork }}, by
                      {{ selection.composer }}. {{ selection.duration }}
                    </div>
                    <div
                      v-else-if="!selection.largerWork && !selection.movement">
                      {{ selection.title }}, by {{ selection.composer }}.
                      Duration: {{ selection.duration }}
                    </div>
                  </div>
                </div>
              </template>
            </PrimeColumn>
          </PrimeDataTable>
        </div>
      </template>
    </PrimeDataTable>
  </div>
</template>

<style lang="css" scoped></style>
