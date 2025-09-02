<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const documentStore = useDocumentStore()
  const { template, jsonData } = storeToRefs(documentStore)
  const templateString = `<div>{{#each registeredClasses}}</div>
    <h5>CLASS {{classNumber}} - {{subdiscipline}}, {{level}}, {{category}}</h5>
    <div>{{#each performers}}</div>
    <div>{{firstName}} {{lastName}}, {{age}}, {{phone}}, {{email}}</div>
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
    documentStore.updateTemplate('')
    documentStore.updateJsonData({})
    documentStore.isDirty = false
  })

  const { result, loading, onResult, refetch } = useQuery(gql`
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
              <div class="flex gap-2"/>
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
            <div class="flex gap-2"/>
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
