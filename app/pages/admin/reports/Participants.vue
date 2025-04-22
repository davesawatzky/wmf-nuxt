<template>
  <div class="mx-auto px-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="flex flex-col gap-6">
        <div class="card">
          <div class="toolbar">
            <h2 class="section-title">Template</h2>
            <div class="toolbar-actions">
              <!-- <Button variant="primary" size="lg" icon="lucide:save" title="Save">
                Save
              </Button>
              <Button variant="secondary" size="lg" icon="lucide:upload" title="Load">
                Load
              </Button> -->
            </div>
          </div>
          <div class="h-[600px] overflow-hidden">
            <ClientOnly>
              <adminReportsRichTextEditor
                v-model="template"
                class="h-full" />
            </ClientOnly>
          </div>
        </div>

        <div class="card">
          <!-- Removed flex-1 from card -->
          <div class="toolbar">
            <h2 class="section-title">Data (JSON)</h2>
          </div>
          <div class="editor-container h-[400px] overflow-hidden">
            <adminReportsDataEditor
              v-model="jsonData"
              class="h-full" />
          </div>
        </div>
      </div>

      <div class="card">
        <!-- Removed flex-1 from card -->
        <div class="toolbar">
          <h2 class="section-title">Generated Document</h2>
          <div class="toolbar-actions">
            <!-- <Button variant="secondary" icon="refresh">Auto-refresh</Button> -->
          </div>
        </div>
        <div class="h-[1024px] overflow-hidden">
          <adminReportsDocumentPreview
            :data="jsonData"
            class="h-full" />
        </div>
      </div>
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

<style scoped>
  .card {
    display: flex;
    flex-direction: column;
    /* Removed min-height here, let content dictate height */
    border: 1px solid #ccc;
    /* Added border for visual separation */
    border-radius: 0.5rem;
    /* Optional: Add rounded corners */
    overflow: hidden;
    /* Important: Prevents content overflow */
  }

  .toolbar {
    padding: 0.3rem;
    border-bottom: 1px solid #ccc;
    /* Separator between toolbar and content */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .toolbar-actions {
    display: flex;
    gap: 0.5rem;
  }

  .editor-container {
    display: flex;
    flex-direction: column;
    min-height: 0;
    /*  Essential for flexbox to work correctly */
    padding: 0.5rem;
  }

  .section-title {
    font-weight: bold;
  }
</style>
