<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
    middleware: 'admin',
  })

  const documentStore = useDocumentStore()
  const { template, jsonData } = storeToRefs(documentStore)
  const templateString = `<div>{{#each teachers}}</div>
    <h5>{{firstName}} {{lastName}} - {{instrument}}</h5>
    <div>{{#each registrations}}</div>
    <div>{{confirmation}}   {{#each performers}} {{firstName}} {{lastName}} {{/each}}</div>
    <div>{{/each}}</div>    
    <div>{{/each}}</div>    
    <br>`

  onMounted(() => {
    documentStore.updateTemplate(templateString)
  })

  onBeforeUnmount(() => {
    template.value = ''
    jsonData.value = {}
    documentStore.isDirty = false
  })

  const { result, onResult } = useQuery(
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
    {
      teacherType: 'privateTeacher',
    },
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    }
  )

  onResult(async () => {
    if (await result.value) {
      documentStore.updateJsonData(result.value)
    } else {
      console.error('Expected data structure not found in query result')
    }
  })
</script>

<template>
  <div class="mx-auto p-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="flex flex-col gap-6">
        <PVCard>
          <template #title>
            <div class="p-1 flex justify-between items-center">
              <h2>Template</h2>
              <div class="flex gap-2" />
            </div>
          </template>
          <template #content>
            <div class="h-[400px] overflow-auto">
              <ClientOnly>
                <adminReportsRichTextEditor
                  v-model="template"
                  class="h-full" />
              </ClientOnly>
            </div>
          </template>
        </PVCard>

        <PVCard>
          <template #title>
            <div class="p-1 flex justify-between items-center">
              <h2>Data (JSON)</h2>
            </div>
          </template>
          <template #content>
            <div class="p-2 flex flex-col min-h-0 h-[400px] overflow-auto">
              <adminReportsDataEditor
                v-model="jsonData"
                class="h-full" />
            </div>
          </template>
        </PVCard>
      </div>

      <PVCard>
        <template #title>
          <div class="p-1 flex justify-between items-center">
            <h2>Generated Document</h2>
            <div class="flex gap-2" />
          </div>
        </template>
        <template #content>
          <div class="h-[1024px] overflow-hidden">
            <adminReportsDocumentPreview
              :data="jsonData"
              class="h-full" />
          </div>
        </template>
      </PVCard>
    </div>
  </div>
</template>

<style scoped></style>
