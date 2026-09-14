---
name: primevue-usage
description: Provides PrimeVue component usage patterns with Tailwind CSS integration. Use when implementing UI components, forms, tables, or looking up PrimeVue documentation.
---

# PrimeVue Component Usage

## Component Naming

Use **PV prefix** for all PrimeVue components: `PVButton`, `PVInputText`, `PVDataTable`

## Basic Form Pattern

```vue
<template>
  <PVCard>
    <template #title>Account Details</template>
    <template #content>
      <div class="flex flex-col gap-4">
        <PVFloatLabel>
          <PVInputText 
            id="email" 
            v-model="form.email" 
            type="email"
            :invalid="!isEmailValid"
          />
          <label for="email">Email Address</label>
        </PVFloatLabel>
        
        <PVButton 
          label="Save Account" 
          icon="pi pi-save"
          :loading="isSubmitting"
          @click="handleSubmit"
        />
      </div>
    </template>
  </PVCard>
</template>
```

## Tailwind CSS Integration

- Use Tailwind CSS 4.1+ with CSS-first configuration
- Prefer utility classes over custom CSS
- Use responsive patterns: `sm:`, `md:`, `lg:`, `xl:`
- Use `@apply` sparingly

## Documentation Lookup

**Always use Context7 and PrimeVue MCP tools for documentation**:
- `mcp_context7_resolve-library-id` to find library ID
- `mcp_context7_get-library-docs` to retrieve docs
- `primevue_find_components_with_feature` to locate components by feature
- `primevue_get_component` to get component details
- `primevue_get_guide` for usage guides
- `primevue_list_components` for full component list

Essential for:
- PrimeVue - UI components (props, events, slots)
- Nuxt - Framework features, composables
- Pinia / @pinia/colada - State management
- VueUse - Utility composables
- Tailwind CSS - Utilities and configuration


