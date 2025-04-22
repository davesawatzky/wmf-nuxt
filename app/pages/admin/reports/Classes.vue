<template>
  <div class="mx-auto p-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="flex flex-col gap-6">
        <PVCard>
          <template #title>
            <div class="p-1 flex justify-between items-center">
              <h2>Template</h2>
              <div class="flex gap-2">
                <!-- <Button
                  variant="primary"
                  size="lg"
                  icon="lucide:save"
                  title="Save">
                  Save
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon="lucide:upload"
                  title="Load">
                  Load
                </Button> -->
              </div>
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
            <div class="flex gap-2"></div>
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

<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const documentStore = useDocumentStore()
  const { template, jsonData } = storeToRefs(documentStore)

  watchEffect(() => {
    console.log('Template:', template.value)
  })
</script>

<style scoped></style>
