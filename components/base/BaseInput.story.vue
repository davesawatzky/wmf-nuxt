<script setup lang="ts">
  import BaseInput from './BaseInput.vue'
</script>

<template>
  <Story
    title="Component/BaseInput"
    :layout="{ type: 'grid', width: '300px' }">
    <Variant title="Text">
      <BaseInput
        type="text"
        name="text"
        label="Text Input"
        placeholder="Texting"
        helpMessage="This is a text message"
        :status="StatusEnum.saved">
      </BaseInput>
    </Variant>
    <Variant title="Number">
      <BaseInput
        type="number"
        name="number">
      </BaseInput>
    </Variant>
    <Variant title="Postal Code">
      <BaseInput
        type="text"
        name="postalCode">
      </BaseInput>
    </Variant>
    <Variant title="Phone">
      <BaseInput
        type="tel"
        name="telephone">
      </BaseInput>
    </Variant>
    <Variant title="Email">
      <BaseInput
        type="email"
        name="email">
      </BaseInput>
    </Variant>
  </Story>
</template>
