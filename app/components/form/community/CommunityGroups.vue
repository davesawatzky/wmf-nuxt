<script setup lang="ts">
  import { useCommunityGroup } from '~/stores/useCommunityGroup'
  import { useCommunity } from '~/stores/useCommunity'

  const communityGroupStore = useCommunityGroup()
  const communityStore = useCommunity()

  async function addCommunityGroup(communityId: number) {
    await communityGroupStore.createCommunityGroup(communityId)
  }
  async function removeCommunityGroup(communityGroupId: number) {
    await communityGroupStore.deleteCommunityGroup(communityGroupId)
  }
</script>

<template>
  <div>
    <div
      v-auto-animate
      class="py-8">
      <h2 class="pb-4">Community Group Information</h2>
      <div
        v-for="(
          communityGrp, communityGroupIndex
        ) in communityGroupStore.communityGroup"
        :key="communityGrp.id">
        <div class="pt-8">
          <h4 class="pb-4">Community Group #{{ communityGroupIndex + 1 }}</h4>
          <FormCommunityGroup
            v-model="communityGroupStore.communityGroup[communityGroupIndex]!"
            :community-group-index="communityGroupIndex"
            :community-group-id="communityGrp.id" />
        </div>
        <div class="pt-4">
          <BaseButton
            v-if="
              communityGroupIndex + 1 ===
              communityGroupStore.communityGroup.length
                ? true
                : false
            "
            class="btn btn-blue mb-6"
            @click="addCommunityGroup(communityStore.community.id)">
            Add Another Community Group
          </BaseButton>
          <BaseButton
            v-if="communityGroupStore.communityGroup.length > 1 ? true : false"
            class="btn btn-red mb-6"
            @click="removeCommunityGroup(communityGrp.id)">
            Remove This Community Group
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
  </div>
</template>

<style lang="css" scoped></style>
