<script setup lang="ts">
  import { usePerformers } from '@/stores/userPerformer'
  import { useRegistration } from '@/stores/userRegistration'

  const registrationStore = useRegistration()
  const performerStore = usePerformers()

  async function addPerformer(registrationId: number) {
    await performerStore.createPerformer(registrationId)
  }
  async function removePerformer(performerId: number) {
    await performerStore.deletePerformer(performerId)
  }
</script>

<template>
  <div
    v-auto-animate
    class="py-8">
    <h2 class="pb-4">Performer Information</h2>
    <div
      v-for="(performer, performerIndex) in performerStore.performers"
      :key="performer.id">
      <div class="pt-8">
        <h4 class="pb-4">Performer #{{ performerIndex + 1 }}</h4>
        <FormPerformerInfo
          v-model="performerStore.performers[performerIndex]"
          groupperformer
          :performer-index="performerIndex"
          :performer-id="performer.id" />
      </div>
      <div class="pt-4">
        <BaseButton
          v-if="
            performerIndex + 1 === performerStore.performers.length
              ? true
              : false
          "
          class="btn btn-blue mb-6"
          @click="addPerformer(registrationStore.registrationId)">
          Add Another Performer
        </BaseButton>
        <BaseButton
          v-if="performerStore.performers.length > 1 ? true : false"
          class="btn btn-red mb-6"
          @click="removePerformer(performer.id)">
          Remove This Performer
        </BaseButton>
        <br /><br />
        <svg viewBox="0 0 800 2">
          <line
            x1="0"
            x2="800"
            stroke="black" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
