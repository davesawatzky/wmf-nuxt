<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
    middleware: 'admin',
  })

  const documentStore = useDocumentStore()
  const { template, jsonData } = storeToRefs(documentStore)
  const templateString = `<div>{{#each performers}}</div>
    <h5>{{firstName}} {{lastName}}</h5>
    <div>{{registration.confirmation}}</div>
    <div>{{registration.photoPermission}}</div>
    <div>{{#each registration.registeredClasses}}</div>
    <div>Class {{classNumber}} - {{subdiscipline}}, {{level}}, {{category}}</div>
    <div>{{#each selections}}</div>
    <div>{{title}} - {{composer}}
    {{@if movement}} - {{movement}} - {{/if}}
    {{@if largerWork}} - {{largerWork}} - {{/if}}
    {{@if duration}} - {{duration}} {{/if}}</div>
    <div>{{/each}}</div>
    <br>
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

  const { result, onResult } = useQuery(gql`
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
    },
    null,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    }
  `)

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
